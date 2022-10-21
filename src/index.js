

// Language: javascript
// Path: server\src\app.js
const app = require('./app');



/* Imports Routes */
const houseRouter = require('./../routes/house.route');
const userRouter = require('./../routes/user.route');
const adminRouter = require('../routes/admin.route');
const reviewRouter = require('../routes/review.route');
const questionRouter = require('../routes/question.route');
const reportHouseRouter = require("../routes/reportHouse.route")
const blogRouter = require("../routes/blogs.route")
const requestRouter = require("../routes/request.route")
/* Init Routes */
app.use("/api/v1/houses", houseRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/questions", questionRouter);
app.use("/api/v1/report-house", reportHouseRouter)
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/request", requestRouter);







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
