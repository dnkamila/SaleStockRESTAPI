var TAG = "ProductRepository";

module.exports = function (db) {
    var ProductRepository = {};

    ProductRepository.getCartItemsByCustomerId = function(customerId) {
        return db('cart_item as ci')
            .where('ci.customer_id', customerId)
            .join('product as p', 'ci.product_id', '=', 'p.id')
            .select('p.id', 'p.name', 'p.price', 'p.stock', 'ci.quantity')
            .then(function(cartItems) {
                return cartItems;
            });
    };

    return ProductRepository;
};