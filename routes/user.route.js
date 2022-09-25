const router = require('express').Router();

/* Import Controllers */
const usersController = require('../controllers/user.controller');

/* Init Controllers */
router.post("/create", usersController.createUser)
router.patch("/update-profile", usersController.updateProfile)
router.post("/login", usersController.loginUser)
router.post("/reset-password", usersController.resetPassword)
router.post("/change-password", usersController.changePassword)
router.get('/', usersController.getUsers);


module.exports = router;