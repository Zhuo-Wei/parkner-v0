var express = require("express"),
 	router = express.Router(),
	passport = require("passport"),
	User = require("../models/user"),
	middleware = require("../middleware");

//root route
router.get("/", function(req, res) {
	res.render("landing");
});

//show register form
router.get("/register", function(req, res){
	res.render("register",  {page: 'register'});
})

//handle sign up logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user) {
		if(err){
				console.log(err);
            	req.flash("error", err.message);
				res.render("register")
           } 
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
			res.redirect("/parks");
		});
	});
});
//"/login", middleware, callback

//show login form
router.get("/login", function(req, res) {
	res.render("login", {page: 'login'});
})

//handle login logic
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/parks",
		failureRedirect: "/login"
	}), function(req, res){
	
});

//logout route
router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "See you later!");
	res.redirect("/parks");
});



module.exports = router;