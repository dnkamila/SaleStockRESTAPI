var TAG = "CartRepository";
var util = require('../../util');

module.exports = function (db) {
    var CartRepository = {};

    var CustomerRepository = require('../customer/CustomerRepository')(db);
    var CouponRepository = require('../coupon/CouponRepository')(db);
    var ProductRepository = require('../product/ProductRepository')(db);

    CartRepository.addItem = function(customerId, productId, quantity) {
        return db('cart_item')
            .insert({customer_id: customerId, product_id: productId, quantity: quantity})
            .returning(['customer_id', 'product_id'])
            .then(function(data) {
                return checkAddItem(data[0].customer_id, data[0].product_id)
                    .then(function(cartItem) {
                        return cartItem;
                    });
            });
    };

    function checkAddItem(customerId, productId) {
        return db('cart_item as ci')
            .join('customer as cu', 'customer_id', '=', 'cu.id')
            .join('product as p', 'product_id', '=', 'p.id')
            .select(
                'cu.id as customer_id',
                'cu.name as customer_name',
                'p.id as product_id',
                'p.name as product_name',
                'p.price',
                'p.stock',
                'ci.quantity')
            .where({
                'customer_id': customerId,
                'product_id': productId
            })
            .then(function(data) {
                if(!data[0]) return Promise.reject(new ResourceNotFound("Cart item with customerId " + customerId + " and productId " + productId + " is not found"));
                return {
                    "customer": {
                        "id": data[0].customer_id,
                        "name": data[0].customer_name
                    },
                    "product": {
                        "id": data[0].product_id,
                        "name": data[0].product_name,
                        "price": data[0].price,
                        "stock": data[0].stock
                    },
                    "quantity": data[0].quantity
                };
            });
    }

    CartRepository.addCoupon = function(customerId, couponId) {
        return db('cart')
            .insert({customer_id: customerId, coupon_id: couponId})
            .returning(['customer_id'])
            .then(function(data) {
                return checkAddCoupon(data[0].customer_id)
                    .then(function(cartCoupon) {
                        return cartCoupon;
                    });
            });
    };

    function checkAddCoupon(customerId) {
        return db('cart as c')
            .join('customer as cu', 'customer_id', '=', 'cu.id')
            .join('coupon as co', 'coupon_id', '=', 'co.id')
            .select(
                'cu.id as customer_id',
                'cu.name as customer_name',
                'co.id as coupon_id',
                'co.name as coupon_name',
                'co.start_valid_date',
                'co.end_valid_date',
                'co.stock',
                'co.type',
                'co.amount')
            .where('customer_id', customerId)
            .then(function(data) {
                if(!data[0]) return Promise.reject(new ResourceNotFound("Cart coupon with customerId " + customerId + " is not found"));
                return {
                    "customer": {
                        "id": data[0].customer_id,
                        "name": data[0].customer_name
                    },
                    "coupon": {
                        "id": data[0].coupon_id,
                        "name": data[0].coupon_name,
                        "start_valid_date": util.getStandardDate(data[0].start_valid_date),
                        "end_valid_date": util.getStandardDate(data[0].end_valid_date),
                        "stock": data[0].stock,
                        "type": data[0].type,
                        "amount": data[0].amount
                    }
                };
            });
    }

    CartRepository.getCart = function(customerId) {
        var cart = {};

        return CustomerRepository.getCustomer(customerId)
            .then(function(customer) {
                cart.customer = customer;

                return CouponRepository.getCouponByCustomerId(customerId)
                    .then(function(coupon) {
                        cart.coupon = coupon;

                        return ProductRepository.getCartItems(customerId)
                            .then(function(cartItems) {
                                cart.cart_item = cartItems;
                                cart.subtotal = util.calculateSubtotal(cartItems);
                                cart.discount = util.calculateDiscount(cart.subtotal, coupon);
                                cart.total = util.calculateTotal(cart.subtotal, cart.discount);

                                return cart;
                            });
                    });
            });
    };

    return CartRepository;
};