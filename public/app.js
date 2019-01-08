// When you click the latest movie  button
$(document).on("click", "#scrape", function (data) {
    // Run a GET request to change the note, using what's entered in the inputs
    $.ajax({
            method: "GET",
            url: "/scrape/",
            data: data
        })
        
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
        });

});

// Whenever someone clicks a p tag
$(document).on("click", "#exerpt", function () {
    // Empty the notes from the note section
    $("#notes").empty().css("display","block");
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // The title of the article
            $("#notes").append("<h5>" + data.title + "</h5>"

                // An input to enter a new title
                +"<input id='titleinput' name='title'></input>"

                // A textarea to add a new note body
                +"<textarea id='bodyinput' name='body'></textarea>"

                // A button to submit a new note, with the id of the article saved to it
                +"<button class='waves-effect' data-id=" + data._id + " id='savenote'>Save Comment</button>");

            // If there's a note in the article
            if (data.note) {
                // Place the title of the note in the title input
                $("#titleinput").append("<p>"+ data.note.title + "</p>");
                // Place the body of the note in the body textarea
                $("#bodyinput").append(data.note.body);
            }
        });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                // Value taken from title input
                title: $("#titleinput").val(),
                // Value taken from note textarea
                body: $("#bodyinput").val()
            }
        })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});

// When you click the TV news, it gets tv articlels
$(document).on("click", "#TvArticle", function (data) {
    // Run a GET request tv data
    $.ajax({
            method: "GET",
            url: "/scrapeTv/",
            data: data
        })

        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
        });
});

// Whenever someone clicks a p-tv-exerpt tag
$(document).on("click", "#tv-exerpt", function () {
    // Empty the notes from the note section
    $("#tv-notes").empty().css("display", "block");
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
            method: "GET",
            url: "/tvArticles/" + thisId
        })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // The title of the article
            $("#tv-notes").append("<h5>" + data.title + "</h5>"

                // An input to enter a new title
                +
                "<input id='tv-titleinput' name='title' placeholder='Title of comment'></input>"

                // A textarea to add a new note body
                +
                "<textarea id='tv-bodyinput' name='body'></textarea>"

                // A button to submit a new note, with the id of the article saved to it
                +
                "<button class='waves-effect' data-id=" + data._id + " id='tv-savenote'>Save Comment</button>");

            // If there's a note in the article
            if (data.note) {
                // Place the title of the note in the title input
                $("#tv-note-title").append(data.note.title);
                // Place the body of the note in the body textarea
                $("#tv-note-body").append(data.note.body);
            }
        });
});

// When you click the tv-savenote button
$(document).on("click", "#tv-savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "POST",
            url: "/tvArticles/" + thisId,
            data: {
                // Value taken from title input
                title: $("#tv-titleinput").val(),
                // Value taken from note textarea
                body: $("#tv-bodyinput").val()
            }
        })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});

// When you click the delete button
$(document).on("click", "#delete", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    //GET request to delete article
    $.ajax({
            method: "GET",
            url: "/delete/" + thisId,
         
            success: function (response) {

                console.log("Deleted" + thisId)
                //reload page
                location.reload(true);
            }
        })
});

// When you click the delete button
$(document).on("click", "#tv-delete", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    //GET request to delete article
    $.ajax({
        method: "GET",
        url: "/tvdelete/" + thisId,

        success: function (response) {

            console.log("Deleted" + thisId)
            //reload page
            location.reload(true);
        }
    })
});