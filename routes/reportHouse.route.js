const router = require('express').Router();

/* Import Controllers */
const reportHouseController = require('../controllers/reportHouse.controller');
const VerifyToken = require('../middlewares/VerifyToken');
const VerifyUser = require('../middlewares/VerifyUser');

/* Init Routes */
router.post("/create", reportHouseController.createReport);
router.get("/reports-by-house/:id", VerifyToken, VerifyUser, reportHouseController.reportsForHouse)
router.delete("/delete/:id", VerifyToken, VerifyUser, reportHouseController.deleteReport);


module.exports = router;