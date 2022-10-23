/* Ask Question to the Users Services*/
const House = require("../models/house.model");
const Question = require("../models/question.model");

exports.createQuestionService = async (data) => {
  const newQuestion = await Question.create(data);
  const house = await House.findById(data?.house);
  if (house) {
    house.totalQuestions = house.totalQuestions + 1;
    await house.save();
  }
  return newQuestion;
};

/* Get All the Question by the House ID  Services*/
exports.getQuestionsForHouseService = async (id, filters) => {
  const result = await Question.find({ house: id })
    .skip(filters.skip)
    .limit(filters.limit)
    .populate("author", "name email profileImage role");
  return result;
};

/* Find Question By ID Services */
exports.findQuestionByIdService = async (id) => {
  const result = await Question.findById(id);
  return result;
};

/* Find Questions by Author ID */
exports.getQuestionsByAuthorService = async (id, houseId) => {
  const result = await Question.find({ author: id, house: houseId });
  return result;
};
