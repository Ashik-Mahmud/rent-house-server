const router = require('express').Router();

/* Import Controllers */
const requestController = require('../controllers/request.controller');
const VerifyToken = require('../middlewares/VerifyToken');

/* Init Routes */

// @routes POST api/v1/request/for-blog
// @desc Send Request for Blog
// @access private
router.post("/for-blog", VerifyToken, requestController.createBlogRequest);


module.exports = router;