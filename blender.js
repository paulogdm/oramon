

var _ = require('underscore-node'); //very useful library for large datasets

module.exports = {
	tableToMongo : function(req, cb){
		var tables = req.body;

		_.each(tables, function(table){
			_.after(2, module.exports.buildMongoDoc);

		});

		cb(null, {});
	},

	buildMongoDoc : function(table_data, table_pk){
		
	}
}
