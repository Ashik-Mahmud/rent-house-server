const router = require('express').Router();

/* Import Controllers */
const reportHouseController = require('../controllers/reportHouse.controller');
const VerifyToken = require('../middlewares/VerifyToken');

/* Init Routes */
router.post("/create", reportHouseController.createReport);


module.exports = router;