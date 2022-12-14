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
    const blog = await Blog.findById(id).populate("author", "name");
    return blog;
  } catch (err) {
    console.log(err);
  }
};

/* Update Blog By Blog ID */
exports.updateBlogByIdService = async (data, id) => {
  const result = await Blog.findByIdAndUpdate({ _id: id }, data, {
    new: true,
  });
  return result;
};

/* Find Blogs ANd Delete Blog by ID */
exports.findBlogAndDeleteService = async (id, userId) => {
  console.log(id, userId);
  
  const result = await Blog.findOne({author: userId, _id: id});
  return result;
};


/* Get All blog Services */

exports.findBlogsService = async (filter, fields) => {   
    const blogs = await Blog.find(filter).skip(fields.skip).limit(fields.limit).sort({ createdAt: -1 })
    return blogs;
};