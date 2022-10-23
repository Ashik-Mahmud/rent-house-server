const router = require("express").Router();

/* Import Controllers */
const reviewController = require("../controllers/review.controller");
const VerifyToken = require("../middlewares/VerifyToken");
const VerifyUser = require("../middlewares/VerifyUser");

/* Init Routes */
router.post("/create-review", VerifyToken, reviewController.createReview);
router.get(
  "/get-reviews-by-user/:id",
  VerifyToken,
  reviewController.getAllReviewByUserId
);

router.patch(
    "/update-review/:id",
    VerifyToken,
    reviewController.updateReviewById
  );
router.delete(
  "/delete-review/:id",
  VerifyToken,
  reviewController.deleteReviewById
);
router.get("/all", VerifyToken, reviewController.getAllReviews);

router.post(
  "/create-review-for-house",
  VerifyToken,
  reviewController.createReviewForHouse
);
router.get(
  "/get-reviews-by-house-id/:id",
  reviewController.getAllReviewsByHouseId
);
router.patch(
  "/accept-review/:id",
  VerifyToken,
  VerifyUser,
  reviewController.acceptReviewById
);


router.get("/all", VerifyToken, reviewController.getAllReviews);

module.exports = router;
