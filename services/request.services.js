const BlogRequest = require("../models/request.model");

/* Send Request Services */
exports.sendRequestForBlogService = async(req) => {
    try {
        const request = await BlogRequest.create({...req.body, author: req.body.author.id});
        return request;
    }
    catch(err) {
        throw new Error(err.message);
    }
}

/* Get All blog Request Services */
exports.getAllBlogRequestService = async(req) => {
    try{
        const request = await BlogRequest.find({})
        return request;
    }
    catch(err){
        throw new Error(err.message);
    }
}