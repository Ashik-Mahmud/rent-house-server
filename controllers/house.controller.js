

// @route   GET api/houses
// @desc    Get all houses
// @access  Public

const  getHouse = async(req, res) =>{
    res.send({success: true, message: "GET HOUSES API"});
}

module.exports = {getHouse}