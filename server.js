var express = require('express');
var app = express();
var config = require('./config').config;


app.use('/scripts', express.static(__dirname + '/node_modules/vue/dist/'));
app.set('view engine', 'html');

app.get('/', function (req, res) {
	res.sendFile('views/main.html');
})

app.listen(config.port, function (){
	console.log('NodeJS server listening at localhost:'+config.port);
});

