var express = require('express');
var url = require('url');
var fs = require('fs');
var formidable = require('formidable');
var app = express();

//The URL in which the browser looks for uploaded images
var GALLERY_URL = "/gallery";
//The file path to the upload directory
var UPLOAD_DIR = __dirname + "/public/gallery";

var images = [
	{
		id			: 0,
		title		: "Soft Kitty",
		description	: "This is a very soft kitty.",
		url			: "/gallery/cat_1.jpg"
	}
];

function getNextImageId() {
	if (images.length == 0) {
		return 0;
	}
	return images[images.length - 1].id + 1;
}

function findImage(id) {
	for (var i = 0; i < images.length; i++) {
		if (images[i].id == id) {
			return images[i];
		}
	}
	return null;
}

function addImage(image) {
	for (var i = 0; i < images.length; i++) {
		if (images[i].id > image.id) {
			images.splice(i, 0, image);
			return;
		}
	}
	images.push(image);
}

app.set('port', process.env.PORT || 3000);

// Set up handlebars view engine
var handlebars = require('express-handlebars')
        .create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//Set location of static content
app.use(express.static(__dirname + '/public'));
app.use(require('body-parser')());


/* Begin Routing Information
 ***********************************************/
 
//Redirect root path to index
app.all('/', function(req, res) {
	res.redirect('index');
});

app.get('/index', function(req, res) {
	res.render('index', { images : images, title : " Home | Photo Sharing Site " });
});

app.get('/upload', function(req, res) {
	res.render('upload', { title : "Upload | File Sharing Site" });
});

app.get('/login', function(req, res) {
	res.render('login', { title : "Login | Photo Sharing Site " });
});

app.get('/details/:id', function(req, res) {
	var id = req.params.id;
	var image = findImage(id);
	if (!image) {
		res.render('details', { error : "No image with id '" + id + "'", title : "Image Not Found | File Sharing Site" });
		return;
	}
	res.render('details', { image : image, title : image.title + " | File Sharing Site " });
});

app.post('/upload', function(req, res) {
	var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        if(err) return res.redirect(303, '/error');
        var image = {};
		image.title = fields.title;
		image.description = fields.description;
		image.id = getNextImageId();
		
		if (files.length < 1) {
			fields.error = "No file uploaded.";
			res.render('upload', fields);
			return;
		}
		//console.log(files);
		//res.render('upload', fields);
		//return;
		
		var file = files.file;
		var splitFileType = file.type.split('/');
		var extension = splitFileType[splitFileType.length - 1];
		var filename = UPLOAD_DIR + '/' + image.id + '.' + extension;
		
		image.url = GALLERY_URL + "/" + image.id + '.' + extension;
		
		//Copy file to media directory
		fs.readFile(file.path, function(err, data) {
			fs.writeFile(filename, data, function(err) {
				console.log("Movied file from '" + file.path + "' to '" + filename + "'.");
				fs.unlink(file.path, function(){
					if (err) {
						fields.error = err;
						fields.title = "Upload | File Sharing Site";
					res.render('upload', fields);
						return;
					}
					addImage(image);
					res.redirect("details/" + image.id);
				});
			});
		});
    });
});//END POST /upload

/* END Routing
 ***************************************/


var server = app.listen(3000, function(){
	var host = server.address().address;
	var port = server.address().port;
	
	console.log("Application listening at http://%s:%s", host, port);
});