const router = require("express").Router();
const blogController = require("../controllers/blogs.controller")


router.post("/create", blogController.createBlog)



module.exports = router;