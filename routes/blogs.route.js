const router = require("express").Router();
const blogController = require("../controllers/blogs.controller");
const ViewBlogCount = require("../middlewares/ViewBlogCoun");
const VerifyToken = require("../middlewares/VerifyToken")


router.post("/create", VerifyToken, blogController.createBlog);
router.get("/blogs-by-uid/:id",VerifyToken, blogController.getBlogsByUserID)
router.get("/blog/:id" , ViewBlogCount,  blogController.getBlogById)
router.patch("/update/:id", VerifyToken, blogController.updateBlogById)
router.delete("/delete/:id",VerifyToken, blogController.deleteBlogById)
router.patch("/change-status/:id",VerifyToken, blogController.changeAvailable);
router.patch("/like/:id", blogController.toggleLikeBlog);
router.get("/all", blogController.getAllBlog)





module.exports = router;