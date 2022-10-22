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

/* Find Question By ID Services */
exports.findQuestionByIdService = async(id) =>{
    const result = await Question.findById(id);
    return result;
}


/* Find Questions by Author ID */
exports.getQuestionsByAuthorService = async(id) =>{
    const result = await Question.find({author: id});
    return result;
}
