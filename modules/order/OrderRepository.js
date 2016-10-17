var TAG = "OrderRepository";

var util = require('../../util');
var _ = require('lodash');

module.exports = function (db) {
    var OrderRepository = {};

    OrderRepository.getOrdersByCustomerId = function(customerId) {
        var orders = {};

        var CustomerRepository = require('../customer/CustomerRepository')(db);
        var CouponRepository = require('../coupon/CouponRepository')(db);
        var ProductRepository = require('../product/ProductRepository')(db);

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
                return getOrderByOrderId(orderId)
                    .then(function(order) {
                        return order;
                    });
            });
    };

    function getOrderByOrderId(orderId) {
        return db('order')
            .select('id', 'status', 'order_date')
            .then(function(orders) {
                orders[0].order_date = util.getStandardDate(orders[0].order_date);
                return orders[0];
            });
    }

    return OrderRepository;
};