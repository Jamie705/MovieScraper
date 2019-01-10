var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var dotenv = require("dotenv");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// adding handlebars
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3001;

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
var databaseUri = "mongodb://localhost/movieScrapper";

var MONGODB_URI = process.env.MONGODB_URI

if (MONGODB_URI) {
    //execute heroku
    mongoose.connect("mongodb://Jamie:P@ssword123@ds017258.mlab.com:17258/heroku_wf613lqw"), {
        useNewUrlParser: true
        }
    }
    else{
    mongoose.connect(databaseUri);
    } 

//Routes
//=================
var routes = require("./controllers/routes.js");
app.use(routes);

// Start the server
app.listen(process.env.PORT || PORT, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

module.exports = app;
