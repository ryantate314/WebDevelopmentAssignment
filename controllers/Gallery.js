
// var photos = [
	// {
		// id			: 0,
		// title		: "Happy Kitty",
		// url			: "/images/cat_1.jpg",
		// description	: "This is a very happy kitty.",
		// uploadDate	: "Today"
	// },
	// {
		// id			: 1,
		// title		: "Sleepy Kitty",
		// url			: "/images/cat_2.jpg",
		// description	: "This is a very sleepy kitty.",
		// uploadDate	: "Today"
	// }
// ];

var imageStorage = require('../lib/ImageStorage.js');
var formidable   = require('formidable');

function validateImage(req) {
	if (!req.body.title) {
		return false;
	}
	if (!req.body.description) {
		return false;
	}
	if (req.files.length == 0) {
		return false;
	}
	var image = {};
	image.id = req.body.id;
	image.title = req.body.title;
	image.description = req.body.description;
	image.file = req.files[0];
	return image;
}


var GalleryController = {
	index : function(req, res) {
		res.render("gallery/index", { 'photos' : imageStorage.photos });
	},
	
	new : function(req, res) {
		res.render("gallery/new");
	},
	
	//POST
	create : function(req, res) {
		console.log("Parsing form");
		var form = new formidable.IncomingForm();
		form.parse(req, function(err, fields, files) {
			console.log("Inside parse callback");
			if(err) res.render("gallery/new", { error : "Error parsing form." });
			console.log(files);
			console.log(fields);
			res.redirect("gallery/");
		});
		//var image = validateImage(req);
		//if (!image) {
		//	res.render("gallery/new", { error : "Invalid parameters." });
		//	return;
		//}
		//imageStorage.addPhoto(image);
		//imageStorage.save(function(err) {
		//	res.redirect('/Gallery/');
		//});
	},
	
	show : function(req, res, id) {
		var photo = {};
		for (var i = 0; i < imageStorage.photos.length; i++) {
			if (photos[i].id == id) {
				photo = imageStorage.photos[i];
			}
		}
		res.render("gallery/show", { 'photo' : photo });
	}
}

module.exports = GalleryController;