const Blog = require("../models/blog.model");
/* Find Blogs By User ID */
exports.findBlogsByUserIdService = async (id) => {
  try {
    const blogs = await Blog.find({ author: id });
    const count = await Blog.countDocuments();
    
    return {blogs, count};
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
exports.updateBlogByIdService = async(data) =>{
    const {id, ...rest} = data;
    const data = await Blog.findOneAndUpdate({_id: id}, rest);
    return data;
}