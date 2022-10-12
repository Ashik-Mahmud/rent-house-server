const User = require("../models/user.model");
const { sendRequestForBlogService } = require("../services/request.services");

/* Create Blog Request */
const createBlogRequest = async(req, res) => {
     
    try{
    const user = await User.findById(req.body.author.id)
    if(user.isRequestSent){
        return res
          .status(400)
          .json({ message: "You Already Send a Request Before!" });
    }
    const blog_request = await sendRequestForBlogService(req);
    user.isRequestSent = true;
    await user.save();
    return res.status(201).send({success: true, message: "Sent your request to the admin", req: blog_request});
    }
    catch(err){
        return res.status(403).send({success: false, message: `Something went. Please try again ${err}`});
    }
}

module.exports = {createBlogRequest}