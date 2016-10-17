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
            console.log(`truncate table ${table}`);
            return db.raw(`TRUNCATE ${table} CASCADE`);
        });
    });
    return promise;
}

describe('SaleStock REST API', function() {
    this.timeout(3000);

    beforeEach(function(done) {
        return truncateTables()
            .then(function() {
                done();
            });
    });

    describe('Cart', function() {
        it('should return empty cart item', function(done) {
            var params = {customerId:1};

            return request(app)
                .get(`/cart/getItems/${params.customerId}`)
                .expect(200)
                .expect([], done);
        });

        it('should return the cart item just created', function(done) {
            var params = {customerId:1, productId:1, quantity:2};

            var customerId = null;
            var productId = null;
            var quantity = null;

            async.series([
                function(rs) {
                    return request(app)
                        .post('/cart/addItem').send(qs.stringify(params))
                        .expect(200)
                        .expect(function(res) {
                            var body = res.body;

                            customerId = body.customer_id;
                            productId = body.product_id;

                            assert.equal(customerId, params.customerId);
                            assert.equal(productId, params.productId);
                            assert.equal(body.quantity, params.quantity);
                        })
                        .end(rs);
                },
                function(rs) {
                    return request(app)
                        .get(`/cart/getItem/${customerId}/${productId}`)
                        .expect(200)
                        .expect(function(res) {
                            var body = res.body;

                            customerId = body.customer_id;
                            productId = body.product_id;
                            quantity = body.quantity;

                            assert.equal(customerId, params.customerId);
                            assert.equal(productId, params.productId);
                            assert.equal(quantity, params.quantity);
                        })
                        .end(rs);
                }
            ], done);
        });

        it('should return empty cart coupon', function(done) {
            var params = {customerId:1, couponId:1};

            return request(app)
                .get(`/cart/getCoupon/${params.customerId}`)
                .expect(200)
                .expect({}, done);
        });

        it('should return the cart coupon just created', function(done) {
            var params = {customerId:1, couponId:1};

            var customerId = null;
            var couponId = null;

            /*return request(app)
                .post('/cart/addCoupon').send(qs.stringify(params))
                .expect(200)
                .expect(function(res) {
                    var body = res.body;

                    customerId = body.customer_id;
                    couponId = body.coupon_id;

                    assert.equal(customerId, params.customerId);
                    assert.equal(couponId, params.couponId);
                }, done);*/

            async.series([
                function(rs) {
                    return request(app)
                        .post('/cart/addCoupon').send(qs.stringify(params))
                        .expect(200)
                        .expect(function(res) {
                            var body = res.body;

                            customerId = body.customer_id;
                            couponId = body.coupon_id;

                            assert.equal(customerId, params.customerId);
                            assert.equal(couponId, params.couponId);
                        })
                        .end(rs);
                },
                function(rs) {
                    return request(app)
                        .get(`/cart/getCoupon/${customerId}`)
                        .expect(200)
                        .expect(function(res) {
                            var body = res.body;

                            customerId = body.customer_id;
                            couponId = body.coupon_id;

                            assert.equal(customerId, params.customerId);
                            assert.equal(couponId, params.couponId);
                        })
                        .end(rs);
                }
            ], done);
        });
    });
});