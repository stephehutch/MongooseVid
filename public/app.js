
let rating = "";
// Grab the articles as a json
$.getJSON("/articles", data => {
  // For each one

  data.forEach(i => {
    let elem = data.indexOf(i)
    // Display the apropos information on the page
    let currentVid = '<div class="card " data-id='+ i._id +'> <div class="card-body">'
                      + '<p class="card-text><a href=' + i.link 
                      + ' target="_blank">'
                      + i.title + "<br />"
                      + i.duration + "</a></p></div></div>"
    $("#video").append(currentVid)
    if (i.note) {
      $( ".card:last" ).addClass("card bg-light " + elem)
      $.ajax({
        method: "GET",
        url: "/articles/" + i._id
      }).then( data => {
          console.log(data.note.body)
          if(data.note.title){
           console.log(elem)
           $(`.${elem}`).removeClass("card bg-light")
            $(`.${elem}`).addClass(data.note.title)
          }
          
      });
    }
  });

});


// Whenever someone clicks a p tag
$(document).on("click", "#video .card", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  if ( $('#notes').parent().is( ".card-body" ) ) {
    $('#notes').unwrap()
    $('#notes').unwrap()
  }
  
  // Save the id from the p tag
  let thisId = $(this).attr("data-id");
  // Now make an ajax call for the article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(data => {
      // The title of the artic
      $("#notes").append("<h5>" + data.title + "</h5>");
      // An input to enter a new title
      $("#notes").append('<div class="ratings"><button type="button" value="card text-white bg-secondary" class="rate btn btn-secondary">Unwatched</button>' 
                        + '<button type="button" value="card text-white bg-success" class="rate btn btn-success"><i class="fas fa-thumbs-up"></i></button>'
                        + '<button type="button" value="card text-white bg-danger" class="rate btn btn-danger"><i class="fas fa-thumbs-down"></i></button>'
                        + '<button type="button" value="card text-white bg-warning" class="rate text-white btn btn-warning">Meh <i class="fas fa-meh-rolling-eyes"></i></button><div>');
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button class='btn'data-id="+ data._id+"  id='savenote'>Leave Comment</button>");
      $('#notes').wrap('<div id="notesCard" data-id='+ data._id + ' class="card"><div class="card-body"></div></div>')
      $(document).on("click", ".rate", function () {
       // $(this).removeClass("text-white")
          rating = $(this).val()
          console.log(rating)
          console.log(this)
          $('.ratings').hide();
      });
      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        //console.log(data.note);
        // Place the body of the note in the body textarea
       // $(this).addClass(data.note.title)
        $("#bodyinput").val(data.note.body);
      }
    });
});
console.log(rating)
// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  let thisId = $(this).attr("data-id");
  
  console.log("rating before ajax", rating)
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: rating,
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(data => {
      console.log("rating pulled back from db", data.note.title)
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

