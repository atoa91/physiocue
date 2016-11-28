var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require("cookie-session");
var flash = require("connect-flash");
var mongoose = require("mongoose");
var messages = require("express-messages");
var bodyParser = require('body-parser');
var passport = require('passport');
var str2json = require("string-to-json");
//Routers
var index = require('./routes/index');
var users = require('./routes/users');
var hat = require('hat');
var historyRouter = require("./routes/history");
var authRouter = require("./routes/auth");
var homeRouter = require("./routes/home");
//var apiRouter = require("./routes/api");
var mainRouter = require("./routes/main");
var infoRouter = require("./routes/myinfo");

var app = express();

//DB connector
mongoose.connect("mongodb://physiocue:1234@ds135577.mlab.com:35577/greeenmate");
var db = mongoose.connection;

db.once("open", function() {
  console.log("Database is connected");
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');



// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name: "session",
  keys:['physiocue']
  // resave: true,
  // saveUninitialized: true
}));

app.use(flash());
app.use(function(req, res, next) {
  res.locals.messages = messages(req, res);
  next();
});

app.use(passport.initialize());
app.use(passport.session());  // function (req, res, next){...}
require("./config/passport")(passport); //code split middleware "passport"
var match = hat().substring(0,6);
app.use(function(req, res, next){
  res.locals.user = req.user;
  res.locals.match = match;
  next();
});




//rotuer
app.use("/", homeRouter);
app.use("/", authRouter);
//app.use("/api/",apiRouter);
app.use("/api/",mainRouter);
app.use("/api/",historyRouter);
app.use("/api/",infoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.get('/favicon.ico', function(req, res) {
    res.send(200);
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  var errorJson = str2json.convert({"error":err.message,"status":err.status});
  res.json(errorJson);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //// render the error page
  // res.status(err.status || 500);
  // res.render('error');
});


module.exports = app;
