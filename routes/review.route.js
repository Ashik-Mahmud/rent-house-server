const router = require('express').Router();

/* Import Controllers */
const reviewController = require('../controllers/review.controller');

/* Init Routes */
router.post("/create-public-review", reviewController.createPublicReview);
router.post("/create-review-for-house", reviewController.createReviewForHouse);

module.exports = router;