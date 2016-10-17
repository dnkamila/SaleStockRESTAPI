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

    return router;
};