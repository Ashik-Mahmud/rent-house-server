const User = require("../models/user.model");
const { saveBookingsServices } = require("../services/payment.services");
const {
  sendEmailForPaymentSuccess,
  sendEmailToHouseHolderForBookedHouse,
  sendThanksEmailTemplate,
} = require("../utils/sendEmail");
const House = require("../models/house.model");
const Bookings = require("../models/payment.model");
const appReview = require("../models/AppReview");
const Blog = require("../models/blog.model");

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

/* Get Payment Statement */
const getPaymentStatement = async (req, res) => {
  const { id } = req?.user;
  const { page, limit } = req?.query;

  try {
    const fields = {};
    if (page || limit) {
      fields.skip = (parseInt(page) - 1) * parseInt(limit);
      fields.limit = parseInt(limit);
    }
    if (id) {
      fields.user = id;
    }
    const payments = await Bookings.find(fields)
      .skip(fields?.skip)
      ?.limit(fields?.limit)
      .sort("-createdAt")
      .populate("house", "name address price bathrooms bedrooms image")
      .populate("author", "name email phone address profileImage avatar");
    const count = await Bookings.countDocuments({ user: id });

    if (payments) {
      res.status(200).send({
        success: true,
        message: "Payment statement fetched successfully",
        data: { payments, count },
      });
    }
  } catch (err) {
    res.status(404).send({
      success: false,
      message: "Server error" + err,
    });
  }
};

/* Get Payment Statement  for house holder*/
const getPaymentStatementForHouseHolder = async (req, res) => {
  const { id } = req?.user;
  const { page, limit, search } = req?.query;

  try {
    const fields = {};
    if (page || limit) {
      fields.skip = (parseInt(page) - 1) * parseInt(limit);
      fields.limit = parseInt(limit);
    }
    if (id) {
      fields.author = id;
    }
    if (search) {
      fields.$or = [{ transactionId: { $regex: search, $options: "i" } }];
    }

    const payments = await Bookings.find(fields)
      .skip(fields?.skip)
      ?.limit(fields?.limit)
      .sort("-createdAt")
      .populate("house", "name address price bathrooms bedrooms image")
      .populate("user", "name email phone address profileImage avatar role");
    const count = await Bookings.countDocuments({ author: id });

    if (payments) {
      res.status(200).send({
        success: true,
        message: "Payment statement fetched successfully",
        data: { payments, count },
      });
    }
  } catch (err) {
    res.status(404).send({
      success: false,
      message: "Server error" + err,
    });
  }
};

/* Delete Payment Statement */
const deletePaymentStatement = async (req, res) => {
  const { id } = req?.params;
  try {
    const payment = await Bookings.findByIdAndDelete(id);

    /* Delete from User Model as well */
    const user = await User.findByIdAndUpdate(
      { _id: payment?.user },
      { $pull: { bookedHouses: payment?.house } },
      { new: true }
    );

    if (payment && user) {
      res.status(200).send({
        success: true,
        message: "Payment statement deleted successfully",
      });
    }
  } catch (err) {
    res.status(404).send({
      success: false,
      message: "Server error" + err,
    });
  }
};

/* Get all the report for customer */
const getAllPaymentReports = async (req, res) => {
  const { id } = req?.user;
  try {
    const bookedHouse = await Bookings.countDocuments({ user: id });
    const totalReviews = await appReview.countDocuments({ author: id });
    const totalBlogs = await Blog.countDocuments({ author: id });
    const blog = await Blog.find({ author: id });
    const countLikes = blog?.reduce((acc, cur) => {
      return acc + cur?.likes?.length;
    }, 0);

    const recentBookedHouse = await Bookings.find({ user: id })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate(
        "house",
        "name address price bathrooms bedrooms image houseType description"
      );

    res.status(200).send({
      success: true,
      message: "Payment reports fetched successfully",
      data: {
        house: bookedHouse,
        reviews: totalReviews,
        blogs: totalBlogs,
        likes: countLikes,
        bookedHouse: recentBookedHouse,
      },
    });
  } catch (err) {
    res.status(404).send({
      success: false,
      message: "Server error" + err,
    });
  }
};

/* Send Thanks Email to user */
const sendThanksEmail = async (req, res) => {
  const { to, from, subject, text, data } = req?.body;

  if (!to || !from || !subject || !text) {
    return res.status(404).send({
      success: false,
      message: "All fields are required.",
    });
  }
  await sendThanksEmailTemplate(to, from, text, subject, data);
  res.status(201).send({
    success: true,
    message: `Successfully sent your thanks mail.`,
  });
};

/* Init SSL Payment method */
const initSSLCOMMERZMethod = async (req, res) => {
  const data = {
    total_amount: 100,
    currency: "BDT",
    tran_id: "REF123", // use unique tran_id for each api call
    success_url: "http://localhost:3030/success",
    fail_url: "http://localhost:3030/fail",
    cancel_url: "http://localhost:3030/cancel",
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "Courier",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: "Customer Name",
    cus_email: "customer@example.com",
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };
  const sslcz = new SSLCommerzPayment(process.env.SSL_STORE_ID, process.env.SSL_STORE_PASSWORD, process.env.SSL_IS_LIVE);
  sslcz.init(data).then((apiResponse) => {
    // Redirect the user to payment gateway
    let GatewayPageURL = apiResponse?.GatewayPageURL;
    res.redirect(GatewayPageURL);
    console.log("Redirecting to: ", GatewayPageURL);
  });
};

//exports
module.exports = {
  createPaymentInstance,
  saveBookings,
  getBookedHouses,
  getPaymentStatement,
  deletePaymentStatement,
  getAllPaymentReports,
  getPaymentStatementForHouseHolder,
  sendThanksEmail,
  initSSLCOMMERZMethod
};
