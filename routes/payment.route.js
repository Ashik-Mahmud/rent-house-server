const router = require("express").Router();


const VerifyToken = require("../middlewares/VerifyToken");
// imports controller
const paymentController = require("./../controllers/payment.controller");

// @routes GET /api/payment/payment-instance
// @desc Create a payment instance for Stripe
// @access secure
router.get("/payment-instance",VerifyToken, paymentController.createPaymentInstance)


//exports
module.exports = router;