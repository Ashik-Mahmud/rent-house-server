const House = require("../models/house.model");

/* Create Brand New House Services*/
exports.createHouseService = async (body) => {
  try {
    const house = await House.create(body);
    return house;
  } catch (error) {
    console.log(error.message);
  }
};

/* Get All Houses Services */
exports.getAllHousesService = async (queries, sortByFilter) => {
  try {
    const houses = await House.find(queries)
      .skip(queries.skip)
      .limit(queries.limit)
      .sort(sortByFilter.sort)
      .populate("owner", "name email");
    /* Get Total Numbers of Houses */
    const totalHouses = await House.countDocuments({ status: "approved" });
    const housesWithOutFilter = await House.find({ status: "approved" });
    return { totalHouses, houses, allHouse: housesWithOutFilter };
  } catch (error) {
    console.log(error.message);
  }
};

/* Get House By Id Services */
exports.getHouseByIdService = async (id) => {
  try {
    const house = await House.findById(id).populate(
      "owner",
      "name email phone profileImage avatar twitterLink facebookLink instagramLink linkedinLink"
    );
    return house;
  } catch (error) {
    console.log(error.message);
  }
};

/* Find By ID and Update  */
exports.updateHouseService = async (id, body) => {
  try {
    const house = await House.findByIdAndUpdate(id, body, { new: true });
    return house;
  } catch (error) {
    console.log(error.message);
  }
};

/* get Single house find by id */
exports.findByIdHouseService = async (id) => {
  try {
    const house = await House.findById(id).populate("owner", "email name");
    return house;
  } catch (error) {
    console.log(error.message);
  }
};

/* change isBooked or not */
exports.changeIsBookedService = async (id, body) => {
  try {
    const house = await House.findByIdAndUpdate(id, body, { new: true });
    return house;
  } catch (error) {
    console.log(error.message);
  }
};

/* Get Top 4 Houses */
exports.getTop4HousesService = async () => {
  try {
    const houses = await House.find({ status: "approved" })
      .sort({ views: -1, likes: -1 })
      .limit(4);
    return houses;
  } catch (error) {
    console.log(error.message);
  }
};

/* Get Top 3 Houses */
exports.getTop3HouseByUserService = async (id) => {
  try {
    const houses = await House.find({ owner: id, status: "approved" })
      .sort({ views: -1, likes: -1 })
      .limit(3);
    return houses;
  } catch (error) {
    console.log(error.message);
  }
};
