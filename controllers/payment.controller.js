const User = require("../models/user.model");
const { saveBookingsServices } = require("../services/payment.services");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/* Create Payment Instance for stripe */
const createPaymentInstance = async (req, res) => {
  const data = req.body;
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
  try {
    const bookings = await saveBookingsServices(data);
    if (bookings) {
      const usersSavedBookedId = await User.findByIdAndUpdate(
        { _id: data.user },
        { $push: { bookedHouses: bookings.house } },
        { new: true }
      );
      if (usersSavedBookedId) {
        res.status(201).send({
          success: true,
          message: "Bookings saved successfully",
          data: bookings,
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

//exports
module.exports = { createPaymentInstance, saveBookings };
