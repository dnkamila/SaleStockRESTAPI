var TAG = "CartRepository";

module.exports = function (db) {
    var CartRepository = {};

    CartRepository.addItem = function(customerId, productId, quantity) {
        return db('cart_item')
            .insert({customer_id: customerId, product_id: productId, quantity: quantity})
            .returning(['customer_id', 'product_id'])
            .then(function(data) {
                return checkAddItem(data[0].customer_id, data[0].product_id)
                    .then(function(cartItem) {
                        return cartItem;
                    });
            });
    };

    function checkAddItem(customerId, productId) {
        return db('cart_item as ci')
            .join('customer as cu', 'customer_id', '=', 'cu.id')
            .join('product as p', 'product_id', '=', 'p.id')
            .select(
                'cu.id as customer_id',
                'cu.name as customer_name',
                'p.id as product_id',
                'p.name as product_name',
                'p.price as price',
                'p.stock as stock',
                'ci.quantity')
            .where({
                'customer_id': customerId,
                'product_id': productId
            })
            .then(function(data) {
                if(!data[0]) return Promise.reject(new ResourceNotFound("Cart Item with customerId " + customerId + " and productId " + productId + " is not found"));
                return {
                    "customer": {
                        "id": data[0].customer_id,
                        "name": data[0].customer_name
                    },
                    "product": {
                        "id": data[0].product_id,
                        "name": data[0].product_name,
                        "price": data[0].price,
                        "stock": data[0].stock
                    },
                    "quantity": data[0].quantity
                };
            });
    }

    return CartRepository;
};