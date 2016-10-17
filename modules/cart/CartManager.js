var TAG = "CartManager";

module.exports = function(CartRepository) {
    var CartManager = {};

    CartManager.addItem = function(customerId, productId, quantity) {
        return CartRepository.addItem(customerId, productId, quantity);
    };

    CartManager.addCoupon = function(customerId, couponId) {
        return CartRepository.addCoupon(customerId, couponId);
    };

    CartManager.getCart = function(customerId) {
        return CartRepository.getCart(customerId);
    };

    return CartManager;
};