var TAG = "OrderManager";

module.exports = function(OrderRepository) {
    var OrderManager = {};

    OrderManager.getOrdersByCustomerId = function(customerId) {
        return OrderRepository.getOrdersByCustomerId(customerId);
    };

    return OrderManager;
};