const House = require("../models/house.model");
const { createHouseService } = require("../services/house.services");

// @Routes POST /api/v1/houses/create
// @Desc Create a new house
// @Access Private
const createHouse = async (req, res) => {
  /* Validation Items */
  const {
    title,
    description,
    price,
    images,
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
    !title ||
    !description ||
    !price ||
    !images ||
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
      message: "House created successfully",
      data: house,
    });
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
    try {
        const houses = await House.find().populate("owner", "name email");
        res.status(200).json({
            success: true,
            message: "All houses",
            data: houses
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
}



module.exports = { createHouse, getAllHouses };
