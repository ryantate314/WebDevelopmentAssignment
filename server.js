var express = require('express');
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

app.get('/', function(req, res) {
        res.render('home');
});

//Custom 404 page
app.use(function(req, res, next){
        res.status(404);
        res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
        console.error(err.stack);
        res.status(500);
        res.render('500');
});

var server = app.listen(3000, function(){
	var host = server.address().address;
	var port = server.address().port;
	
	console.log("Application listening at http://%s:%s", host, port);
});