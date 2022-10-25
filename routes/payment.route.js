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

// @routes GET /api/payment/booked-houses
// @desc Get all booked houses
// @access private
router.get("/booked-houses", VerifyToken, paymentController.getBookedHouses)

// @routes GET /api/payment/payment-statement
// @desc Get all the statement for logged User
// @access private
router.get("/payment-statement", VerifyToken, paymentController.getPaymentStatement)

// @routes GET /api/payment/delete-statement
// @desc Delete a statement
// @access private
router.delete("/delete-statement/:id", VerifyToken, paymentController.deletePaymentStatement)



//exports
module.exports = router;