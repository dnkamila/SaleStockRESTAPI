var util = require('util');
var IllegalArgumentError = require('./errors/IllegalArgumentError');
var ResourceNotFound = require('./errors/ResourceNotFound');
var DuplicateData = require('./errors/DuplicateData');
var InvalidResource = require('./errors/InvalidResource');

module.exports.errorHandler = function(res, err) {
    console.log(err);
    if (Array.isArray(err))
        res.status(400).json({message: 'Validation error: ${util.inspect(err)}'});
    else if (err instanceof IllegalArgumentError)
        res.status(404).json({message: err.message});
    else if (err instanceof ResourceNotFound || err instanceof InvalidResource)
        res.status(404).json({message: err.message});
    else if (err instanceof DuplicateData)
        res.status(409).json({message: err.message});
    else
        res.status(500).json({message: 'Internal server error'});
};

module.exports.getStandardDate = function(date) {
    return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
};
