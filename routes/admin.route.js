const router = require('express').Router();

/* Import Controllers */
const adminController = require('../controllers/admin.controller');
const VerifyAdmin = require('../middlewares/VerifyAdmin');
const VerifyToken = require('../middlewares/VerifyToken');

/* Init Routes */
router.patch('/accept/:id', VerifyToken, VerifyAdmin, adminController.acceptHouse);
router.patch('/reject/:id', VerifyToken, VerifyAdmin, adminController.rejectHouse);
router.get("/users", VerifyToken, VerifyAdmin, adminController.getAllUsers);
router.patch("/action-user/:id", VerifyToken, VerifyAdmin, adminController.actionUser);
router.delete("/delete-user/:id", VerifyToken, VerifyAdmin, adminController.deleteUser);
router.post("/emails/send", VerifyToken, VerifyAdmin, adminController.sendEmailToUsers);
router.patch("/make-admin/:id", VerifyToken, VerifyAdmin, adminController.makeAdmin)

module.exports = router;