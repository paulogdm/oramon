// External libs
var _ = require('underscore-node'); // SYNC lib, very useful to iterate with large datasets in order 
var async = require('async'); 		// ASYNC lib, clean lib to improve speedup
var stringify = require('json-stable-stringify'); // Stringfy JSON

// My libs
var orcl = require('./oracleLayer'); // Oracle queries

/**
 * Module description: This module links Oracle and MongoDB functions.
 * Roles: 	* Process incoming request
 * 			* Call Oracle query and compute it.
 * 			* Response with MongoDB strings.
 */

module.exports = {
	/**
	 * Converts an Oracle Table to a MongoDoc.
	 * @param  {request by Express}   	req
	 * @param  {callback by Express} 	cb
	 */
	tableToMongo : function(req, cb){

		//initial declare
		var tables = req.body; //request body
		var result = []; //array of strings result

		//Sort request body (first come first served)
		tables.sort(function(a,b){return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} );

		//AFTER N CALLs (1st param), execute function (2nd param)
		var chunkDone = _.after(tables.length, send);
		
		//function to send the results;
		function send(){
			cb(null, result);
		}

		//processing each table in serial order
		_.each(tables, function(table){
			
			//first string must be the createCollection of the doc
			result.push('db.createCollection("'+table.name+'")');
			console.info(table);

			if(table.emb.trim()){
				module.exports.pipelineEmb(table, function(err, data){
					result = result.concat(data);
					chunkDone();					
				});				
			} else {
				module.exports.pipeline(table, function(err, data){
					result = result.concat(data);
					chunkDone();
				});
			}
		});

	},

	pipelineEmb : function(table, cb){
		var result = [];
		var dataTableFK = null;

		var queryDone = _.after(1, pipeline);

		//pipeline of table processing...
		// PREPROCESSOR => PKPROCESSOR => LINKPROCESSOR => POSTPROCESSOR
		// PREPROCESSOR: Conver rows and metadata retrieved from Oracle into Obj[key] = value type;
		// PKPROCESSOR: Attach values to _id.
		// LINKPROCESSOR: Deal with embedding and linking.
		// POSTPROCESSOR: Removing null and other fields.
		function pipeline(){
			
		}

		orcl.getTableFK2(table.name, table.emb, function(err, result){
			dataTableFK = result;
			console.info(result);
			queryDone();
		});

		// orcl.getTableJoin(table.name, function(err, result){
		// 	dataTable = result;
		// 	queryDone();
		// });
	},

	pipeline : function(table, cb){
		var result = [];

		//vars returned by Oracle
		var dataTable = null;
		var dataTablePK = null;
		var dataTableFK = null;

		//AFTER N CALLs (1st param), execute function (2nd param)
		var queryDone = _.after(3, pipeline);

		
		//pipeline of table processing...
		// PREPROCESSOR => PKPROCESSOR => LINKPROCESSOR => POSTPROCESSOR
		// PREPROCESSOR: Conver rows and metadata retrieved from Oracle into Obj[key] = value type;
		// PKPROCESSOR: Attach values to _id.
		// LINKPROCESSOR: Deal with embedding and linking.
		// POSTPROCESSOR: Removing null and other fields.
		function pipeline(){
			module.exports.preProcessor(dataTable, function(objectTable){
				module.exports.pkProcessor(objectTable, dataTablePK, function(objectTable){
					module.exports.linkProcessor(objectTable, dataTablePK, dataTableFK, function(objectTable){
						module.exports.postProcessor(objectTable, function(final){
							_.each(final, function(array){
								result.push('db.'+table.name +'.insert('+ stringify(array) + ')');
							});

							result.push('');
							cb(null, result);
						});
					});
				});
			});

		}

		//Get all table rows (with join if needed)
		orcl.getTable(table.name, function(err, result){
			dataTable = result;
			queryDone();
		});

		//Get all table PK names
		orcl.getTablePK(table.name, function(err, result){
			dataTablePK = result;
			queryDone();
		});


		//Get all table FK names
		orcl.getTableFK(table.name, function(err, result){
			dataTableFK = result;
			queryDone();
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

	linkProcessor : function(table_obj, table_pk, table_fk, cb){

		var link_names = {};
		var pk_names = _.flatten(table_pk.rows);
		
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

			//if processed by PKPROCESSOR, skip
			if(pk_names.indexOf(value) == -1){	
				if(link_names[key] && link_names[key].indexOf(value) == -1){
					link_names[key].push(value);
				} else {
					link_names[key] = []
					link_names[key].push(value);
				}
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
	
	/**
	 * Functoin that specifies and process the _id of mongodb.
	 * @param  {array of obj}   	table_obj => array of row in object notation
	 * @param  {array of strings}   table_pk  => names of PK columns
	 * @param  {callback(result)} 	cb        => callback to return the result
	 */
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

	/**
	 * After all rows have been processed, you can evaluete the js obj here
	 * @param  {array of obj}   	table_obj => array of row in object notation
	 * @param  {callback(result)} 	cb        => callback to return the result
	 */
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
	},

	mongoIndex : function(req, cb){

		var result = [];
		var tables = req.body;

		async.each(tables, function(table, callback){

			var string = 'db.' + table.name + '.createIndex(';
			var obj = {_id: 1};

			orcl.getTableSk(table.name, function(err, queryresult){
				if(err){
					callback(err);
				} else {
					var temp = _.compact(_.flatten(queryresult.rows));

					//LODASH.js here?
					_.each(temp, function(str){
						obj[str] = 1;
					});

					string = string + stringify(obj) + ')'

					result.push(string);

					callback();
				}
			});

		}, function(err){
			result.sort();
			cb(err, result);
		});
	},

	mongoFind : function(req, cb){

	}
}
