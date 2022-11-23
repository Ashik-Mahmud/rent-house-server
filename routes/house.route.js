const router = require("express").Router();
const VerifyToken = require("../middlewares/VerifyToken");
const multer = require("multer");
const path = require("path");
/* Import Controllers */
const houseController = require("../controllers/house.controller");
const ViewsCount = require("../middlewares/ViewsCount");
const VerifyUser = require("../middlewares/VerifyUser");



/* Config for Upload Preview Image */

const upload = multer({
  storage: multer.diskStorage({}),
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

/* Init Controllers */


router.get("/get-holder-reports/:id", VerifyToken, VerifyUser, houseController.getHouseHolderReports);
/* Get top 4 Houses per user */
router.get("/top-3-houses-by-user", VerifyToken, VerifyUser, houseController.getTop3HouseByUser);
/* change house status */
router.get("/house-prices",  houseController.housePrices);

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
router.get("/get-house-by-user/:id", VerifyToken, VerifyUser, houseController.getHouseByUserID);
router.patch("/update/:id", VerifyToken,VerifyUser, houseController.updateHouse);
router.delete("/delete/:id", VerifyToken, VerifyUser, houseController.deleteHouse);




module.exports = router;
