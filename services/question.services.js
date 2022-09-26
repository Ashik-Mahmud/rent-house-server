/* Ask Question to the Users Services*/
const Question = require("../models/question.model");

exports.createQuestionService = async (data) => {
    const newQuestion = await Question.create(data);
    return newQuestion;
}

