// External libs
var _ = require('underscore-node'); // SYNC lib, very useful to iterate with large datasets in order 
var async = require('async'); 		// ASYNC lib, clean lib to improve speedup
var stringify = require('json-stable-stringify'); // Stringfy JSON

// My libs
var orcl = require('./oracleLayer');


var DB_PREFIX = 'db';


module.exports = {
	tableToMongo : function(req, cb){
		var tables = req.body;
		var result = [];

		_.each(tables, function(table){
			result.push(DB_PREFIX + '.createCollection("'+table.name+'")');

			var finished = _.after(2, done);
			var dataTable = null;
			var dataTablePK = null;

			function done(){
				module.exports.bsonProcessor(dataTable, dataTablePK, function(objs){
					module.exports.postProcessor(objs, function(final){
						_.each(final, function(array){
							result.push(DB_PREFIX +'.'+table.name +'.insert('+ stringify(array) + ')');
						});
					});
				});

				console.info(result);
			}

			orcl.getTable(table.name, function(err, result){
				dataTable = result;
				finished();
			});

			orcl.getTablePK(table.name, function(err, result){
				dataTablePK = result;
				finished();
			});
		});

		cb(null, {});
	},

	/*
		db.LE01Estado.insert({_id: "SP", nome:"Sao Paulo"})
		db.LE01Estado.insert({_id: "RJ", nome:"Rio de Janeiro"})
	*/
	
	bsonProcessor : function(table_data, table_pk, cb){

		var pk_idx = [];
		var result = [];

		var pk_names = _.flatten(table_pk.rows);
		var col_names = _.pluck(table_data.metaData, 'name');

		async.each(table_data.rows, function(row, rowCallback){

			var obj = _.object(col_names, row);

			if(pk_idx.length > 1){

				obj._id = {};

				_.each(pk_names, function(name){
					obj._id[name] = obj[name];
					delete obj[name];
				});

			} else {
				obj._id = obj[pk_names[0]];
				delete obj[pk_names[0]];
			}

			result.push(obj);

			rowCallback();

		}, function(err){
			cb(result);
		});

	}, 

	postProcessor : function(rows, cb){

		async.each(rows, function(row, cb1){
			async.eachOf(row, function(value, key, cb2){
				if(value == null){ //true if null or undefined

				} else if(typeof value === 'string') {
					row[key].trim();
				}

				cb2();

			}, function(err){
				cb1();
			});

		}, function(err){
			cb(rows);
		});
	}	
}
