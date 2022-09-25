const router = require('express').Router();

/* Import Controllers */
const questionController = require('../controllers/question.controller');
const VerifyToken = require('../middlewares/VerifyToken');

/* Init Routes */
router.post("/ask-question", questionController.askQuestion);


module.exports = router;