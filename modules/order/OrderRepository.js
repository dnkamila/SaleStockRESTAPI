var TAG = "OrderRepository";

var util = require('../../util');
var _ = require('lodash');

module.exports = function (db) {
    var OrderRepository = {};

    var CustomerRepository = require('../customer/CustomerRepository')(db);
    var CouponRepository = require('../coupon/CouponRepository')(db);
    var ProductRepository = require('../product/ProductRepository')(db);

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
                        console.log(customer.id);
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

    return OrderRepository;
};