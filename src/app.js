const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const bodyParser = require("body-parser");


/* Apply Global Middle ware */
app.use(express.json())
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.resolve('uploads')))
app.use(bodyParser.urlencoded({ extended: false }));


/* Database Connections */
const dbConnection = require('./../utils/dbConnection');
dbConnection();

/* Test Routes */
app.get("/", (req, res) => {
    res.send({success: true, message: "Welcome to the RENT HOUSE API"});
});




module.exports = app;