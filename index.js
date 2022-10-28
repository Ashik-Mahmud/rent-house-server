
// Language: javascript
// Path: server\src\app.js
const app = require('./app');

const port = process.env.PORT || 5000;

/* Imports Routes */
const houseRouter = require('./routes/house.route');
const userRouter = require('./routes/user.route');
const adminRouter = require('./routes/admin.route');
const reviewRouter = require('./routes/review.route');
const questionRouter = require('./routes/question.route');
const reportHouseRouter = require("./routes/reportHouse.route")
const blogRouter = require("./routes/blogs.route")
const requestRouter = require("./routes/request.route")
const paymentRouter = require("./routes/payment.route")


/* Init Routes */

//house route
app.use("/api/v1/houses", houseRouter);

//user route
app.use("/api/v1/users", userRouter);

//admin route
app.use("/api/v1/admin", adminRouter);

//reviews route
app.use("/api/v1/reviews", reviewRouter);

//question route
app.use("/api/v1/questions", questionRouter);

//reports route
app.use("/api/v1/reports", reportHouseRouter)

// blog route
app.use("/api/v1/blogs", blogRouter);

// request route
app.use("/api/v1/request", requestRouter);

// payment route 
app.use("/api/v1/payment", paymentRouter)




/* Start Server */
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});


/* Global Error Handlers and Route Validations */
app.use((req, res, next) => {
    res.status(404).send({success: false, message: "Route not found"});
});

app.use((err, req, res, next) => {
    const error = new Error('Not Found');
    if(req.headerSent) {
        return next(error);
    }
    res.status(404).json({
        message: error.message
    });
});
process.on("unhandledRejection", (err, promise,) => {
    if(err){
        console.log(`Logged Error: ${err}`);
        app.close(() => process.exit(1));
    }
});
