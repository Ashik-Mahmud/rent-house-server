const PublicReviews = require("../models/review.model");

/* Create Public Review Services */
exports.createPublicReviewService = async (body) => {
    try {
        const review = await PublicReviews.create(body);
        return review;
    } catch (error) {
        console.log(error.message);
    }
}
