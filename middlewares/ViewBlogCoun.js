const Blog = require("../models/blog.model");


/* Views Count */
const ViewBlogCount = (req, res, next) => {
    const { id } = req.params;
    if (id) {
        Blog.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
            .then((house) => {
                if (!house) {
                    return res.status(404).json({
                        success: false,
                        message: "Blog not found",
                    });
                }
                next();
            })
            .catch((error) => {
                res.status(500).json({
                    success: false,
                    message: "Server Error",
                });
            });
    } else {
        next();
    }
};



module.exports = ViewBlogCount;