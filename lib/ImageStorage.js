
var fs = require('fs');
var crypto = require('crypto');
var fileName = "images.json";

function ImageStorage() {
	var fileContents = fs.readFileSync(fileName);
	this.photos = JSON.parse(fileContents);
}

function getNextID(photos) {
	if (photos.length == 0) {
		return 0;
	}
	return photos[photos.length - 1].id + 1;
}

function insertImage(photos, image) {
	for (i = 0; i < photos.length; i++) {
		if (photos[i].id < image.id) {
			photos.splice(i, 0, image);
			return;
		}
	}
	photos.push(image);
}

ImageStorage.prototype.addPhoto = function(image) {
	image.id = getNextId(this.photos);
	var splitFileName = image.file.name.split('.');
	if (splitFileName.length < 2) {
		return false;
	}
	var extension = splitFileName[splitFileName.length - 1];
	image.url = '/images/' + id + extension;
	insertImage(this.photos, image);
}
ImageStorage.prototype.save = function(callback) {
	var data = JSON.stringify(this.photos);
	fs.writeFile(fileName, data, callback);
	console.log("Saved file");
}
ImageStorage.prototype.getPhoto = function(id) {
	for (i = 0; i < this.photos.length; i++) {
		if (photos[i].id == id) {
			return photos[i];
		}
	}
	return null;
}


module.exports = new ImageStorage();