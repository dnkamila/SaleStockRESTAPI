var db = require('./db');

var cartRepository = require('./modules/cart/CartRepository')(db);
var cartManager = require('./modules/cart/CartManager')(cartRepository);
var cartRouter = require('./modules/cart/CartRouter')(cartManager);

var orderRepository = require('./modules/order/OrderRepository')(db);
var orderManager = require('./modules/order/OrderManager')(orderRepository);
var orderRouter = require('./modules/order/OrderRouter')(orderManager);

var app = require('./app')(cartRouter, orderRouter);

module.exports = app;
module.exports.db = db;