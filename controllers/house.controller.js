const House = require("../models/house.model");
const Question = require("../models/question.model");
const { ReviewsForHouse } = require("../models/review.model");
const Report = require("../models/reportHouse.model");
const Blog = require("../models/blog.model");
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
const { uploadImages, deleteImages } = require("../utils/Cloudinary");

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

    bathrooms,
    bedrooms,
    category,
    houseUseFor,
    houseType,
    author,
  } = data;

  const host = req.hostname;
  const filePath = req.protocol + "://" + host + "/";

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

  try {
    const previewImage = req.files.previewImage[0].path;
    const galleryImages = req.files.galleryImage?.map((image) => image.path);

    if (previewImage && galleryImages) {
      const previewImageUpload = await uploadImages(
        previewImage,
        req.user?.email,
        "previewImages"
      );

      const images = await uploadMultipleImages(galleryImages, req.user?.email);
      if (previewImageUpload && images.length > 0) {
        const house = await createHouseService({
          ...data,
          image: {
            img: previewImageUpload.secure_url,
            public_id: previewImageUpload.public_id,
          },
          gallery: images,
          owner: author?.id,
        });
        res.status(201).json({
          success: true,
          message: "House created successfully & sent you email",
          data: house,
        });
        sendHouseAddedEmail(author.email, house.name);
      } else {
        res.status(500).json({
          success: false,
          message: "Something went wrong",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const uploadMultipleImages = async (gallery, mail) => {
  let galleryImagesUpload = [];
  for (let i = 0; i < gallery.length; i++) {
    const image = gallery[i];
    const imageUpload = await uploadImages(image, mail, "galleryImages");
    galleryImagesUpload.push({
      image: imageUpload.secure_url,
      public_id: imageUpload.public_id,
    });
  }

  return galleryImagesUpload;
};

// @route   GET api/houses
// @desc    Get all houses
// @access  Public

const getAllHouses = async (req, res) => {
  const {
    page,
    sortBy,
    limit,
    category,
    houseType,
    houseUseFor,
    bedrooms,
    bathrooms,
    district,
    city,
    isBachelor,
    address,
    name,
    startPrice,
    endPrice,
  } = req.query;

  const parseHouseType = JSON.parse(houseType);
  const parseHouseUseFor = JSON.parse(houseUseFor);

  let queries = { status: "approved" };
  let sortByFilter = {};

  if (sortBy) {
    /* Most Recent */
    if (sortBy === "-createdAt") {
      sortByFilter = { sort: "-createdAt" };
    }
    /* Most Popular */
    if (sortBy === "-views") {
      sortByFilter = { sort: "-views" };
    }
    /* Most Expensive */
    if (sortBy === "-price") {
      sortByFilter = { sort: "-price" };
    }
    /* Cheapest */
    if (sortBy === "price") {
      sortByFilter = { sort: "price" };
    }

    /* Oldest */
    if (sortBy === "createdAt") {
      sortByFilter = { sort: "createdAt" };
    }
    /* Last Weeks */
    if (sortBy === "week") {
      queries = {
        ...queries,
        createdAt: {
          $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        },
      };
    }

    /* Last Month */
    if (sortBy === "month") {
      queries = {
        ...queries,
        createdAt: {
          $gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
        },
      };
    }

    /* Last Year */
    if (sortBy === "year") {
      queries = {
        ...queries,
        createdAt: {
          $gte: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000),
        },
      };
    }
  }

  if (category) {
    queries.category = category;
  }

  if (parseHouseType?.rent) {
    queries.houseType = "Rent";
  }
  if (parseHouseType?.sale) {
    queries.houseType = "Sale";
  }
  if (parseHouseType?.rent && parseHouseType?.sale) {
    queries.houseType = { $in: ["Rent", "Sale"] };
  }
  if (parseHouseUseFor?.commercial) {
    queries.houseUseFor = "Commercial";
  }

  if (parseHouseUseFor?.residential) {
    queries.houseUseFor = "Residential";
  }

  if (parseHouseUseFor?.commercial && parseHouseUseFor?.residential) {
    queries.houseUseFor = { $in: ["Commercial", "Residential"] };
  }

  if (Number(bedrooms)) {
    queries.bedrooms = bedrooms;
  }

  if (Number(bathrooms)) {
    queries.bathrooms = bathrooms;
  }

  if (district) {
    queries.district = district;
  }

  if (city) {
    queries.city = city;
  }

  if (JSON.parse(isBachelor)) {
    queries.isBachelorRoom = "Yes";
  }

  if (address) {
    queries.address = eval(`/.*${address}.*/i`);
  }

  if (name) {
    queries.name = eval(`/.*${name}.*/i`);
  }

  /* filter by lower price and higher price */
  if (Number(startPrice) && Number(endPrice)) {
    queries.price = {
      $gte: startPrice,
      $lte: endPrice,
    };
  }

  /* Pagination */
  if (page || limit) {
    queries.skip = (page - 1) * limit;
    queries.limit = Number(limit);
  }

  try {
    const houses = await getAllHousesService(queries, sortByFilter);
    res.status(200).json({
      success: true,
      message: "All houses",
      data: houses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error" + error,
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
      message: "Server Error" + error,
    });
  }
};

// @route GET api/houses/get-house-by-user/:id
// @desc Get house by user id
// @access Private
const getHouseByUserID = async (req, res) => {
  const { page, limit, q } = req.query;
  const { id } = req.params;
  try {
    const filters = {};
    if (page || limit) {
      filters.skip = (page - 1) * limit;
      filters.limit = Number(limit);
    }
    if (id) {
      filters.owner = id;
    }
    if (q) {
      const regex = new RegExp(q, "i");
      filters.$or = [{ name: regex }, { address: regex }];
    }

    const house = await House.find(filters)
      .skip(filters.skip)
      .limit(filters.limit);
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
      message: "Server error" + error,
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
      message: "Server Error" + error,
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
      message: "Server Error" + error,
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

    /* Delete All Questions Related of This */
    await Question.deleteMany({ house: req.params.id });

    /* Delete All Reviews Related of This */
    await ReviewsForHouse.deleteMany({ house: req.params.id });

    /* Delete All Reports Related of This */
    await Report.deleteMany({ house: req.params.id });

    await deleteHousesImages(house.image, req.user?.email, house.gallery);
    await house.remove();
    res.status(200).json({
      success: true,
      message: "House deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error" + error,
    });
  }
};

/* Delete all the images related this houses */
const deleteHousesImages = async (image, email, gallery) => {
  if (image) {
    await deleteImages(image?.public_id, email, "previewImages");
  }
  if (gallery.length > 0) {
    for (let i = 0; i < gallery.length; i++) {
      await deleteImages(gallery[i].public_id, email, "galleryImages");
    }
  }
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
      message: "Server Error" + error,
    });
  }
};

// @routes PATCH /api/v1/houses/toggle-like/:id
// @desc   Toggle like house
// @access Public
const toggleLikeHouse = async (req, res) => {
  try {
    const { like } = req.query;
    const house = await findByIdHouseService(req.params.id);

    if (!house) {
      return res.status(404).json({
        success: false,
        message: "House not found",
      });
    }

    if (house.likes === 0) {
      house.likes = 0;
    }
    if (like === "false") {
      house.likes = house.likes + 1;
    } else {
      house.likes = house.likes - 1;
    }
    await house.save();
    res.status(200).json({
      success: true,
      message: like === "false" ? "Liked house" : "Dislike house",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error" + error,
    });
  }
};

// @routes GET /api/v1/houses/get-house-holder-reports
// @desc   Get house holder reports
// @access Private
const getHouseHolderReports = async (req, res) => {
  const { id } = req.params;

  try {
    const approved = await House.countDocuments({ owner: id, status: "approved" });
    const pending = await House.countDocuments({ owner: id, status: "pending" });
    const rejected = await House.countDocuments({ owner: id, status: "rejected" });

    const houses = await House.find({ owner: id });
    const housesId = houses.map((house) => house._id);
    const reviews = await ReviewsForHouse.countDocuments({ house: { $in: housesId } });
    const reports = await Report.countDocuments({ house: { $in: housesId } });
    const questions = await Question.countDocuments({ house: { $in: housesId } });
    const blogs = await Blog.countDocuments({ author: id });

    res.status(200).json({
      success: true,
      message: "Reports found",
      data: {
        approved,
        pending,
        rejected,
        reviews,
        reports,
        questions,
        blogs,

      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error" + error,
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
  getHouseByUserID,
  getHouseHolderReports,
};
