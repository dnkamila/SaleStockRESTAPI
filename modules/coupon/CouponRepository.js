var TAG = "CouponRepository";

var util = require('../../util');

module.exports = function (db) {
    var CouponRepository = {};

    CouponRepository.getCoupon = function(couponId) {
        return db('coupon')
            .select('*')
            .where('id', couponId)
            .then(function(coupons) {
                coupons[0].start_valid_date = util.getStandardDate(coupons[0].start_valid_date);
                coupons[0].end_valid_date = util.getStandardDate(coupons[0].end_valid_date);
                return coupons[0];
            });
    };

    CouponRepository.getCouponByCustomerId = function(customerId) {
        console.log(customerId);
        return db('cart')
            .select('*')
            .where('customer_id', customerId)
            .then(function(cartCoupons) {
                console.log(JSON.stringify(cartCoupons));
                if(!cartCoupons[0]) {
                    return {};
                }

                return CouponRepository.getCoupon(cartCoupons[0].coupon_id)
                    .then(function(coupon) {
                        return coupon;
                    });
            })
    };

    return CouponRepository;
};