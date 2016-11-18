// MODULES VARIABLES
var express = require('express');
var app = express();
var config = require('./config');
var bodyParser = require('body-parser');


// Static url routing for libs
app.use('/vue', express.static(__dirname + '/node_modules/vue/dist/'));
app.use('/superagent', express.static(__dirname + '/node_modules/superagent/'));
app.use('/milligram', express.static(__dirname + '/node_modules/milligram/dist/'));
app.use('/normalize', express.static(__dirname + '/node_modules/normalize.css/'));

app.set('view engine', 'html');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded());

//loading routes
require('./routes')(app);


// Server main listener
app.listen(config.port, function (){
	console.log('NodeJS server listening at localhost:'+config.port);
});
