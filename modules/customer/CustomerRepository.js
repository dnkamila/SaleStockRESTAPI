var TAG = "CustomerRepository";

var util = require('util');

module.exports = function (db) {
    var CustomerRepository = {};

    CustomerRepository.getCustomerByCustomerId = function(customerId) {
        return db('customer')
            .select('id', 'name')
            .where('id', customerId)
            .then(function(customers) {
                return customers[0];
            });
    };

    return CustomerRepository;
};

module.exports.getCustomerByCustomerId = function(customerId) {
    return db('customer')
        .select('id', 'name')
        .where('id', customerId)
        .then(function(customers) {
            return customers[0];
        });
};
