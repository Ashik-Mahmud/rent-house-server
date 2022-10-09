const router = require("express").Router();
const VerifyToken = require("../middlewares/VerifyToken");
const multer = require("multer");
const path = require("path");
/* Import Controllers */
const houseController = require("../controllers/house.controller");
const ViewsCount = require("../middlewares/ViewsCount");
const VerifyUser = require("../middlewares/VerifyUser");


/* Config for Upload Preview Image */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "galleryImage") {
      cb(null, "./uploads/gallery/");
    } else if (file.fieldname === "previewImage") {
      cb(null, "./uploads/previews/");
    }
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
    if (file.fieldname === "galleryImage") {
      cb(null, "gallery-" + fileName + fileExt);
    } else {
      cb(null, "preview-" + fileName + fileExt);
    }
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

/* Init Controllers */
router.get("/", houseController.getAllHouses);
router.get("/top-4-houses", houseController.getTop4Houses);
router.get("/:id", ViewsCount, houseController.getHouseById);
router.patch("/like-count/:id", houseController.toggleLikeHouse);

/* Private Routes */
router.post(
  "/create",
  VerifyToken,VerifyUser,
  upload.fields([
    { name: "previewImage", maxCount: 1 },
    { name: "galleryImage", maxCount: 5 },
  ]),
  houseController.createHouse
);
router.get("/get-house-by-user/:id", VerifyToken, houseController.getHouseByUserID);
router.patch("/update/:id", VerifyToken, houseController.updateHouse);
router.delete("/delete/:id", VerifyToken, houseController.deleteHouse);

/* change house status */
router.patch("/is-booked/:id", VerifyToken, houseController.changeIsBooked);

module.exports = router;
