var express = require('express'),
	router = express.Router();

var Campground = require('../models/campground'),
	Comment = require('../models/comment');

//Middleware
var middleware = require("../middleware");

router.get("/",(req,res)=>{
    Campground.find({},(err,allCampgrounds)=>{
        if(err){
            console.log(err);
        } else{
        res.render("campgrounds/index",{campgrounds : allCampgrounds});
        }
    });
});

router.get("/new",middleware.isLoggedIn,(req,res)=>{
    res.render("campgrounds/new");
});

router.post("/",middleware.isLoggedIn,(req,res)=>{
    // var name= req.body.name;
    // var img = req.body.image;
    // var desc = req.body.description;
    Campground.create(
        {
            name: req.body.name,
            image:req.body.image,
            description:req.body.description,
			price:req.body.price,
			author: {
				id: req.user._id,
				username: req.user.username
			}
        },(err,campground)=>{
            if(err){
                console.log(err);
            }
            else{
				console.log(campground);
                res.redirect("/campgrounds");
            }
    });
});

router.get("/:id",(req,res)=>{
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground)=>{
        if(err){
            console.log(err);
        }
        else{
          res.render("campgrounds/show",{campground : foundCampground});
        }
    });
});

router.get("/:id/edit",middleware.checkCampgroundOwnership,(req,res)=>{
	Campground.findById(req.params.id,(err, foundCampground)=>{
		if(err){
			req.flash("error", err.message);
			res.redirect("/campgrounds/"+req.params.id);
		}
		else{
			res.render("campgrounds/edit",{campground: foundCampground});
		}
	});
});

router.put("/:id",middleware.checkCampgroundOwnership,(req,res)=>{
	Campground.findOneAndUpdate({_id: req.params.id},req.body.campground,(err, updatedCampground)=>{
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

// router.delete("/:id",(req,res)=>{
// 	Campground.findByIdAndRemove(req.params.id,(err)=>{
// 		if(err){
// 			res.redirect("/campgrounds");
// 		}
// 		else{
// 			res.redirect("/campgrounds");
// 		}
// 	});
// });

router.delete("/:id",middleware.checkCampgroundOwnership,async(req, res) => {
  try {
    let foundCampground = await Campground.findById(req.params.id);
    await foundCampground.remove();
	await req.flash("success","Campground deleted Successfully")
    res.redirect("/campgrounds");
  } catch (error) {
    await req.flash("error",error.message);
    res.redirect("/campgrounds");
  }
});

module.exports = router;