var TAG = "OrderRepository";

var util = require('../../util');
var _ = require('lodash');

var InvalidResource = require('../../errors/InvalidResource');

module.exports = function (db) {
    var OrderRepository = {};

    var CustomerRepository = require('../customer/CustomerRepository')(db);
    var CouponRepository = require('../coupon/CouponRepository')(db);
    var ProductRepository = require('../product/ProductRepository')(db);
    var CartRepository = require('../cart/CartRepository')(db);

    OrderRepository.getOrdersByCustomerId = function(customerId) {
        var orders = {};

        return CustomerRepository.getCustomer(customerId)
            .then(function(customer) {
                orders.customer = customer;

                return db('order')
                    .select('id', 'order_date', 'status')
                    .where('customer_id', customerId)
                    .then(function(data) {
                            orders.orders = _.reduce(data, function(arr, item) {
                                arr.push({
                                    "id": item.id,
                                    "order_date": util.getStandardDate(item.order_date),
                                    "status": item.status
                                });

                                return arr;
                            }, []);

                        return orders;
                    });
            });
    };

    OrderRepository.getOrdersByStatus = function(status) {
        var orders = {};

        return db('order')
            .select('id', 'order_date')
            .where('status', status)
            .then(function(data) {
                orders.status = status;
                orders.orders = _.reduce(data, function(arr, item) {
                    arr.push({
                        "id": item.id,
                        "order_date": util.getStandardDate(item.order_date)
                    });

                    return arr;
                }, []);

                return orders;
            });
    };

    OrderRepository.updateStatus = function(orderId, status) {
        return db('order')
            .update('status', status)
            .where('id', orderId)
            .returning(['id'])
            .then(function(orderId) {
                return getOrder(orderId)
                    .then(function(order) {
                        return order;
                    });
            });
    };

    function getOrder(orderId) {
        return db('order')
            .select('id', 'status', 'order_date')
            .then(function(orders) {
                orders[0].order_date = util.getStandardDate(orders[0].order_date);
                return orders[0];
            });
    }

    OrderRepository.getOrderDetail = function(orderId) {
        var order = {};
        orderId = parseInt(orderId);

        return db('order')
            .select('id', 'coupon_id', 'status', 'order_date', 'name', 'phone', 'email', 'address', 'proof', 'customer_id')
            .where('id', orderId)
            .then(function(data) {
                order.order = {
                    "id": data[0].id,
                    "status": data[0].status,
                    "order_date": data[0].order_date,
                    "name": data[0].name,
                    "phone": data[0].phone,
                    "email": data[0].email,
                    "address": data[0].address,
                    "proof": data[0].proof
                };

                return CustomerRepository.getCustomer(data[0].customer_id)
                    .then(function(customer) {
                        order.customer = customer;
                        return CouponRepository.getCoupon(data[0].coupon_id)
                            .then(function(coupon) {
                                order.coupon = coupon;
                                return ProductRepository.getOrderItems(orderId)
                                    .then(function(orderItems) {
                                        order.order_item = orderItems;
                                        order.subtotal = util.calculateSubtotal(orderItems);
                                        order.discount = util.calculateDiscount(order.subtotal, coupon);
                                        order.total = util.calculateTotal(order.subtotal, order.discount);

                                        return order;
                                    });
                            });
                    })
            });
    };

    OrderRepository.createOrder = function(customerId, name, phone, email, address) {
        var order = {};

        return CartRepository.getCart(customerId)
            .then(function(cart) {
                if(validateCoupon(cart.coupon) && validateCartItems(cart.cart_item)) {
                    return migrateCartToOrder(cart, name, phone, email, address)
                        .then(function(orderId) {
                            return OrderRepository.getOrderDetail(orderId)
                                .then(function(order) {
                                    return order;
                                });
                        });
                }
            });
    };

    function validateCoupon(coupon) {
        var startDate = new Date(coupon.start_valid_date);
        var endDate = new Date(coupon.end_valid_date);
        var currentDate = new Date();

        if(currentDate >= startDate && currentDate <= endDate) {
            if(parseInt(coupon.stock) > 0) {
                return true;
            }
            return new InvalidResource("Coupon " + coupon.name + " is out of stock");
        }
        else {
            return new InvalidResource("Coupon " + coupon.name + " is out of date");
        }
    }

    function validateCartItems(cartItems) {
        return _.reduce(cartItems, function(isValid, cartItem) {
            var currentIsValid = parseInt(cartItem.stock) >= parseInt(cartItem.quantity);

            if(!currentIsValid) {
                return new InvalidResource("Product " + cartItem.name + " is out of stock");
            }
            return isValid;
        }, true);
    }

    function migrateCartToOrder(cart, name, phone, email, address) {
        var customer = cart.customer;
        var coupon = cart.coupon;
        var cartItems = cart.cart_item;

        return db('order')
            .returning('id')
            .insert({
                'customer_id': customer.id,
                'coupon_id': coupon.id,
                'status': 'submitted',
                'order_date': util.getStandardDate(new Date()),
                'name': name,
                'phone': phone,
                'email': email,
                'address': address
            })
            .then(function(orderId) {
                var orderItems = cartItems.map(function(cartItem) {
                    return {
                        'order_id': parseInt(orderId),
                        'product_id': parseInt(cartItem.id),
                        'quantity': cartItem.quantity
                    };
                });

                return db.batchInsert('order_item', orderItems, 1000)
                    .then(function() {
                        return deleteCart(customer.id)
                            .then(function() {
                                return decreaseCouponQuantity(coupon)
                                    .then(function() {
                                        return decreaseProductsQuantity(cartItems)
                                            .then(function() {
                                                return orderId;
                                            });
                                    });
                            });
                    });
            });
    }

    function deleteCart(customerId) {
        return db('cart')
            .del()
            .where('customer_id', customerId)
            .then(function() {
                return db('cart_item')
                    .del()
                    .where('customer_id', customerId)
                    .then();
            });
    }

    function decreaseCouponQuantity(coupon) {
        return db('coupon')
            .returning('id')
            .where('id', coupon.id)
            .update('stock', parseInt(coupon.stock)-1)
            .then(function(couponId) {
                return couponId;
            });
    }

    function decreaseProductsQuantity(cartItems) {
        var queries = _.reduce(cartItems, function(promises, cartItem) {
            var promise = db('product')
                .where('id', cartItem.id)
                .update('stock', parseInt(cartItem.stock) - parseInt(cartItem.quantity));
            promises.push(promise);

            return promises;
        }, []);

        return Promise.all(queries);
    }

    return OrderRepository;
};