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

		tables.sort(function(a,b){return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} );

		var chunkDone = _.after(tables.length, send);
		
		function send(){
			cb(null, result);
		}

		_.each(tables, function(table){
			result.push(DB_PREFIX + '.createCollection("'+table.name+'")');

			var dataTable = null;
			var dataTablePK = null;
			var dataTableFK = null;

			var queryDone = _.after(3, pipeline);

			function pipeline(){
				module.exports.preProcessor(dataTable, function(objectTable){
					module.exports.linkProcessor(objectTable, dataTableFK, function(objectTable){
						module.exports.pkProcessor(objectTable, dataTablePK, function(objectTable){
							module.exports.postProcessor(objectTable, function(final){
								_.each(final, function(array){
									result.push(DB_PREFIX +'.'+table.name +'.insert('+ stringify(array) + ')');
								});
								resul.push('');
								chunkDone();
							});
						});
					});
				});

			}

			orcl.getTable(table.name, function(err, result){
				dataTable = result;
				queryDone();
			});

			orcl.getTablePK(table.name, function(err, result){
				dataTablePK = result;
				queryDone();
			});


			orcl.getTableFK(table.name, function(err, result){
				dataTableFK = result;
				queryDone();
			});

		});

	},

	preProcessor : function(table_data, cb){
		
		var result = [];
		var col_names = _.pluck(table_data.metaData, 'name'); 

		async.each(table_data.rows, function(row, rowCallback){

			var obj = _.object(col_names, row);
			
			result.push(obj);

			rowCallback();

		}, function(err){
			cb(result);
		});
	},

	linkProcessor : function(table_obj, table_fk, cb){

		var link_names = {};
		/*
		INPUT
		[ [ 'LE04BAIRRO', 'NOMECIDADE', 'LE02CIDADE', 'NOME' ],
		  [ 'LE04BAIRRO', 'NOMECIDADE', 'LE02CIDADE', 'SIGLAESTADO' ],
		  [ 'LE04BAIRRO', 'NROZONA', 'LE03ZONA', 'NROZONA' ],
		  [ 'LE04BAIRRO', 'SIGLAESTADO', 'LE02CIDADE', 'SIGLAESTADO' ],
		  [ 'LE04BAIRRO', 'SIGLAESTADO', 'LE02CIDADE', 'NOME' ] ],
		*/

		_.each(table_fk.rows, function(row){
			
			var key = row[2] + '_id';
			var value = row[1];

			if(link_names[key] && link_names[key].indexOf(value) == -1){
				link_names[key].push(value);
			} else {
				link_names[key] = []
				link_names[key].push(value);
			}
		});

		/*
		OUTPUT
		{ 	LE02CIDADE_id: [NOMECIDADE, SIGLAESTADO], 	//composite foreign key
			LE03ZONA_id : [NROZONA]						//single foreign key
		}
		*/

		async.each(table_obj, function(obj, rowCallback){
			_.each(link_names, function(value, key){
				if(value.length > 1){
					
					obj[key] = {};

					_.each(value, function(fk_col){
						obj[key][fk_col] = obj[fk_col];
						delete obj[fk_col];
					});
				} else {
					obj[key] = obj[value[0]];
					delete obj[value[0]];
				}
			})
			rowCallback();

		}, function(err){
			cb(table_obj);
		});


	},
	
	pkProcessor : function(table_obj, table_pk, cb){

		var pk_names = _.flatten(table_pk.rows);

		async.each(table_obj, function(obj, rowCallback){

			if(pk_names.length > 1){

				obj._id = {};

				_.each(pk_names, function(name){
					obj._id[name] = obj[name];
					delete obj[name];
				});

			} else {
				obj._id = obj[pk_names[0]];
				delete obj[pk_names[0]];
			}

			rowCallback();

		}, function(err){
			cb(table_obj);
		});

	}, 

	postProcessor : function(table_obj, cb){

		async.each(table_obj, function(row, cb1){
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
			cb(table_obj);
		});
	}	
}
