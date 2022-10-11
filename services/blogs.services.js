const Blog = require("../models/blog.model");

/* Find Blogs By User ID */
exports.findBlogsByUserIdService = async (filter) => {
       
  try {
    const blogs = await Blog.find(filter).skip(filter?.skip).limit(Number(filter?.limit));
    const count = await Blog.countDocuments(filter);

    return { blogs, count };
  } catch (err) {
    throw new Error(err);
  }
};
/* Find Blog by blog Id */
exports.findBlogByIdService = async (id) => {
  try {
    const blog = await Blog.findById(id);
    return blog;
  } catch (err) {
    console.log(err);
  }
};

/* Update Blog By Blog ID */
exports.updateBlogByIdService = async (data, id) => {
  const result = await Blog.findOneAndUpdate({ _id: id }, data, {
    new: true,
  });
  return result;
};

/* Find Blogs ANd Delete Blog by ID */
exports.findBlogAndDeleteService = async (id) => {
  const result = await Blog.findOneAndDelete(id);
  return result;
};


/* Get All blog Services */

exports.findBlogsService = async (filter) => {
    const blogs = await Blog.find(filter).skip(filter.skip).limit(filter.limit).sort({ createdAt: -1 });
    return blogs;
};