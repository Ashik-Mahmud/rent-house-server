const router = require('express').Router();

/* Import Controllers */
const reviewController = require('../controllers/review.controller');
const VerifyToken = require('../middlewares/VerifyToken');

/* Init Routes */
router.post("/create-public-review", reviewController.createPublicReview);
router.post("/create-review-for-house", reviewController.createReviewForHouse);
router.get("/get-reviews-by-house-id/:id", reviewController.getAllReviewsByHouseId);

router.delete("/delete-review/:id", VerifyToken, reviewController.deleteReviewById);

module.exports = router;