const User = require("../models/user.model");
const { saveBookingsServices } = require("../services/payment.services");
const {
  sendEmailForPaymentSuccess,
  sendEmailToHouseHolderForBookedHouse,
} = require("../utils/sendEmail");
const House = require("../models/house.model");
const Bookings = require("../models/payment.model");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/* Create Payment Instance for stripe */
const createPaymentInstance = async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100 * 100,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(201).send({
      success: true,
      client_secret: paymentIntent.client_secret,
      message: "Welcome to payment instance route",
    });
  } catch (err) {
    res.status(404).send({
      success: false,
      message: "Server Error" + err,
    });
  }
};

/* Save Bookings */
const saveBookings = async (req, res) => {
  const data = req.body;
  const { email, name } = req?.user;
  try {
    const bookings = await saveBookingsServices(data);
    if (bookings) {
      const usersSavedBookedId = await User.findByIdAndUpdate(
        { _id: data.user },
        { $push: { bookedHouses: bookings.house } },
        { new: true }
      );
      if (usersSavedBookedId) {
        const houseHolder = await User.findById(data?.author);
        const house = await House.findById(data?.house);
        const customer = await User.findById(req?.user?.id);
        sendEmailForPaymentSuccess(
          email,
          customer?.name,
          house,
          data?.transactionId
        );
        sendEmailToHouseHolderForBookedHouse(
          houseHolder?.email,
          houseHolder?.name,
          customer?.name,
          house,
          data?.transactionId
        );
        res.status(201).send({
          success: true,
          message: "Bookings saved successfully",
        });
      }
    }
  } catch (err) {
    res.status(404).send({
      success: false,
      message: `Server error ` + err,
    });
  }
};

/* Get Booked Houses */
const getBookedHouses = async (req, res) => {
  const { id } = req?.user;
  const { page, limit, filter, search } = req?.query;

  try {
    const fields = {};
    if (page || limit) {
      fields.skip = (parseInt(page) - 1) * parseInt(limit);
      fields.limit = parseInt(limit);
    }
    if (search || id) {
      fields.user = id;
      fields.$or = [{ transactionId: { $regex: search, $options: "i" } }];
    }
    const payments = await Bookings.find(fields)
      .skip(fields?.skip)
      ?.limit(fields?.limit)
      .sort(filter);
    const count = await Bookings.countDocuments({ user: id });

    /* Booked Houses With Search*/
    const bookedHouses = await House.find({
      _id: { $in: payments?.map((payment) => payment?.house) },
      $or: [
        { name: new RegExp(search, "i") },
        { location: new RegExp(search, "i") },
      ],
    }).populate(
      "owner",
      "name email phone address profileImage facebookLink instagramLink twitterLink"
    );

    if (payments) {
      res.status(200).send({
        success: true,
        message: "Booked houses fetched successfully",
        data: { bookedHouses, count },
      });
    }
  } catch (err) {
    res.status(404).send({
      success: false,
      message: "Server error" + err,
    });
  }
};

//exports
module.exports = { createPaymentInstance, saveBookings, getBookedHouses };
