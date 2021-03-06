var TAG = "OrderManager";

module.exports = function(OrderRepository) {
    var OrderManager = {};

    OrderManager.getOrdersByCustomerId = function(customerId) {
        return OrderRepository.getOrdersByCustomerId(customerId);
    };

    OrderManager.getOrdersByStatus = function(customerId) {
        return OrderRepository.getOrdersByStatus(customerId);
    };

    OrderManager.updateStatus = function(orderId, status) {
        return OrderRepository.updateStatus(orderId, status);
    };

    OrderManager.getOrderDetail = function(orderId) {
        return OrderRepository.getOrderDetail(orderId);
    };

    OrderManager.createOrder = function(customerId, name, phone, email, address) {
        return OrderRepository.createOrder(customerId, name, phone, email, address);
    };

    return OrderManager;
};