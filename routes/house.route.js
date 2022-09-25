const router = require('express').Router();
const VerifyToken = require("./../middlewares/VerifyToken")
/* Import Controllers */
const houseController = require('../controllers/house.controller');

/* Init Controllers */
router.post("/create", VerifyToken, houseController.createHouse);
router.get('/', houseController.getAllHouses);
router.patch("/update/:id", VerifyToken, houseController.updateHouse);
router.delete("/delete/:id", VerifyToken, houseController.deleteHouse);
router.get('/:id', houseController.getHouseById);

/* change house status */
router.patch("/is-booked/:id", VerifyToken, houseController.changeIsBooked);

module.exports = router;