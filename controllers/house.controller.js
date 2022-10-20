const House = require("../models/house.model");
const path = require("path");
const fs = require("fs");
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
  const data = JSON.parse(req.body.data);
  const {
    name,
    description,
    price,
    district,
    city,
    googleMapLocation,
    bathrooms,
    bedrooms,
    category,
    houseUseFor,
    houseType,
    author,
  } = data;

  const host = req.hostname;
  const filePath = req.protocol + "://" + host + '/' ;
  
  

  /* Validation Items */
  if (
    !name ||
    !description ||
    !price ||
    !district ||
    !city ||
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

  const previewImage = req.files.previewImage[0].filename;
  const galleryImages = req.files.galleryImage?.map((image)=>  image.filename)



  try {
    const house = await createHouseService({ ...data, image: previewImage, gallery: galleryImages, owner: author?.id });
    res.status(201).json({
      success: true,
      message: "House created successfully & sent you email",
      data: house,
    });
    sendHouseAddedEmail(author.email, house.name);
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

  if (startPrice && endPrice) {
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
    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "House found",
      data: house,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @route GET api/houses/get-house-by-user/:id
// @desc Get house by user id
// @access Private
const getHouseByUserID = async (req, res) => {
    const {page, limit} = req.query;
    try {
        const filters = {};
        if(page || limit){
            filters.skip = (page - 1) * limit;
            filters.limit = Number(limit);            
        }
                
        const house = await House.find({ owner: req.params.id }).skip(filters.skip).limit(filters.limit);    
        const count = await House.countDocuments({ owner: req.params.id }); 
        if (!house) {
            return res.status(404).json({
                success: false,
                message: "House not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "House found",
            data: house,
            count: count,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};






// @route   PUT api/houses/:id
// @desc    Update house
// @access  Private
const updateHouse = async (req, res) => {
  
    
  try {
    const house = await findByIdHouseService(req.params.id);
    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found",
      });
    }
    if (house.owner._id.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    const updatedHouse = await updateHouseService(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "House updated successfully",
      data: updatedHouse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @route GET api/top-4-houses
// @desc Get top 4 houses
// @access Public
const getTop4Houses = async (req, res) => {
  try {
    const houses = await getTop4HousesService();
    res.status(200).json({
      success: true,
      message: "Top 4 houses",
      data: houses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @route   DELETE api/houses/:id
// @desc    Delete house
// @access  Private
const deleteHouse = async (req, res) => {
  try {
    const house = await findByIdHouseService(req.params.id);
    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found",
      });
    }    
    
    if (house.owner?._id.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    await house.remove();
    res.status(200).json({
      success: true,
      message: "House deleted successfully",
    });
    deleteHousesImages(house.image, house.gallery);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* Delete all the images related this houses */
const deleteHousesImages = (image, gallery) => {
   const previewImagePath = path.join(__dirname, `../uploads/previews/${image}`);
   const galleryImagePath = path.join(__dirname, `../uploads/gallery/`);
    fs.unlink(previewImagePath, (err) => {
        if (err) {
            console.log(err);
        }
    });
    gallery.forEach((img) => {
        fs.unlink(galleryImagePath + img, (err) => {
            if (err) {
                console.log(err);
            }
        });
    });
};




// @route PATCH /api/v1/houses/change-status/:id
// @desc Change status of house
// @access Private
const changeIsBooked = async (req, res) => {
  try {
    const house = await findByIdHouseService(req.params.id);
    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found",
      });
    }
    if (house.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    const updatedHouse = await changeIsBookedService(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "House status updated successfully",
      data: updatedHouse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @routes PATCH /api/v1/houses/toggle-like/:id
// @desc   Toggle like house
// @access Public
const toggleLikeHouse = async (req, res) => {
  try {
    const { clicked } = req.query;
    const house = await findByIdHouseService(req.params.id);

    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found",
      });
    }

    if (clicked === "true") {
      house.likes = house.likes + 1;
    } else {
      house.likes = house.likes - 1;
    }
    await house.save();
    res.status(200).json({
      success: true,
      message: clicked === "true" ? "Liked house" : "Dislike house",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createHouse,
  getAllHouses,
  getHouseById,
  updateHouse,
  deleteHouse,
  changeIsBooked,
  toggleLikeHouse,
  getTop4Houses,
  getHouseByUserID
};
