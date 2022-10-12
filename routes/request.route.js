const router = require('express').Router();

/* Import Controllers */
const requestController = require('../controllers/request.controller');
const VerifyAdmin = require('../middlewares/VerifyAdmin');
const VerifyToken = require('../middlewares/VerifyToken');

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
router.patch("/approve-blog/:id", VerifyToken, VerifyAdmin, requestController.approveBlogRequest);

// @routes delete api/v1/request/reject-blog/:id
// @desc Rejection Blog Request
// @access private
router.delete("/cancel-request/:id", VerifyToken, VerifyAdmin, requestController.rejectBlogRequest);

//@routes Post api/v1/request/for-house
//@desc Send request for house
//@access private
router.post("/for-house", VerifyToken, requestController.createHouseHolderRequest);


module.exports = router;