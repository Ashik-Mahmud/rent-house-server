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
router.get("/all-request", VerifyToken, VerifyAdmin, requestController.getAllBlogRequestsUsers);

// @routes put api/v1/request/approve-blog/:id


module.exports = router;