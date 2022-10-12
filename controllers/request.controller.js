const BlogRequest = require("../models/request.model");
const User = require("../models/user.model");
const { sendRequestForBlogService, getAllBlogRequestService } = require("../services/request.services");

/* Create Blog Request */
const createBlogRequest = async(req, res) => {
     
    try{
    const user = await User.findById(req.body.author.id)
    if(user.isRequestSent){
        return res
          .status(400)
          .json({ message: "You Already Send a Request Before!" });
    }

    if(!user.phone || !user.address || !user.facebookLink || !user.twitterLink || !user.instagramLink || !user.profileImage
        ){
            return res
                .status(422)
                .json({ message: "Some Profile information is not added, Please first fillup all the missing information to send a request." });
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

/* Get All Blog Request Users */
const getAllBlogRequestsUsers = async( req, res ) => {
    const {page, limit} = req.query;
       
    try {
        const filter = {};

        if(page || limit) {
            const skip = (page-1) * Number(limit);
            filter.skip = Number(skip);
            filter.limit = Number(limit);
        }
        const blogRequest = await getAllBlogRequestService(filter);
        const count = await BlogRequest.count();
        if(!blogRequest){
            return res.status(400).json({message: "Blog Request not Found"});
        }
        return res.status(200).send({ success: true, message: "All Blog Request", req: blogRequest, count });       

    } catch (error) {
         return res.status(500).send({success: false, message: `Something went. Please try again`});
    }
}


module.exports = {createBlogRequest, getAllBlogRequestsUsers}