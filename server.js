var express = require('express');
var router = require('./routes.js');
var bodyParser = require('body-parser');
var app = express();


app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

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

app.use(router);


var server = app.listen(3000, function(){
	var host = server.address().address;
	var port = server.address().port;
	
	console.log("Application listening at http://%s:%s", host, port);
});