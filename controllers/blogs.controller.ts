// @routes POST Create Blogs
// @desc Create a new post
// @access Private

import {
  findBlogByIdService,
  findBlogsByUserIdService,
  updateBlogByIdService,
} from "../services/blogs.services";

const Blog = require("../models/blog.model");

const createBlog = async (req, res) => {
  console.log(req.body);
  const { title, description, imageUrl, author, category } = req.body;
  try {
    var newBlogPost = new Blog({
      title,
      category,
      description,
      imageUrl,
      author,
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

  try {
    if (!id)
      return res.status(403).send({ success: false, message: "Invalid ID" });

    const data = await findBlogsByUserIdService(id);

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
  const { title, category, description, imageUrl, id } = req.body;
  if (!title || !category || !description || !imageUrl || !id) {
    return res.status(403).send({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const result = await updateBlogByIdService(req.body);
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

/* Import controller */
module.exports = { createBlog, getBlogsByUserID, getBlogById, updateBlogById };
