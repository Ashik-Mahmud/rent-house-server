const router = require('express').Router();

/* Import Controllers */
const usersController = require('../controllers/user.controller');
const VerifyToken = require('../middlewares/VerifyToken');

/* Init Controllers */
router.post("/create", usersController.createUser)
router.patch("/update-profile", usersController.updateProfile)
router.post("/login", usersController.loginUser)
router.post("/reset-password", usersController.resetPassword)
router.post("/change-password", usersController.changePassword)
router.get('/', usersController.getUsers);

router.get("/houses", VerifyToken, usersController.getHouseByUserId)

module.exports = router;