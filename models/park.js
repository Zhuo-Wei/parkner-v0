var mongoose = require("mongoose")

//schema setup
var parkSchema = new mongoose.Schema({
	name: String,
	price: Number,
	image: String,
	location: String,
	lat: Number,
	lng: Number,
	description: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{type:mongoose.Schema.Types.ObjectId,
		ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Park", parkSchema);