// MODULES VARIABLES
var express = require('express');
var app = express();
var config = require('./config').config;

require('./routes')(app);

// Static url routing for libs
app.use('/vue', express.static(__dirname + '/node_modules/vue/dist/'));
app.use('/vueres', express.static(__dirname + '/node_modules/vue-resource/dist/'));
app.use('/mdl', express.static(__dirname + '/views/'));
app.use('/mdlscript', express.static(__dirname + '/node_modules/material-design-lite/'));

app.set('view engine', 'html');

// URLS FOR PAGES
	
	// Main page

//END URLS

// Server main listener
app.listen(config.port, function (){
	console.log('NodeJS server listening at localhost:'+config.port);
});
