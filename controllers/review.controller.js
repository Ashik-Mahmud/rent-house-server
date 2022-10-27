// @routes /api/v1/reviews/public-review
// @desc Public review

const appReview = require("../models/AppReview");
const { Reviews, ReviewsForHouse } = require("../models/review.model");
const { getHouseByIdService } = require("../services/house.services");
const {
  createReviewService,
  createReviewForHouseService,
  findByIdReviewService,
  getAllReviewsByUserId,
} = require("../services/review.services");

// @access  public
const createReview = async (req, res) => {
  const { author, rating, content } = req.body;

  /* simple validation */
  if (!rating || !content || !author.userId) {
    return res.status(400).json({
      success: false,
      message: "Please fill all fields",
    });
  }
  try {
    const review = await createReviewService({ ...req.body });
    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @routes /api/v1/reviews/get-all-reviews-by-userId
// @desc Get all reviews by id
// @access Private
const getAllReviewByUserId = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "bad request",
    });
  }
  try {
    const reviews = await getAllReviewsByUserId(id);
    res.status(201).json({
      success: true,
      message: "Get all reviews successfully",
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @routes /api/v1/reviews/create-review-for-house
// @desc Create review for house
// @access Private
const createReviewForHouse = async (req, res) => {
  const { author, house, rating, comment } = req.body;

  /* simple validation */
  if (!rating || !comment || !house || !author) {
    return res.status(400).json({
      success: false,
      message: "Please fill all fields",
    });
  }

  try {
    const isUserReviewed = await ReviewsForHouse.find({
      house: house,
      author: author,
    });

    if (isUserReviewed.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this house before",
      });
    }

    const review = await createReviewForHouseService({
      ...req.body,
      house: house,
    });
    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @routes /api/v1/reviews/accept-review-by-id
// @desc Accept review by id
// @access Private
const acceptReviewById = async (req, res) => {
  const { id } = req.params;
  const { houseId, houseReview } = req.query;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "bad request",
    });
  }

  try {
    const review = await findByIdReviewService({ id, houseReview, houseId });
    if (!review) {
      return res.status(400).json({
        success: false,
        message: "Review not found",
      });
    }
    review.isAccepted = true;
    await review.save();
    res.status(201).json({
      success: true,
      message: "Accept review successfully",
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @routes /api/v1/reviews/get-reviews-by-house-id
// @desc Get all reviews by house id
// @access Public
const getAllReviewsByHouseId = async (req, res) => {
  const { id } = req.params;

  try {
    const reviews = await ReviewsForHouse.find({
      house: id,
      isAccepted: true,
    }).populate("author");
    const getAllReviewsForHolder = await ReviewsForHouse.find({
      house: id,
    }).populate("author");

    res.status(200).json({
      success: true,
      data: reviews,
      internal: {
        count: reviews.length,
        countAll: getAllReviewsForHolder.length,
        data: getAllReviewsForHolder,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @routes /api/v1/reviews/delete-review-by-id
// @desc Delete review by id
// @access Private
const deleteReviewById = async (req, res) => {
  const { id } = req.params;
  const { houseId } = req.query;

  try {
    const review = await ReviewsForHouse.findById(id)
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }
    await review.remove();
    const house = await getHouseByIdService(houseId);
    if(house){
        house.totalReviews = house.totalReviews - 1;
    }
    await house.save();
    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @routes /api/v1/reviews/update-review-by-id
// @desc Update review by id
// @access Private
const updateReviewById = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  try {
    const review = await findByIdReviewService(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }
    review.rating = rating;
    review.comment = comment;
    await review.save();
    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @routes /api/v1/reviews/get-all-reviews
// @desc Get all reviews
// @access Private
const getAllReviews = async (req, res) => {
  try {
    const reviews = await appReview.find().populate("author", "name avatar profileImage");
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




module.exports = {
  createReview,
  createReviewForHouse,
  getAllReviewsByHouseId,
  deleteReviewById,
  getAllReviewByUserId,
  getAllReviews,
  updateReviewById,
  acceptReviewById,
 
};
