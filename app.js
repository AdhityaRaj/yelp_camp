//Importing npm libraries
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	methodOverride = require('method-override'),
	flash = require('connect-flash'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
	User = require('./models/user'),
    seedDB = require('./seeds');

//Requriring Routes
var campgroundRoutes = require('./routes/campgrounds'),
	commentRoutes = require('./routes/comments'),
	indexRoutes = require('./routes/index');

//Common setup for app
mongoose.connect('mongodb+srv://Adhi:adhi2009T@yelpcamp-0brl1.mongodb.net/yelp_camp?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

//Passport Configuration
app.use(require('express-session')({
	secret : "Chennaiyin FC",
	resave : false,
	saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//routes
app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

//Server Port
app.listen(process.env.PORT,process.env.IP,()=>{
    console.log("Yelp Camp Server is Running");
});