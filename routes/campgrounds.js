var express      = require("express");
var router       = express.Router();
var Campground   = require("../models/campground");
var middleware   = require("../middleware");



// INDEX-show all campgrounds
router.get("/",function(req,res){
   //get all campgrounds from the DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       }else{
        res.render("campgrounds/index",{campgrounds: allCampgrounds,currentUser: req.user, page: 'campgrounds'});   
       }
   });
});

//create =add new campground to DB
//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var price   = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  
    var newCampground = {name: name,price: price, image: image, description: desc, author:author};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});
// new- show form to create new campground
router.get("/new", middleware.isLoggedIn,function(req,res){
   res.render("campgrounds/new"); 
});

//SHOWS more info on it one campground
router.get("/:id", function(req,res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
           console.log(err);
       } else{
           console.log(foundCampground);
           //render show template with that campground
           res.render("campgrounds/show", {campground: foundCampground});
       }
    });
});


//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }
       res.render("campgrounds/edit", {campground: foundCampground}); 
    });
    
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });



//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
       } else{
           res.redirect("/campgrounds");
       }
    });
});


module.exports = router;