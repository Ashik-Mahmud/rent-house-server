
// @routes /api/v1/reviews/public-review
// @desc Public review
// @access  public
const publicReview = async (req, res) => {
    const { houseId, rating, comment } = req.body;
    try {
        const house = await findByIdHouseService(houseId);
        if(!house){
            return res.status(404).json({
                success: false,
                message: "House not found"
            })
        }
        const review = await createReviewService({
            houseId,
            rating,
            comment
        });
        res.status(200).json({
            success: true,
            message: "Review created successfully",
            review
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { publicReview };