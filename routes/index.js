var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");
//root route
router.get("/",function(req,res){
   res.render("landing"); 
});

// AUTH ROUTES
router.get("/register",function(req, res) {
    res.render("register", {page: 'register'});
});
// sign up logic
//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/campgrounds"); 
        });
    });
});

// LOGIN ROUTES
router.get("/login", function(req, res) {
   res.render("login", {page: 'login'}); 
});
// app.post("/login", middleware, callback);
router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),function(req,res){
});

// LOGOUT ROUTE
router.get("/logout",function(req, res) {
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/campgrounds");
});

module.exports = router;