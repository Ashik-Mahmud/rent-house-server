const router = require('express').Router();
const VerifyToken = require("./../middlewares/VerifyToken")
/* Import Controllers */
const houseController = require('../controllers/house.controller');

/* Init Controllers */
router.get('/', VerifyToken, houseController.getHouse);

module.exports = router;