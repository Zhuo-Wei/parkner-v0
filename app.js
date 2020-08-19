var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  flash = require("connect-flash"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  Comment = require("./models/comment"),
  Park = require("./models/park"),
  User = require("./models/user"),
  seedDB = require("./seeds");

//requiring routes
var commentRoutes = require("./routes/comments"),
  parkRoutes = require("./routes/parks"),
  indexRoutes = require("./routes/index");

//mongoose.connect(process.env.DATABASEURL);

//mongoose.connect("mongodb://localhost:27017/yelp_project", {useNewUrlParser: true});
mongoose.connect(
  "mongodb+srv://ZhuoWeiYelp:951002Wz!@cluster0-7hshu.mongodb.net/ZhuoWeiYelp?retryWrites=true&w=majority"
);
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//passport configuration
app.use(
  require("express-session")({
    secret: "sad 2020",
    resave: false,
    saveUnintialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", indexRoutes);
app.use("/parks/:id/comments", commentRoutes);
app.use("/parks", parkRoutes);

app.listen(3000, function () {
  console.log("yelp project started");
});
