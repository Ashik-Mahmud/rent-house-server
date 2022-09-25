const House = require("../models/house.model");

/* Create Brand New House Services*/
exports.createHouseService = async (body) => {
    try {
        const house = await House.create(body);
        return house;
    } catch (error) {
        console.log(error.message);
    }
}


/* Get All Houses Services */
exports.getAllHousesService = async (queries) => {
       
    try {
        const houses = await House.find(queries).skip(queries.skip).limit(queries.limit).populate("owner", "name email");
        /* Get Total Numbers of Houses */
         const totalHouses = await House.countDocuments();
        return { totalHouses, houses};
    } catch (error) {
        console.log(error.message);
    }
}


/* Get House By Id Services */
exports.getHouseByIdService = async (id) => {
    try {
        const house = await House.findById(id).populate("owner", "name email");
        return house;
    } catch (error) {
        console.log(error.message);
    }
}

/* Find By ID and Update  */
exports.updateHouseService = async (id, body) => {
    try {
        const house = await House.findByIdAndUpdate(id, body, {new: true});
        return house;
    } catch (error) {
        console.log(error.message);
    }
}

/* get Single house find by id */
exports.findByIdHouseService = async (id) => {
    try {
        const house = await House.findById(id);
        return house;
    } catch (error) {
        console.log(error.message);
    }
}


/* change isBooked or not */
exports.changeIsBookedService = async (id, body) => {
    try {
        const house = await House.findByIdAndUpdate(id, body, {new: true});
        return house;
    } catch (error) {
        console.log(error.message);
    }
}

/* Get Top 4 Houses */
exports.getTop4HousesService = async () => {
    try {
        const houses = await House.find().sort({views: -1, likes: -1}).limit(4);
        return houses;
    } catch (error) {
        console.log(error.message);
    }
}