var express = require('express');
var fs = require('fs');
var app = express();


app.set('port', process.env.PORT || 3000);

// Set up handlebars view engine
var handlebars = require('express-handlebars')
        .create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

// Define debugging flag
app.use(function(req, res, next){
	res.locals.showTests = app.get('env') !== 'production' &&
		req.query.test === '1';
	next();
});

app.all(/^\/$/, function(req, res) {
	res.writeHead(302, {
		'Location': '/Home/Index'
	});
	res.end();
});

app.all(/^\/[a-zA-Z]+\/[a-zA-Z]+(\/[0-9]{1,10})?$/, function(req, res) {
	// .../CONTROLLER/METHOD(/ID)?
	console.log("Valid Controller Route");
	var pieces = req.url.split("/");
	var controllerName = pieces[1].toLowerCase();
	var func = pieces[2].toLowerCase();
	var method = req.method;
	var controllerPath = "./controllers/" + controllerName + ".js";
	console.log(controllerPath);
	//See if controller exists
	try {
		fs.accessSync(controllerPath);
	}
	catch (ex) {
		console.log("Unknown controller: " + controllerName);
		pageNotFound(req, res);
		return;
	}
	var controllerClass = require(controllerPath);
	console.log(controllerClass);
	console.log("Type: " + typeof controllerClass[func]);
	if (typeof controllerClass[method] === "function") {
		controllerClass[func](req, res);
	}
	else {
		console.log("Unknown controller method: " + func);
		pageNotFound(req, res);
		return;
	}
});

//Custom 404 page
app.use(pageNotFound);

// 500 error handler (middleware)
app.use(function(err, req, res, next){
		console.error(err.stack);
		res.status(500);
		res.render('500');
});
	
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

var server = app.listen(3000, function(){
	var host = server.address().address;
	var port = server.address().port;
	
	console.log("Application listening at http://%s:%s", host, port);
});