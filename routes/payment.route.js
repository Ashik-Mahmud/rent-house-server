const router = require("express").Router();


const VerifyToken = require("../middlewares/VerifyToken");
const VerifyUser = require("../middlewares/VerifyUser");
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

// @routes GET /api/payment/holder/payment-statement
// @desc Get all the statement for logged User
// @access private
router.get("/holder/payment-statement", VerifyToken, VerifyUser, paymentController.getPaymentStatementForHouseHolder)


// @routes GET /api/payment/delete-statement
// @desc Delete a statement
// @access private
router.delete("/delete-statement/:id", VerifyToken, paymentController.deletePaymentStatement)

// @routes GET /api/payment/get-all-reports
// @desc Get all reports
// @access private
router.get("/get-all-reports", VerifyToken, paymentController.getAllPaymentReports)

// @routes POST /api/payment/send-thanks-email
// @desc Send thanks email to user
// @access private
router.post("/send-thanks-email", VerifyToken, VerifyUser, paymentController.sendThanksEmail)


// @routes GET /api/payment/ssl-request
// @desc Request for payment with SSL
// @access private

router.get("/sslcommerz/create-session", VerifyToken,  paymentController.initSSLCOMMERZMethod)


// @routes POST /api/payment/ssl-response
// @desc Response for payment with SSL
// @access private
router.post("/sslcommerz/success", paymentController.sslcommerzResponse)


// @routes POST /api/payment/ssl-fail
// @desc Fail for payment with SSL
// @access private
router.post("/sslcommerz/fail", paymentController.sslcommerzFail)

// @routes POST /api/payment/ssl-cancel
// @desc Cancel for payment with SSL
// @access private
router.post("/sslcommerz/cancel", paymentController.sslcommerzCancel)


//exports
module.exports = router;