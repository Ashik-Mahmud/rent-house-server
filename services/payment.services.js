const Bookings = require("../models/payment.model")

/* Save bookings Services */
exports.saveBookingsServices = async(data) =>{
    const result = await Bookings.create(data)
    return result;
}