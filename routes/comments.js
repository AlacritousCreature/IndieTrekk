var express         = require("express");
var router          = express.Router({mergeParams: true});
var Campground      = require("../models/campground");
var Comment         = require("../models/comment");
var middleware      = require("../middleware");
//comment new
router.get("/new", middleware.isLoggedIn ,function(req, res){
    //get the campground by id
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        }else{
           res.render("comments/new",{campground: campground}); 
        }
    }
    );
});
//comment create
router.post("/", middleware.isLoggedIn,function(req,res){
   //lookup campground using id
   Campground.findById(req.params.id, function(err, campground) {
      if(err) {
          console.log(err);
          res.redirect("/campgrounds");
      }else{
          //create a comment
          Comment.create(req.body.comment, function(err,comment){
              if(err){
                  req.flash("Something went wrong");
                  console.log(err);
              }else{
                  // add username and id to comment
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  //and save comment
                  comment.save();
                  campground.comments.push(comment);
                  campground.save();
                  req.flash("success","Successfully added comment");
                  res.redirect("/campgrounds/" + campground._id);
              }
          });
      }
   });
});
//comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundCampground){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundCampground});
        }
    });
});

// comment update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");    
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    //find by id and then remove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;