const {PublicReviews, Reviews} = require("../models/review.model");

/* Create Public Review Services */
exports.createPublicReviewService = async (body) => {
    try {
        const review = await PublicReviews.create(body);
        return review;
    } catch (error) {
        console.log(error.message);
    }
}


/* Create Review Services for House  */
exports.createReviewForHouseService = async (body) => {
    try {
        const review = await Reviews.create(body);
        return review;
    } catch (error) {
        console.log(error.message);
    }
}