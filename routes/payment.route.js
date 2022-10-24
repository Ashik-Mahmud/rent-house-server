const router = require("express").Router();


const VerifyToken = require("../middlewares/VerifyToken");
// imports controller
const paymentController = require("./../controllers/payment.controller");

// @routes GET /api/payment/payment-instance
// @desc Create a payment instance for Stripe
// @access secure
router.post("/create-payment-instance", VerifyToken, paymentController.createPaymentInstance)

//@routes POST /api/payment/save-booked-house
// @desc Saved booked house info W
// @access private
router.post("/bookings", VerifyToken, paymentController.saveBookings)


//exports
module.exports = router;