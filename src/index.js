

// Language: javascript
// Path: server\src\app.js
const app = require('./app');



/* Imports Routes */
const houseRouter = require('./../routes/house.route');
const userRouter = require('./../routes/user.route');

/* Init Routes */
app.use("/api/v1/houses", houseRouter);
app.use("/api/v1/users", userRouter);







/* Global Error Handlers and Route Validations */
app.use((err, req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use("*", (req, res, next) => {
    res.status(404).send({success: false, message: "Route not found"});
});

process.on("unhandledRejection", (err, promise) => {
    if(err){
        console.log(`Logged Error: ${err}`);
        app.close(() => process.exit(1));
    }
});
