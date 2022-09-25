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