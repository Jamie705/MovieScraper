var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
// var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

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
mongoose.connect("mongodb://localhost/movieScrapper", {
    useNewUrlParser: true
});

// Save an empty result object
var results = [];
// Routes
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://screenrant.com/movie-news/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
                
        // Now, we grab every h2 within an article tag, and do the following:
        $("div.bc-info").each(function (i, element) {
            
            // Add the text and href of every link, and save them as properties of the result object
            var title = $(element)
                .children("h3")
                .text();
            var exerpt = $(element)
                .children("p")
                .text();
            var link = $(element)
                .children("a")
                .attr("href");

//TO DO: add elseIF to only add when all feilds are valid
            results.push({
                title: title,
                exerpt: exerpt,
                link: link
            });
        });

        // Send a message to the client
        console.log(results);
    });
 // Send a "Scrape Complete" message to the browser
 res.send("Scrape Complete" + results);
 });

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
