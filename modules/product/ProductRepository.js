var TAG = "ProductRepository";

module.exports = function (db) {
    var ProductRepository = {};

    ProductRepository.getCartItems = function(customerId) {
        return db('cart_item as ci')
            .where('ci.customer_id', customerId)
            .join('product as p', 'ci.product_id', '=', 'p.id')
            .select('p.id', 'p.name', 'p.price', 'p.stock', 'ci.quantity')
            .then(function(cartItems) {
                return cartItems;
            });
    };

    ProductRepository.getOrderItems = function(orderId) {
        return db('order_item as oi')
            .where('oi.order_id', orderId)
            .join('product as p', 'oi.product_id', '=', 'p.id')
            .select('p.id', 'p.name', 'p.price', 'p.stock', 'oi.quantity')
            .then(function(orderItems) {
                return orderItems;
            });
    };

    return ProductRepository;
};