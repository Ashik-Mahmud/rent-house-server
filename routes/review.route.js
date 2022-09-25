const router = require('express').Router();

/* Import Controllers */
const reviewController = require('../controllers/review.controller');

/* Init Routes */
router.post("/public-review", reviewController.publicReview);

module.exports = router;