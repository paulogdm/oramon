var orcl = require('oracle');

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

	app.get('/get/tables', function(req, res){
		var tables = [];

		tables.push({name: "LE01", fk_flag : true, fk_array : ["LE02", "LE03"] } );
		tables.push({name: "LE02", fk_flag : true, fk_array : ["LE03"] } );
		tables.push({name: "LE03", fk_flag : true, fk_array : ["LE05"] } );
		tables.push({name: "LE04", fk_flag : false, fk_array : []});
		tables.push({name: "LE05", fk_flag : false, fk_array : []});

		res.status(200).json(tables);
	});
}
