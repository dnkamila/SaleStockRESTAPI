var TAG = "OrderRouter";

var express = require('express');

module.exports = function (OrderManager) {
    var router = express.Router();

    router.get('/customer/:customerId', function(req, res) {
        req.checkParams('customerId', 'customerId is required and must be an integer').notEmpty().isInt();

        req.asyncValidationErrors()
            .then(function() {
                var customerId = req.params.customerId;

                return OrderManager.getOrdersByCustomerId(customerId)
                    .then(function(orders) {
                        return res.json(orders);
                    })
                    .catch(function(err) {
                        return errorHandler(res, err);
                    });
            })
            .catch(function(err) {
                return errorHandler(res, err);
            });
    });

    router.get('/status/:status', function(req, res) {
        req.checkParams('status', 'status is required').notEmpty();

        req.asyncValidationErrors()
            .then(function() {
                var status = req.params.status;

                return OrderManager.getOrdersByStatus(status)
                    .then(function(orders) {
                        return res.json(orders);
                    })
                    .catch(function(err) {
                        return errorHandler(res, err);
                    });
            })
            .catch(function(err) {
                return errorHandler(res, err);
            });
    });

    router.put('/:orderId/:status', function(req, res) {
        req.checkParams('orderId', 'orderId is required and must be an integer').notEmpty().isInt();
        req.checkParams('status', 'status is required').notEmpty();

        req.asyncValidationErrors()
            .then(function() {
                var orderId = req.params.orderId;
                var status = req.params.status;

                return OrderManager.updateStatus(orderId, status)
                    .then(function (order) {
                        return res.json(order);
                    })
                    .catch(function (err) {
                        return errorHandler(res, err);
                    });
            })
            .catch(function (err) {
                return errorHandler(res, err);
            });
    });

    router.get('/:orderId', function(req, res) {
        req.checkParams('orderId', 'orderId is required and must be an integer').notEmpty().isInt();

        req.asyncValidationErrors()
            .then(function() {
                var orderId = req.params.orderId;

                return OrderManager.getOrderDetail(orderId)
                    .then(function(order) {
                        return res.json(order);
                    })
                    .catch(function(err) {
                        return errorHandler(res, err);
                    });
            })
            .catch(function(err) {
                return errorHandler(res, err);
            });
    });

    return router;
};