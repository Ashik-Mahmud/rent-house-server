const router = require('express').Router();

/* Import Controllers */
const requestController = require('../controllers/request.controller');
const VerifyAdmin = require('../middlewares/VerifyAdmin');
const VerifyToken = require('../middlewares/VerifyToken');
const VerifyUser = require('../middlewares/VerifyUser')

/* Init Routes */

// @routes POST api/v1/request/for-blog
// @desc Send Request for Blog
// @access private
router.post("/for-blog", VerifyToken, requestController.createBlogRequest);

// @routs get api/v1/request/all-request
// @desc Get All Blog Request
// @access private
router.get("/all-request", VerifyToken, VerifyAdmin, requestController.getAllRequestsUsers);

// @routes put api/v1/request/approve-blog/:id
// @desc Approve Blog Request
// @access private
router.patch("/approve-request/:id", VerifyToken, VerifyAdmin, requestController.approveRequest);

// @routes delete api/v1/request/reject-blog/:id
// @desc Rejection Blog Request
// @access private
router.delete("/cancel-request/:id", VerifyToken, VerifyAdmin, requestController.rejectBlogRequest);

//@routes Post api/v1/request/for-house
//@desc Send request for house
//@access private
router.post("/for-house", VerifyToken, requestController.createHouseHolderRequest);


// @routes GET api/v1/request/notifications
// @desc Get All the Notifications
// @access private
router.get("/notifications", VerifyToken, VerifyUser, requestController.getAllNotifications)


// @routes GET api/v1/request/reports-for-homepage
// @desc Get All the Reports for Homepage
// @access public
router.get("/reports-for-homepage", requestController.getAllReportsForHomepage)


module.exports = router;