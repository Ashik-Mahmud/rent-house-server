const router = require('express').Router();

/* Import Controllers */
const questionController = require('../controllers/question.controller');
const VerifyToken = require('../middlewares/VerifyToken');

/* Init Routes */
router.post("/ask-question/:houseId", questionController.askQuestion);
router.get("/questions-for-house/:id", VerifyToken, questionController.getQuestionsForHouse);
router.patch("/accept-question", VerifyToken, questionController.acceptQuestion)


module.exports = router;