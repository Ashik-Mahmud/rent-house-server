// @routes api/v1/questions/ask-question
// @desc Ask question

const {
  createQuestionService,
  getQuestionsForHouseService,
  findQuestionByIdService,
  getQuestionsByAuthorService,
} = require("../services/question.services");
const Question = require("../models/question.model");

// @access Private
const askQuestion = async (req, res) => {
  try {
    const { question, author } = req.body;
    /* Simple Validation */
    if (!author || !question) {
      return res.status(400).json({
        success: false,
        message: "Please enter all fields",
      });
    }
    const newQuestion = await createQuestionService({
      ...req.body,
      author: author,
      house: req.params.houseId,
    });
    res.status(200).json({
      success: true,
      message:
        "Question goes to review panel. If question is related to the houses then it will be accepted otherwise delete.",
      data: newQuestion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @routes api/v1/questions/delete-question
// @desc Delete question
// @access Private
const deleteQuestionById = async (req, res) => {
  try {
    const question = await findQuestionByIdService(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }
    await question.remove();
    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @routes GET api/question/questions-for-house/:id
// @desc Get All the questions for particular house
// @access Private

const getQuestionsForHouse = async (req, res) => {
  const { limit, page } = req.query;
  const houseId = req.params.id;
 

  try {
    let filters = {};

    if (limit && page) {
      const skip = (page - 1) * limit;
      filters = {
        limit: parseInt(limit),
        skip: parseInt(skip),
      };
    }

    const questions = await getQuestionsForHouseService(houseId, filters);
    const count = await Question.countDocuments({ house: houseId });
    res.send({
      success: true,
      message: "Found Questions",
      data: questions,
      count,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message,
    });
  }
};

// @routes PATCH api/questions/accept-question
// @desc Accept Question
// @access Private

const acceptQuestionAndAnswer = async (req, res) => {
  const { questionId, answer } = req.body;

  try {
    const question = await findQuestionByIdService(questionId);
    if (question.accepted === false) {
      question.accepted = true;
      question.answer = answer;
    } else {
      question.accepted = false;
      question.answer = "none";
    }
    await question.save();
    res.status(201).send({
      success: true,
      message: "Question Accepted and answered Successfully done",
      data: question,
    });
  } catch (err) {
    res.status(404).send({
      success: false,
      message: "Server Error",
    });
  }
};

// @routes DELETE api/questions/delete-question/:id
// @desc DELETE question by ID
// @access private

const deleteQuestion = async (req, res) => {
  const deleteId = req.params.id;
  try {
    const question = await findQuestionByIdService(deleteId);
    await question.remove();
    res.status(201).send({
      success: true,
      message: "Question Deleted successfully done.",
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "Server Error" + error.message,
    });
  }
};

// @routes GET api/questions/questions-by-author/:authorId
// @desc Get All the questions by author
// @access Private

const getQuestionByAuthor = async (req, res) => {
  const authorId = req.params.authorId;

  try {
    const questions = await getQuestionsByAuthorService(authorId);
    if (!questions) {
      return res.status(404).send({
        success: false,
        message: "No questions found",
      });
    }

    res.send({
      success: true,
      message: "Found Questions",
      data: questions,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  askQuestion,
  getQuestionsForHouse,
  acceptQuestionAndAnswer,
  deleteQuestion,
  getQuestionByAuthor,
  deleteQuestionById,
};
