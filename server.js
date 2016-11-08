// MODULES VARIABLES
var express = require('express');
var app = express();
var config = require('./config').config;

// Static url routing for libs
app.use('/vuescript', express.static(__dirname + '/node_modules/vue/dist/'));
app.use('/mdlscript', express.static(__dirname + '/node_modules/material-design-lite/'));
app.use('/mdlcss', express.static(__dirname + '/views/'));
app.set('view engine', 'html');

// URLS FOR PAGES
	
	// Main page
	app.get('/', function(req, res){
		res.redirect('/main.html')
	});

	// Main files
	app.get('/main:end(.css|.html|.js)', function(req, res){
		res.sendFile(__dirname+'/views/main' + req.params.end);
	});

	//Items
	// html + js + css
	app.get('/item/:id(1|2|3|4):end(.css|.html|.js)', function (req, res) {
		res.sendFile(__dirname +'/views/'+req.params.id+req.params.end);
	});


	//POST

	//GET

	//



//END URLS

// Server main listener
app.listen(config.port, function (){
	console.log('NodeJS server listening at localhost:'+config.port);
});
