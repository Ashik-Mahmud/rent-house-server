const router = require('express').Router();
const VerifyToken = require("./../middlewares/VerifyToken")
/* Import Controllers */
const houseController = require('../controllers/house.controller');

/* Init Controllers */
router.post("/create", VerifyToken, houseController.createHouse);
router.get('/', houseController.getAllHouses);

module.exports = router;