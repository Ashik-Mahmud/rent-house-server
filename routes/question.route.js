const router = require('express').Router();

/* Import Controllers */
const questionController = require('../controllers/question.controller');
const VerifyToken = require('../middlewares/VerifyToken');

/* Init Routes */
router.post("/ask-question/:houseId", questionController.askQuestion);
router.get("/questions-for-house/:id", VerifyToken, questionController.getQuestionsForHouse);
router.patch("/answer-question", VerifyToken, questionController.acceptQuestionAndAnswer);
router.delete("/delete-question/:id", VerifyToken, questionController.deleteQuestion)


module.exports = router;