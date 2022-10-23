const appReview = require("../models/AppReview");
const House = require("../models/house.model");
const { ReviewsForHouse } = require("../models/review.model");

/* Create Public Review Services */
exports.createReviewService = async (body) => {
  try {
    const review = await appReview.create({
      ...body,
      author: body.author.userId,
    });
    return review;
  } catch (error) {
    console.log(error.message);
  }
};

/* Get Reviews By User ID */
exports.getAllReviewsByUserId = async (id) => {
  try {
    const reviews = await appReview.find({ author: id });
    return reviews;
  } catch (error) {
    console.error(error.message);
  }
};

/**
 * @review only for House
 * @param {*} body
 * @returns
 */

/* Create Review Services for House  */
exports.createReviewForHouseService = async (body) => {
  try {
    const review = await ReviewsForHouse.create(body);
    const house = await House.findById(body.house);
    if (house) {
      house.totalReviews = house.totalReviews + 1;
      house.save();
    }
    return review;
  } catch (error) {
    console.log(error.message);
  }
};

/* Reviews Services Find by ID */
exports.findByIdReviewService = async ({
  id,
  reviewApp,
  houseReview,
  houseId,
}) => {
  try {
    if (reviewApp) {
      const review = await appReview.findById(id);
      return review;
    }
    if (houseReview) {
      const review = await ReviewsForHouse.findById(id);
      return review;
    }
  } catch (error) {
    console.log(error.message);
  }
};
