var mongoose = require("mongoose");
 
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   price: String,
   author:{
	   id:{
		   type: mongoose.Schema.Types.ObjectId,
		   ref: "User"
	   },
	   username: String
   },
	comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

const Comment = require('./comment');
campgroundSchema.pre('remove', async function() {
	await Comment.deleteMany({
		_id: {
			$in: this.comments
		}
	});
});
 
module.exports = mongoose.model("Campground", campgroundSchema);