
// @routes /api/v1/reviews/public-review
// @desc Public review

const { Reviews } = require("../models/review.model");
const { createPublicReviewService, createReviewForHouseService } = require("../services/review.services");

// @access  public
const createPublicReview = async (req, res) => {
    const { name,  rating, comment } = req.body;
    /* simple validation */
    if(!name || !rating || !comment){
        return res.status(400).json({
            success: false,
            message: "Please fill all fields"
        })
    }
    try {
        const review = await createPublicReviewService({ ...req.body });
        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: review
        })    


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// @routes /api/v1/reviews/create-review-for-house
// @desc Create review for house
// @access Private
const createReviewForHouse = async (req, res) => {
    const { name,  id , rating, comment } = req.body;
   
    
    /* simple validation */
    if(!rating || !comment || !id || !name ){
        return res.status(400).json({
            success: false,
            message: "Please fill all fields"
        })
    }
    try {
        
        const review = await createReviewForHouseService({ ...req.body, house: id });
        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: review
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// @routes /api/v1/reviews/get-reviews-by-house-id
// @desc Get all reviews by house id
// @access Public
const getAllReviewsByHouseId = async (req, res) => {
    const { id } = req.params;
    try {
        const reviews = await Reviews.find({ house: id });
        res.status(200).json({
            success: true,
            data: reviews
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// @routes /api/v1/reviews/delete-review-by-id
// @desc Delete review by id
// @access Private
const deleteReviewById = async (req, res) => {
    const { id } = req.params;
    try {
        const review = await Reviews.findById(id);
        if(!review){
            return res.status(404).json({
                success: false,
                message: "Review not found"
            })
        }
        await review.remove();
        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}






module.exports = { createPublicReview, createReviewForHouse, getAllReviewsByHouseId, deleteReviewById };