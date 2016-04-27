var fs = require('fs');
var express = require('express');

var router = express.Router();

function redirectTo(req, res, url) {
	res.writeHead(302, {
		'Location': url
	});
	res.end();
}

function pageNotFound(req, res, next) {
	res.status(404);

	// respond with html page
	if (req.accepts('html')) {
		res.render('404', { url: req.url });
		return;
	}

	// respond with json
	if (req.accepts('json')) {
		res.send({ error: 'Not found' });
		return;
	}

	// default to plain-text. send()
	res.type('txt').send('Not found');
}

function executeMethod(controller, func, req, res, id) {
	id = id || null;
	
	var controllerPath = "./controllers/" + controller.toLowerCase() + ".js";
	console.log(controllerPath);
	//See if controller exists
	try {
		fs.accessSync(controllerPath);
	}
	catch (ex) {
		console.log("Unknown controller: " + controller);
		pageNotFound(req, res);
		return;
	}
	var controllerClass = require(controllerPath);
	console.log(controllerClass);
	if (typeof controllerClass[func] === "function") {
		controllerClass[func](req, res, id);
	}
	else {
		console.log("Unknown controller method: " + func);
		pageNotFound(req, res);
		return;
	}
}

//Redirect root directory to the default path
router.all(/^\/$/, function(req, res) {
	redirectTo(req, res, '/Gallery');
});

//GET /photos -> photos.index
router.get(/^\/[a-zA-Z]+\/?$/, function(req, res) {
	var controllerName = req.url.replace(/\//g, '');
	executeMethod(controllerName, 'index', req, res);
});

//GET /photos/new -> photos.new
router.get(/^\/[a-zA-Z]+\/[nN]ew\/?$/, function(req, res) {
	var pieces = req.url.split("/");
	var controllerName = pieces[1];
	executeMethod(controllerName, 'new', req, res);
});

//POST /photos -> photos.create
router.post(/^\/[a-zA-Z]+\/?$/, function(req, res) {
	var controllerName = req.url.replace(/\//g, '');
	executeMethod(controllerName, 'create', req, res);
});

//GET /photos/:id -> photos.show
router.get(/^\/[a-zA-Z]+\/[0-9]+$/, function(req, res) {
	var pieces = req.url.split("/");
	var controllerName = pieces[1];
	var id = pieces[2];
	executeMethod(controllerName, 'show', req, res, id);
});

//GET /photos/:id/edit -> photos.edit
router.get(/^\/[a-zA-Z]+\/[0-9]+\/[eE]dit$/, function(req, res) {
	var pieces = req.url.split("/");
	var controllerName = pieces[1];
	var id = pieces[2];
	executeMethod(controllerName, 'edit', req, res, id);
});

//PUT /photos/:id -> photos.updateCommands
router.put(/^\/[a-zA-Z]+\/[0-9]+$/, function(req, res) {
	var pieces = req.url.split("/");
	var controllerName = pieces[1];
	var id = pieces[2];
	executeMethod(controllerName, 'update', req, res, id);
});

//DELETE photos/:id -> photos.destroy
router.delete(/^\/[a-zA-Z]+\/[0-9]+$/, function(req, res) {
	var pieces = req.url.split("/");
	var controllerName = pieces[1];
	var id = pieces[2];
	executeMethod(controllerName, 'destroy', req, res, id);
});

//Custom function /photos/getRSSFeed
router.all(/^\/[a-zA-Z]+\/[a-zA-Z]+\/?/, function(req, res) {
	var pieces = req.url.split("/");
	var controllerName = pieces[1];
	var func = pieces[2];
	executeMethod(controllerName, func, req, res);
});

//Custom function /photos/:id/getRSSFeed
router.all(/^\/[a-zA-Z]+\/[0-9]+\/[a-zA-Z]+\/?$/, function(req, res) {
	var pieces = req.url.split("/");
	var controllerName = pieces[1];
	var id = pieces[2];
	var func = pieces[3];
	executeMethod(controllerName, func, req, res, id);
});

//Custom 404 page
router.use(pageNotFound);

// 500 error handler (middleware)
router.use(function(err, req, res, next){
		console.error(err.stack);
		res.status(500);
		res.render('500');
});

module.exports = router;