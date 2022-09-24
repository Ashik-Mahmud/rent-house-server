const router = require('express').Router();

/* Import Controllers */
const usersController = require('../controllers/user.controller');

/* Init Controllers */
router.post("/create", usersController.createUser)
router.post("/login", usersController.loginUser)
router.get('/', usersController.getUsers);

module.exports = router;