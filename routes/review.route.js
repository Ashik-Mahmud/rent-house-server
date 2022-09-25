const router = require('express').Router();

/* Import Controllers */
const reviewController = require('../controllers/review.controller');

/* Init Routes */
router.post("/create-public-review", reviewController.createPublicReview);

module.exports = router;