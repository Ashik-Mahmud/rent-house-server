// @routes api/v1/questions/ask-question
// @desc Ask question
// @access Private
const askQuestion = async (req, res) => {
    try {
        const { house, user, question } = req.body;
        const newQuestion = await createQuestionService({ house, user, question });
        res.status(200).json({
            success: true,
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