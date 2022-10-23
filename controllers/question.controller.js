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
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    question.accepted = true;
    question.answer = answer;
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

// @routes GET api/questions/questions-by-author/:authorId
// @desc Get All the questions by author
// @access Private

const getQuestionByAuthor = async (req, res) => {
  const authorId = req.params.authorId;
  const { houseId } = req.query;

    
  try {
    const questions = await getQuestionsByAuthorService(authorId, houseId);
      
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

const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ accepted: true, house: req.params.id }).select("question answer").populate("author", "name email profileImage role avatar");
    res.status(200).json({
      success: true,
      message: "All questions",
      data: questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  askQuestion,
  getQuestionsForHouse,
  acceptQuestionAndAnswer,
  getQuestionByAuthor,
  deleteQuestionById,
  getAllQuestions,
};
