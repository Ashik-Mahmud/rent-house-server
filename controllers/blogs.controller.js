// @routes POST Create Blogs
// @desc Create a new post
// @access Public

const createBlog = async(req, res) =>{
  console.log(req.body);
  
}


/* Import controller */
module.exports = {createBlog}