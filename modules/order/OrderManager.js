var TAG = "OrderManager";

module.exports = function(OrderRepository) {
    var OrderManager = {};

    OrderManager.getOrdersByCustomerId = function(customerId) {
        return OrderRepository.getOrdersByCustomerId(customerId);
    };

    OrderManager.getOrdersByStatus = function(customerId) {
        return OrderRepository.getOrdersByStatus(customerId);
    };

    return OrderManager;
};