
// @routes /api/v1/reviews/public-review
// @desc Public review

const { createPublicReviewService } = require("../services/review.services");

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

module.exports = { createPublicReview };