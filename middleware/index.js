
var Campground =require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};
// all middlewares goes here

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error","Campground not found");
                res.redirect("back");
            } else{
                //does own the repo
                console.log(foundCampground.author.id);
                console.log(req.user._id);
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You do not have permissions to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }    
}
    
middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else{
                //does own the repo
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You dont have permision to do that");
                    res.redirect("back");
                }
            }
    });
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }    
}

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be looged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;