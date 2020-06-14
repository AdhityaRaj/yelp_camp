var express = require('express'),
	passport = require('passport'),
	router = express.Router();

var User = require('../models/user');

router.get("/",(req,res)=>{
    res.render("landing");
});
//Auth Routes

router.get('/register',(req,res)=>{
	res.render('register');
});

router.post('/register',(req,res)=>{
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err,user)=>{
		if(err){
			return res.render('register',{"error" : err.message});
		}
		passport.authenticate('local')(req,res,()=>{
			req.flash("success","Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

router.get('/login',(req,res)=>{
	res.render('login');
});

router.post('/login',passport.authenticate('local',{
	successRedirect : '/campgrounds',
	failureRedirect : '/login',
	failureFlash : true
	}),(req,res)=>{
});


router.get('/logout',(req,res)=>{
	req.logout();
	req.flash("success","Logged You Out!");
	res.redirect('/campgrounds');
});

module.exports = router;
