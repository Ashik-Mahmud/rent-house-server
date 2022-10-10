const router = require("express").Router();
const blogController = require("../controllers/blogs.controller");
const ViewBlogCount = require("../middlewares/ViewBlogCoun");


router.post("/create", blogController.createBlog);
router.get("/blogs-by-uid/:id", blogController.getBlogsByUserID)
router.get("/blog/:id" , ViewBlogCount,  blogController.getBlogById)
router.patch("/update/:id", blogController.updateBlogById)
router.delete("/delete/:id", blogController.deleteBlogById)
router.patch("/change-status/:id", blogController.changeAvailable);
router.patch("/like/:id", blogController.toggleLikeBlog);





module.exports = router;