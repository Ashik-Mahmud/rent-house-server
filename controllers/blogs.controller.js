// @routes POST Create Blogs
// @desc Create a new post
// @access Private

const {
  findBlogAndDeleteService,
  findBlogByIdService,
  findBlogsByUserIdService,
  updateBlogByIdService,
  findBlogsService,
} = require("../services/blogs.services");

const Blog = require("../models/blog.model");

const createBlog = async (req, res) => {
  const { title, description, imageUrl, author, category } = req.body;
  try {
    var newBlogPost = new Blog({
      title,
      category,
      description,
      imageUrl,
      author: author?.id || author,
    });
    await newBlogPost.save();
    res.status(201).json({
      success: true,
      message: "Blog Post Created!",
      data: newBlogPost,
    });
  } catch (err) {
    console.log(err);
  }
};

// @routes GET api/v1/blogs/blogs-by-id
// @desc Get blogs by User ID
// @access Private

const getBlogsByUserID = async (req, res) => {
  const { id } = req.params;
  const { page, limit, q } = req.query;

  try {
    const filter = {};
    if (id) filter.author = id;
    if (!id && !page && !limit) return;

    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [{ title: regex }, { category: regex }];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    if (page && limit) {
      filter.skip = skip;
      filter.limit = limit;
    }

    if (!id)
      return res.status(403).send({ success: false, message: "Invalid ID" });

    const data = await findBlogsByUserIdService(filter);

    if (!data)
      return res
        .status(404)
        .send({ success: false, message: "No Blogs Found." });

    res.status(200).send({
      success: true,
      message: "Found Blogs",
      data: data,
    });
  } catch (error) {
    res.status(403).send({
      success: false,
      message: error,
    });
  }
};

// @routes Get api/v1/blogs/blog/:id
// @desc Get Blog by Blog ID
// @access Private

const getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await findBlogByIdService(id);
    if (!data) {
      res.status(403).send({
        success: false,
        message: "No blogs found.",
      });
    }

    res.status(200).send({
      success: true,
      message: "Found blog",
      data: data,
    });
  } catch (error) {
    res.status(403).send({
      success: false,
      message: error,
    });
  }
};

// @routes PATCH api/v1/blogs/update-blog
// @desc Update Blog by ID
// @access private

const updateBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await updateBlogByIdService(req.body, id);
    if (!result)
      return res.status(403).send({
        success: false,
        message: "No updated blog found.",
      });

    res.status(200).send({
      success: true,
      message: "Blog Update successfully done",
      data: result,
    });
  } catch (error) {
    res.status(403).send({
      success: false,
      message: error,
    });
  }
};

// @routes api/v1/blogs/delete/:id
// @desc Delete Blog by ID
// @access private

const deleteBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await findBlogAndDeleteService(id);
    if (!blog)
      return res.status(403).send({
        success: false,
        message: "No data found",
      });

    await blog.remove();
    res.status(200).send({
      success: true,
      message: "blog successfully deleted",
    });
  } catch (error) {
    res.status(403).send({
      success: false,
      message: error,
    });
  }
};

// @routes api/v1/blogs/change-available/:id
// @desc change availability for blogs
// @access private

const changeAvailable = async (req, res) => {
  const { id } = req.params;
  const { status } = req.query;
  try {
    const blog = await findBlogByIdService(id);
    if (!blog)
      return res.status(403).send({
        success: false,
        message: "No blog found this {ID}",
      });

    if (blog.status === status)
      return res.status(403).send({
        success: false,
        message: `Not change status Its already ${status}`,
      });

    blog.status = status;
    blog.save();
    res.status(202).send({
      success: true,
      message: "Change Status in",
      data: blog,
    });
  } catch (error) {}
};

// @routes PATCH /api/v1/blogs/toggle-like/:id
// @desc   Toggle like blog
// @access Public
const toggleLikeBlog = async (req, res) => {
  try {
    const { clicked } = req.query;
    const blog = await findBlogByIdService(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (blog.likes < 0)
      return res
        .status(403)
        .send({ success: false, message: "Thanks for extra dislike" });

    if (clicked === "true") {
      blog.likes = blog.likes + 1;
    } else {
      blog.likes = blog.likes - 1;
    }
    await blog.save();
    res.status(200).json({
      success: true,
      message: clicked === "true" ? "Liked Blog" : "Dislike Blog",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @routes GET api/v1/blogs/all
// @desc Get All Blogs
// @access Public
const getAllBlog = async (req, res) => {
  try {
    const { page, limit, q } = req.query;
    let filter = {};
    filter.status = "active";
    const skip = (parseInt(page) - 1) * parseInt(limit);

    if (page && limit) {
      filter.skip = skip;
      filter.limit = Number(limit);
    }

    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [{ title: regex }, { category: regex }];
    }

    const count = await Blog.countDocuments({ status: "active" });
    const data = await findBlogsService(filter);

    if (!data)
      return res.status(403).send({
        success: false,
        message: "No Blogs found",
      });
    res.status(200).send({
      success: true,
      message: "Found Blogs",
      data,
      count,
    });
  } catch (error) {
    res.status(403).send({
      success: false,
      message: error,
    });
  }
};

/* Import controller */
module.exports = {
  createBlog,
  getBlogsByUserID,
  getBlogById,
  updateBlogById,
  deleteBlogById,
  changeAvailable,
  toggleLikeBlog,
  getAllBlog,
};
