var express = require("express"),
 	router = express.Router({mergeParams: true}),
	Park = require("../models/park"),
	Comment = require("../models/comment"),
	middleware = require("../middleware");

//comment new
router.get("/new", middleware.isLoggedIn, function(req, res){
	Park.findById(req.params.id, function(err, park) {
		if (err){
			console.log(err);
		} else {
			res.render("comments/new",{park : park})	;	
		}
	});
});

//comment create
router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup park using ID
   Park.findById(req.params.id, function(err, park){
       if(err){
           console.log(err);
           res.redirect("/parks");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
			   comment.author.id = req.user._id;
			   comment.author.username = req.user.username;
			   comment.save();
               park.comments.push(comment);
               park.save();
			   req.flash('success', 'Created a comment!');
               res.redirect('/parks/' + park._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to park
   //redirect park show page
});

//comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
       if(err){
           res.redirect("back");
       } else {
			res.render("comments/edit", {park_id: req.params.id, comment: foundComment});
	   }
	});
});

//comment update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else {
		   res.redirect("/parks/" + req.params.id);
	   }
	});
});

//comment destroy router
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err, parkRemoved){
        if (err) {
			req.flash('error', err.message);
            res.redirect("back");
        }
		 req.flash('error', 'Comment deleted!');
		res.redirect("/parks/" + req.params.id);
        
       
    });
});


module.exports = router;