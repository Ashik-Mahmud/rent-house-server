const House = require("../models/house.model");
const {
  createHouseService,
  getAllHousesService,
  getHouseByIdService,
  updateHouseService,
  findByIdService,
  changeIsBookedService,
  findByIdHouseService,
  getTop4HousesService,
} = require("../services/house.services");
const { sendHouseAddedEmail } = require("../utils/sendEmail");


// @Routes POST /api/v1/houses/create
// @Desc Create a new house
// @Access Private
const createHouse = async (req, res) => {
  /* Validation Items */
  const {
    name,
    description,
    price,
    image,
    district,
    city,
    googleMapLocation,
    bathrooms,
    bedrooms,
    category,
    houseUseFor,
    houseType,
  } = req.body;
  if (
    !name ||
    !description ||
    !price ||
    !image ||
    !district ||
    !city ||
    !googleMapLocation ||
    !bathrooms ||
    !bedrooms ||
    !category ||
    !houseUseFor ||
    !houseType
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter all fields" });
  }
  try {
    const house = await createHouseService({ ...req.body, owner: req.user.id });
    res.status(201).json({
      success: true,
      message: "House created successfully & sent you email",
      data: house,
    });
    sendHouseAddedEmail(req.user.email, house.name);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @route   GET api/houses
// @desc    Get all houses
// @access  Public

const getAllHouses = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category,
    houseType,
    houseUseFor,
    bedrooms,
    bathrooms,
    district,
    city,
    isBachelorRoom,
    address,
    name,
    startPrice,
    endPrice,
  } = req.query;

  let queries = {};

  if (category) {
    queries.category = category;
  }

  if (houseType) {
    queries.houseType = houseType;
  }

  if (houseUseFor) {
    queries.houseUseFor = houseUseFor;
  }

  if (bedrooms) {
    queries.bedrooms = bedrooms;
  }

  if (bathrooms) {
    queries.bathrooms = bathrooms;
  }

  if (district) {
    queries.district = district;
  }

  if (city) {
    queries.city = city;
  }

  if (isBachelorRoom) {
    queries.isBachelorRoom = isBachelorRoom;
  }

  if (address) {
    queries.address = eval(`/.*${address}.*/i`);
  }

  if (name) {
    queries.name = eval(`/.*${name}.*/i`);
  }

  if(startPrice && endPrice){
    queries.price = { $gte: startPrice, $lte: endPrice };
  }
  
    

  /* Pagination */
  if (page || limit) {
    queries.skip = (page - 1) * limit;
    queries.limit = limit;
  }

  try {
    const houses = await getAllHousesService(queries);
    res.status(200).json({
      success: true,
      message: "All houses",
      data: houses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// @route   GET api/houses/:id
// @desc    Get house by id
// @access  Public
const getHouseById = async (req, res) => {
    try {
        const house = await getHouseByIdService(req.params.id);
        if(!house){
            return res.status(404).json({
                success: false,
                message: "House not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "House found",
            data: house
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}


// @route   PUT api/houses/:id
// @desc    Update house
// @access  Private
const updateHouse = async (req, res) => {
    try {
        const house = await findByIdHouseService(req.params.id);
        if(!house){
            return res.status(404).json({
                success: false,
                message: "House not found"
            })
        }
        if(house.owner.toString() !== req.user.id){
            return res.status(401).json({
                success: false,
                message: "Not authorized"
            })
        }
        const updatedHouse = await updateHouseService(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "House updated successfully",
            data: updatedHouse
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}


// @route GET api/top-4-houses
// @desc Get top 4 houses
// @access Public
const getTop4Houses = async (req, res) => {
    try {
        const houses = await getTop4HousesService();
        res.status(200).json({
            success: true,
            message: "Top 4 houses",
            data: houses
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}




// @route   DELETE api/houses/:id
// @desc    Delete house
// @access  Private
const deleteHouse = async (req, res) => {
    try {
        const house = await findByIdHouseService(req.params.id);
        if(!house){
            return res.status(404).json({
                success: false,
                message: "House not found"
            })
        }
        if(house.owner.toString() !== req.user.id){
            return res.status(401).json({
                success: false,
                message: "Not authorized"
            })
        }
        await house.remove();
        res.status(200).json({
            success: true,
            message: "House deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}


// @route PATCH /api/v1/houses/change-status/:id
// @desc Change status of house
// @access Private
const changeIsBooked = async (req, res) => {
    try {
        const house = await findByIdHouseService(req.params.id);
        if(!house){
            return res.status(404).json({
                success: false,
                message: "House not found"
            })
        }
        if(house.owner.toString() !== req.user.id){
            return res.status(401).json({
                success: false,
                message: "Not authorized"
            })
        }
        const updatedHouse = await changeIsBookedService(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "House status updated successfully",
            data: updatedHouse
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}



// @routes PATCH /api/v1/houses/toggle-like/:id
// @desc   Toggle like house
// @access Public
const toggleLikeHouse = async (req, res) => {
    try {
        const {clicked} = req.query;
        const house = await findByIdHouseService(req.params.id);
               
        if(!house){
            return res.status(404).json({
                success: false,
                message: "House not found"
            })
        }
        
        if(clicked === "true"){
            house.likes = house.likes + 1;
        }else{
            house.likes = house.likes - 1;
        }
        await house.save();
        res.status(200).json({
            success: true,
            message: clicked === "true" ? "Liked house" : "Dislike house",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        })

    }
}



module.exports = { createHouse, getAllHouses, getHouseById, updateHouse , deleteHouse, changeIsBooked, toggleLikeHouse, getTop4Houses};
