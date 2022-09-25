const router = require('express').Router();
const VerifyToken = require("./../middlewares/VerifyToken")
/* Import Controllers */
const houseController = require('../controllers/house.controller');
const ViewsCount = require('../middlewares/ViewsCount');

/* Init Controllers */
router.get('/', houseController.getAllHouses);
router.get("/top-4-houses", houseController.getTop4Houses);
router.get('/:id', ViewsCount, houseController.getHouseById);
router.patch('/like-count/:id', houseController.toggleLikeHouse);

/* Private Routes */
router.post("/create", VerifyToken, houseController.createHouse);
router.patch("/update/:id", VerifyToken, houseController.updateHouse);
router.delete("/delete/:id", VerifyToken, houseController.deleteHouse);

/* change house status */
router.patch("/is-booked/:id", VerifyToken, houseController.changeIsBooked);

module.exports = router;