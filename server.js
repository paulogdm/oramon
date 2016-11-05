var express = require('express');
var app = express();
var config = require('./config').config;


app.use('/vuescript', express.static(__dirname + '/node_modules/vue/dist/'));
app.use('/mdlscript', express.static(__dirname + '/node_modules/material-design-lite/'));
app.set('view engine', 'html');


app.get('/', function (req, res) {
	res.sendFile(__dirname +'/views/main.html');
})

app.get('/main.js', function (req, res) {
	res.sendFile(__dirname +'/views/main.js');
})

app.get('/main.css', function (req, res) {
	res.sendFile(__dirname +'/views/main.css');
})

app.listen(config.port, function (){
	console.log('NodeJS server listening at localhost:'+config.port);
});

