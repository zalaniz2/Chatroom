
// require express and path
var express = require("express");
var path = require("path");

// create the express app
var app = express();

// static content
app.use(express.static(path.join(__dirname, 'static')));

// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// tell the express app to listen on port 8000
var server = app.listen(8000, function() {
 console.log("Listening on port 8000");
})

// external routing module
var route = require('./routes/index.js')(app, server);
