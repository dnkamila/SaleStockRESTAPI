var TAG = "CartRouter";

var express = require('express');

var util = require('../../util');
var errorHandler = util.errorHandler;

module.exports = function (CartManager) {
    var router = express.Router();

    router.post('/addItem', function(req, res) {
        req.checkBody('customerId', 'customerId is required and must be an integer').notEmpty().isInt();
        req.checkBody('productId', 'productId is required and must be an integer').notEmpty().isInt();
        req.checkBody('quantity', 'quantity is required and must be an integer').notEmpty().isInt();

        req.asyncValidationErrors()
            .then(function() {
                var customerId = req.body.customerId;
                var productId = req.body.productId;
                var quantity = req.body.quantity;

                return CartManager.addItem(customerId, productId, quantity)
                    .then(function(cartItem) {
                        return res.json(cartItem);
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