const router = require('express').Router();

/* Import Controllers */
const adminController = require('../controllers/admin.controller');
const VerifyAdmin = require('../middlewares/VerifyAdmin');
const VerifyToken = require('../middlewares/VerifyToken');
const VerifySupAdmin = require("../middlewares/VerifySupAdmin")
/* Init Routes */
router.patch('/accept/:id', VerifyToken, VerifyAdmin, adminController.acceptHouse);
router.patch('/reject/:id', VerifyToken, VerifyAdmin, adminController.rejectHouse);
router.get("/users", VerifyToken, VerifyAdmin, adminController.getAllUsers);
router.patch("/action-user/:id", VerifyToken, VerifyAdmin, adminController.actionUser);
router.delete("/delete-user/:id", VerifyToken, VerifyAdmin, adminController.deleteUser);
router.post("/emails/send", VerifyToken, VerifyAdmin, adminController.sendEmailToUsers);
router.patch("/make-admin/:id", VerifyToken, VerifyAdmin, adminController.makeAdmin)
router.post("/change-app-name", VerifyToken, VerifySupAdmin, adminController.changeAppName)

router.get("/houses/:slug", VerifyToken, VerifyAdmin, adminController.getHouseByQuery);


// public routes
router.get("/app-options",  adminController.getAppOptions)


module.exports = router;