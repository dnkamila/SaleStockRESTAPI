var TAG = "[api]";

var NODE_ENV = process.env.NODE_ENV;
if(NODE_ENV !== 'test') {
    console.log('must be run in test environment');
    process.exit(1);
}

var async = require('async');
var qs = require('qs');
const path = require('path');
var request = require('supertest');
var assert = require('assert');

var app = require('../index');
var db = require('../index').db;

var TABLES = [
    'customer',
    'product',
    'coupon',
    'cart_item',
    'cart',
    'order_item',
    'order'
];

var TRUNCATE_TABLES = [
    'cart_item',
    'cart',
    'order_item',
    'order'
];

function truncateTables() {
    var promise = Promise.resolve();
    TRUNCATE_TABLES.forEach(function(table) {
        return promise.then(function() {
            console.log("truncate table " + table);
            return db.raw("TRUNCATE " + table + " CASCADE");
        });
    });
    return promise;
}

describe('SaleStockRESTAPI', function() {
    beforeEach(function(done) {
        return truncateTables()
            .then(function() {
                done();
            });
    });

    describe('Cart', function() {
        it('should return empty cart detail', function(done) {
            var params = {
                "id": 1,
                "name": "kamila"
            };

            var expected = {
                "id": 1,
                "name": "kamila"
            };

            return request(app)
                .get('/cart/' + params.id)
                .expect(200)
                .expect(function(res) {
                    var data = res.body;

                    assert.equal(data.customer.id, expected.id);
                    assert.equal(data.customer.name, expected.name);
                    assert.equal(data.coupon, {});
                    assert.equal(data.cart_item, []);
                    assert.equal(data.subtotal, 0);
                    assert.equal(data.discount, 0);
                    assert.equal(data.total, 0);
                }, done);
        });

        it('should return the cart item just created', function(done) {
             var params = {
                 "customerId": 1,
                 "productId": 1,
                 "quantity": 2
             };

            var expectedAddItem = {
                "customer": {
                    "id": "1",
                    "name": "kamila"
                },
                "product": {
                    "id": "1",
                    "name": "adidas all star",
                    "price": 1250000,
                    "stock": 25
                },
                "quantity": 2
            };

            var expectedGetCart = {
                "customer": {
                    "id": "1",
                    "name": "kamila"
                },
                "coupon": {},
                "cart_item": [
                    {
                        "id": "1",
                        "name": "adidas all star",
                        "price": 1250000,
                        "stock": 25,
                        "quantity": 2
                    }
                ],
                "subtotal": 2500000,
                "discount": 0,
                "total": 2500000
            };

            async.series([
                function(rs) {
                    return request(app)
                        .post('/cart/addItem').send(qs.stringify(params))
                        .expect(200)
                        .expect(function(res) {
                            var data = res.body;

                            assert.equal(data.customer.id, expectedAddItem.customer.id);
                            assert.equal(data.customer.name, expectedAddItem.customer.name);
                            assert.equal(data.product.id, expectedAddItem.product.id);
                            assert.equal(data.product.name, expectedAddItem.product.name);
                            assert.equal(data.product.price, expectedAddItem.product.price);
                            assert.equal(data.product.stock, expectedAddItem.product.stock);
                            assert.equal(data.quantity, expectedAddItem.quantity);
                        })
                        .end(rs);
                },
                function(rs) {
                    return request(app)
                        .get('/cart/' + productId)
                        .expect(200)
                        .expect(function(res) {
                            var data = res.body;

                            assert.equal(data.customer.id, expectedGetCart.customer.id);
                            assert.equal(data.customer.name, expectedGetCart.customer.name);
                            assert.equal(data.coupon, {});
                            assert.equal(data.subtotal, expectedGetCart.subtotal);
                            assert.equal(data.discount, expectedGetCart.discount);
                            assert.equal(data.total, expectedGetCart.total);
                            assert.equal(data.cart_item.id, expectedAddItem.cart_item.id);
                            assert.equal(data.cart_item.name, expectedAddItem.cart_item.name);
                            assert.equal(data.cart_item.price, expectedAddItem.cart_item.price);
                            assert.equal(data.cart_item.stock, expectedAddItem.cart_item.stock);
                        })
                        .end(rs);
                }
            ], done);
        });
    });
});