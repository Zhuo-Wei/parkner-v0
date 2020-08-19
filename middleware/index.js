var middlewareObj = {},
	Park = require("../models/park"),
	Comment = require("../models/comment");

middlewareObj.checkParkOwnership = function(req, res, next){
	if(req.isAuthenticated()) {
		Park.findById(req.params.id, function(err, foundPark) {
			if(err){
				req.flash('error', 'Something went wrong');
               res.redirect("back");
           	} else {
               // does user own the park?
				
            	if(foundPark.author.id.equals(req.user._id)) {
            	next();
            	} else {
					req.flash('error', 'You do not have permission to do that');
            	    res.redirect("back");
            	}
           	}
        });			
	} else {
		req.flash('error', 'You must be signed in to do that!');
		res.redirect("back");
	}
}
middlewareObj.checkCommentOwnership = function (req, res, next){
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if(err){
				req.flash('error', 'Park not found');
               	res.redirect("back");
           	} else {
               // does user own the Park?
            	if(foundComment.author.id.equals(req.user._id)) {
            	next();
            	} else {
					req.flash('error', 'You do not have permission to do that');
            	    res.redirect("back");
            	}
           	}
        });			
	} else {
		req.flash('error', 'You must be signed in to do that!');
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash('error', 'You must be signed in to do that!');
	res.redirect("/login");
}
module.exports = middlewareObj;