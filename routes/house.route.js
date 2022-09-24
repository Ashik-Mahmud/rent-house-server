const router = require('express').Router();

/* Import Controllers */
const houseController = require('../controllers/house.controller');

/* Init Controllers */
router.get('/', houseController.getHouse);

module.exports = router;