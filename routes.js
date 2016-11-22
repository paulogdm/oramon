var orcl = require('./oracleLayer');
var blender = require('./blender');

module.exports = function(app){

	app.get('/', function(req, res){
		res.redirect('/main.html')
	});

	// Main files (send html, css and js upon request)
	app.get('/main:end(.css|.html|.js)', function(req, res){
		res.sendFile(__dirname+'/views/main' + req.params.end);
	});

	// Items
	// html + js + css
	app.get('/item/:id(1|2|3|4):end(.css|.html|.js)', function (req, res) {
		res.sendFile(__dirname +'/views/'+req.params.id+req.params.end);
	});
	
	// Return Array of Objects
	// Example of obj: {name: "LE01", fk_flag : true, fk_array : ["LE02", "LE03"] }
	app.get('/get/tables', function(req, res){
		orcl.getTables(req, function(err, data){	
			if(err){
				res.status(500).json(err);
			} else {
				res.status(200).json(data);
			}
		});
	});

	// Require Array of Objects (available trough req.body)
	// Example of obj: {name: "LE01", fk_flag : true, fk_array : ["LE02", "LE03"] }
	app.post('/post/tomongo', function(req, res){
		blender.tableToMongo(req, function(err, data){
			if(err){
				res.status(500).json(err);
			} else {
				res.status(200).json(data);
			}
		});
	});

	// Require Array of Objects (available trough req.body)
	// Example of obj: {name: "LE01"}
	app.post('/post/mongoindex', function(req, res){
		blender.mongoIndex(req, function(err, data){
			if(err){
				res.status(500).json(err);
			} else {
				res.status(200).json(data);
			}
		});
	});

	// Require string (available trough req.body)
	// Example: ""
	app.post('/post/mongoquery', function(req, res){
		blender.mongoQuery(req, function(err, data){
			if(err){
				res.status(500).json(err);
			} else {
				res.status(200).json(data);
			}
		});
	});
}
