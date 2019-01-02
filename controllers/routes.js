var express = require ("express");
var db = require("../models");

app = express();

var axios = require("axios");
var cheerio = require("cheerio");

    // Routes to get articles of movie site
    app.get("/scrape", function (req, res) {
        // First, we grab the body of the html with axios
        axios.get("https://screenrant.com/movie-news/").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);
            
            // Save an empty result object
            var result = {};
            // Now, we grab every article tag, and do the following:
            $("article.half-thumb").each(function (i, element) {
                
                //TO DO: If all fields have values, add fields 

                // add the h3 of the bc-info
                result.title = $(element)
                    .children("div.bc-info")
                    .children("h3")
                    .text();    

                // add the exerpt of the bc-info
                result.exerpt = $(element)
                    .children("div.bc-info")
                    .children("p")
                    .text();

                // add the link of the bc-info
                result.link = $(element)
                    .children("a")
                    .attr("href");

                // add the picturelink of the bc-info -- NOT working 
                result.imageLink = $(element)
                    .children("a")
                    .children("div")
                    .children("div")
                    .children("picture")
                    .children("source")
                    .attr("srcset");

                    // Create a new Article using the `result` object built from scraping
                db.Article.create(result)
                    .then(function (dbArticle) {
                        // View the added result in the console
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        // If an error occurred, log it
                        console.log(err);
                    });
            });

            var scrapedArticles= {
                articles: result
            }
            res.render("scrape", scrapedArticles)
        });
    });

    // Route for getting all Articles from the db
    app.get("/articles", function (req, res) {
        // Grab every document in the Articles collection
        db.Article.find({})
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.send(res);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({
                _id: req.params.id
            })
            // ..and populate all of the notes associated with it
            .populate("note")
            .then(function (dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        db.Note.create(req.body)
            .then(function (dbNote) {
                // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
                // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                return db.Article.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    note: dbNote._id
                }, {
                    new: true
                });
            })
            .then(function (dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });

    });

    // This will get the articles scraped and saved in db and show them in list.
    app.get("/", function (req, res) {

        // Grab every doc in the Articles array
        db.Article.find({}, function (error, data) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Or send the doc to the browser as a json object
            else {
                var ArticleObject = {
                    articles: data
                };
                res.render("index", ArticleObject);
            }
        });
    });



module.exports = app;