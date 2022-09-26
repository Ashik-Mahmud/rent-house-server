// @routes api/v1/questions/ask-question
// @desc Ask question

const { createQuestionService } = require("../services/question.services");

// @access Private
const askQuestion = async (req, res) => {
    
    try {
        const { name,email , question } = req.body;
        /* Simple Validation */
        if(!name || !email || !question){
            return res.status(400).json({
                success: false,
                message: "Please enter all fields"
            });
        }

        const newQuestion = await createQuestionService({ ...req.body , house: req.params.houseId });
        res.status(200).json({
            success: true,
            message: "Question goes to review panel. If its right question it will be accepted otherwise delete.",
            data: newQuestion
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { askQuestion }