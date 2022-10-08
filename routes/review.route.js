const router = require('express').Router();

/* Import Controllers */
const reviewController = require('../controllers/review.controller');
const VerifyToken = require('../middlewares/VerifyToken');

/* Init Routes */
router.post("/create-review", VerifyToken, reviewController.createReview);
router.get("/get-reviews-by-user/:id",  VerifyToken, reviewController.getAllReviewByUserId);
router.delete("/delete-review/:id", VerifyToken, reviewController.deleteReviewById);




router.post("/create-review-for-house", reviewController.createReviewForHouse);
router.get("/get-reviews-by-house-id/:id", reviewController.getAllReviewsByHouseId);


module.exports = router;