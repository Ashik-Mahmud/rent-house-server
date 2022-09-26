/* Ask Question to the Users Services*/
const Question = require("../models/question.model");

exports.createQuestionService = async (data) => {
    const newQuestion = await Question.create(data);
    return newQuestion;
}

/* Get All the Question by the House ID  Services*/
exports.getQuestionsForHouseService = async(id) =>{
    const result = await Question.find({house: id})
    return result;
}

