var TAG = "CartManager";

module.exports = function(CartRepository) {
    var CartManager = {};

    CartManager.addItem = function(customerId, productId, quantity) {
        return CartRepository.addItem(customerId, productId, quantity);
    };

    return CartManager;
};