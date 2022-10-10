const router = require("express").Router();
const blogController = require("../controllers/blogs.controller")


router.post("/create", blogController.createBlog);
router.get("/blogs-by-uid/:id", blogController.getBlogsByUserID)
router.get("/blog/:id" , blogController.getBlogById)



module.exports = router;