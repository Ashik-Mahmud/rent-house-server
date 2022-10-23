const appReview = require("../models/AppReview");
const {  ReviewsForHouse } = require("../models/review.model");

/* Create Public Review Services */
exports.createReviewService = async (body) => {
    try {
        const review = await appReview.create({...body, author: body.author.userId});
        return review;
    } catch (error) {
        console.log(error.message);
    }
}

/* Get Reviews By User ID */
exports.getAllReviewsByUserId = async(id)=>{
    try {
        const reviews = await appReview.find({author: id});
        return reviews;
    } catch (error) {
        console.error(error.message);
    }
}




/**
 * @review only for House
 * @param {*} body 
 * @returns 
 */

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
exports.findByIdReviewService = async (id, reviewApp , houseReview) => {
    try {
        if(reviewApp){
            const review = await appReview.findById(id);
            return review;
        }
        if(houseReview){
            const review = await ReviewsForHouse.findById(id);
            return review;
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

