/* Create Blog Request */
const createBlogRequest = async(req, res) => {
    return console.log(req.body);
    
    try{
    const blog_request = new BlogRequest({...req.body, user_id: req.body.user_id});
    await blog_request.save();
    return res.status(201).send({success: true, message: "Blog Request Created"});
    }
    catch(err){
        return res.status(403).send({success: false, message: `Something went. Please try again`});
    }
}

module.exports = {createBlogRequest}