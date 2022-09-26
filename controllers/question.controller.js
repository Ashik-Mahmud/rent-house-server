// @routes api/v1/questions/ask-question
// @desc Ask question

const { createQuestionService, getQuestionsForHouseService, findQuestionByIdService } = require("../services/question.services");

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


// @routes GET api/question/questions-for-house/:id
// @desc Get All the questions for particular house
// @access Private

const getQuestionsForHouse = async(req, res) =>{
    const houseId = req.params.id;
       
    try {
        const questions = await getQuestionsForHouseService(houseId)
        res.send({
            success: true,
            message: "Found Questions",
            data: questions
        })
        
    } catch (error) {
        res.status(404).send({
            success: false,
            message: error.message
        })
    }
}

// @routes PATCH api/questions/accept-question
// @desc Accept Question
// @access Private

const acceptQuestionAndAnswer = async(req, res) =>{
    const {questionId, answer} = req.body;
       
    try{
        const question = await findQuestionByIdService(questionId);
        if(question.accepted === false){
            question.accepted = true;
            question.answer = answer;
        }else{
            question.accepted = false;
            question.answer = "none";
        }
        await question.save();
        res.status(201).send({
            success: true,
            message: "Question Accepted and answered Successfully done",
            data: question
        })
    } catch(err){
        res.status(404).send({
            success: false,
            message: "Server Error"
        })
    }

}

module.exports = { askQuestion, getQuestionsForHouse,acceptQuestionAndAnswer}