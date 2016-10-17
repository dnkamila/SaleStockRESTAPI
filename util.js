var TAG = "util";

var util = require('util');

var IllegalArgumentError = require('./errors/IllegalArgumentError');
var ResourceNotFound = require('./errors/ResourceNotFound');
var DuplicateData = require('./errors/DuplicateData');
var InvalidResource = require('./errors/InvalidResource');

var _ = require('lodash');

module.exports.errorHandler = function(res, err) {
    console.log(err);
    if (Array.isArray(err)) {
        res.status(400).json({message: 'Validation error: ${util.inspect(err)}'});
    }
    else if (err instanceof IllegalArgumentError) {
        res.status(404).json({message: err.message});
    }
    else if (err instanceof ResourceNotFound || err instanceof InvalidResource) {
        res.status(404).json({message: err.message});
    }
    else if (err instanceof DuplicateData) {
        res.status(409).json({message: err.message});
    }
    else {
        res.status(500).json({message: 'Internal server error'});
    }
};

module.exports.getStandardDate = function(date) {
    return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
};

module.exports.calculateSubtotal = function(items) {
    return _.reduce(items, function(sum, item) {
        return sum + parseInt(item.price) * parseInt(item.quantity);
    }, 0);
};

module.exports.calculateDiscount = function(subtotal, coupon) {
    console.log(TAG + " " + coupon);
    if(isEmpty(coupon)) {
        return 0;
    }

    if(coupon.type == "percentage") {
        return parseInt(subtotal) * parseInt(coupon.amount) / 100;
    }
    else if(coupon.type == "nominal") {
        return coupon.amount;
    }
    else {
        return new IllegalArgumentError("Cart coupon type " + coupon.type + " is not exist");
    }
};

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

module.exports.calculateTotal = function(subtotal, discount) {
    return subtotal - discount;
};