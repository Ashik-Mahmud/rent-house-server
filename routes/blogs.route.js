const router = require("express").Router();
const blogController = require("../controllers/blogs.controller")


router.post("/create", blogController.createBlog);
router.get("/blogs-by-uid/:id", blogController.getBlogsByUserID)
router.get("/blog/:id" , blogController.getBlogById)
router.get("/update/:id", blogController.updateBlogById)




module.exports = router;