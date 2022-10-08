const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const rateLimit = require('express-rate-limit')

/* Import Controllers */
const usersController = require("../controllers/user.controller");
const VerifyToken = require("../middlewares/VerifyToken");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/profiles/");
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      Date.now();
    cb(null, "profile-"+ fileName + fileExt);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000, //1MB
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only .png, .jpg, or .jpeg file allowed."));
    }
  },
});


/* Putting Limiter for Reset Password Routes */


const putLimiterForCallApi = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

/* Init Controllers */
router.post("/create", usersController.createUser);
router.get("/verify-email/:token", usersController.verifyEmail);
router.get("/verify-reset-password-email/:token", usersController.verifyResetPasswordMail);
router.patch("/update-profile", VerifyToken, usersController.updateProfile);
router.post("/change-profile-picture", VerifyToken, upload.single("profileImage"),  usersController.changeProfileImage);
router.post("/login", putLimiterForCallApi, usersController.loginUser);
router.post("/reset-password", putLimiterForCallApi,  usersController.resetPassword);
router.post("/change-password", usersController.changePassword);
router.get("/", usersController.getUsers);
router.get("/me/:id", VerifyToken, usersController.getUserById);
router.get("/houses", VerifyToken, usersController.getHouseByUserId);

module.exports = router;
