const { Reviews, ReviewsForHouse } = require("../models/review.model");

/* Create Public Review Services */
exports.createReviewService = async (body) => {
    try {
        const review = await Reviews.create(body);
        return review;
    } catch (error) {
        console.log(error.message);
    }
}


/* Create Review Services for House  */
exports.createReviewForHouseService = async (body) => {
    try {
        const review = await ReviewsForHouse.create(body);
        return review;
    } catch (error) {
        console.log(error.message);
    }
}

/* Reviews Services Find by ID */
exports.findByIdReviewService = async (id) => {
    try {
        const review = await ReviewsForHouse.findById(id);
        return review;
    } catch (error) {
        console.log(error.message);
    }
}