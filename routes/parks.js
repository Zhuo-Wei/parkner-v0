var express = require("express"),
 	router = express.Router(),
	Park = require("../models/park"),
	Comment = require("../models/comment"),
	middleware = require("../middleware"),
	NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);
//INDEX-show all 
router.get("/", function(req, res) {
	Park.find({}, function(err, allParks) {
					if (err){
						console.log(err);
					} else {
						res.render("parks/index", {parks: allParks, page: 'parks'});
					}
	});		
});

//CREATE - add new park to DB		
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to pakrs array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var price = req.body.price;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newPark = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng, price: price};
    // Create a new park and save to DB
  	Park.create(newPark, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to pakrs page
            console.log(newlyCreated);
            res.redirect("/parks");
        }
    });
  });
});

//NEW - show form to create new park
router.get("/new",middleware.isLoggedIn, function(req, res) {
	res.render("parks/new")
});

// SHOW - shows more info about one park
router.get("/:id", function(req, res) {
	//find the cpark with provided provided
	Park.findById(req.params.id).populate("comments").exec(function(err, foundPark) {
		if (err){
			req.flash('error', 'Sorry, that park does not exist!');
            return res.redirect('/parks');
		} else {
			res.render("parks/show",{park : foundPark})	;	
		}
	});
});

//edit park route
router.get("/:id/edit", middleware.checkParkOwnership, function(req, res){
	Park.findById(req.params.id, function(err, foundPark){
        res.render("parks/edit", {park: foundPark});
    });
});

router.put("/:id", middleware.checkParkOwnership, function(req, res){

	
	
	
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
	  console.log(err);
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.park.lat = data[0].latitude;
    req.body.park.lng = data[0].longitude;
    req.body.park.location = data[0].formattedAddress;

    Park.findByIdAndUpdate(req.params.id, req.body.park, function(err, park){
        if(err){
			console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/parks/" + park._id);
        }
    });
  });
});

//delete Park route
router.delete("/:id", middleware.checkParkOwnership, function(req, res){
	Park.findByIdAndRemove(req.params.id, (err, parkRemoved) => {
        if (err) {
			req.flash('error', err.message);
			res.redirect('/');
        }
        Comment.deleteMany( {_id: { $in: parkRemoved.comments } }, (err) => {
            if (err) {
                req.flash('error', err.message);
            }
			req.flash('error', 'Park deleted!');
            res.redirect("/parks");
        });
    });
});


module.exports = router;