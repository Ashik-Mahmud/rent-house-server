const Request = require("../models/request.model");


/* Send Request Services */
exports.sendRequestService = async(req) => {
    try {
        const request = await Request.create({...req.body, author: req.body.author.id});
        return request;
    }
    catch(err) {
        throw new Error(err.message);
    }
}

/* Get All blog Request Services */
exports.getAllRequestService = async(filter) => {
    try{
        const request = await Request.find(filter.filter).skip(filter.skip).limit(filter.limit).populate("author", "name avatar profileImage email phone isVerified role _id");
        return request;
    }
    catch(err){
        throw new Error(err.message);
    }
}