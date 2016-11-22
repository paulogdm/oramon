// External libs
var oracledb = require('oracledb'); // Oracle driver
var _ = require('underscore-node'); // SYNC lib, very useful to iterate with large datasets in order 
var async = require('async'); 		// ASYNC lib, clean lib to improve speedup


// My libs
var config = require('./config').oracle;
var oracleqrs = require('./oracleQuerys');	

/* Private Function
	Description: Close the connection "conn"
*/
var finish = function(conn){
	conn.release(function(err){
		//if error flag is set.
		if(err)
			console.info("[oracleLayer.js] Failed to release!" + error);
	});
}

module.exports = {


	//Functions to handle OracleDB
	getTables : function(data, cb){
		
		var to_send = [];

		oracledb.getConnection(config, function(err, conn){

			if(err){
				console.info('[oracleLayer.js] Error connecting to OracleDB')
				console.info(err);

				cb({err: 'Error connecting to OracleDB.'}, null);

			} else {

				var finished = _.after(2, done);

				var call_error = _.once(function(){
					cb({err: 'Query error'}, null);
				});

				function done(){
					module.exports.processGetTables(rows1, rows2, cb);
					finish(conn);
				}

				conn.execute(oracleqrs.getTables, {}, {}, function(err, result){

					if(err){
						console.info('[oracleLayer.js] Query error!' + err);
						call_error();
					} else {
						rows1 = result.rows;
						finished();
					}
				});

				conn.execute(oracleqrs.getTablesFK, {}, {}, function(err, result){
					if(err){
						console.info('[oracleLayer.js] Query error!' + err);
						call_error();
					} else {
						rows2 = result.rows;
						finished();
					}
				});
			}
		})
	},

	processGetTables : function(firstrows, secondrows, cb){

		var count = 0;
		var idx_obj = {}

		var to_send = _.map(firstrows, function(row){
			idx_obj[row[0]] = count++;
			return { name: row[0], fk_flag: false, fk_array: []};
		});

		async.each(secondrows, function(row, rowCallback) {
			var idx = idx_obj[row[0]];

			if(to_send[idx].fk_array.indexOf(row[1]) == -1){
				to_send[idx].fk_array.push(row[1]);
				to_send[idx].fk_flag = true;
			}

			rowCallback();

		}, function(err){
			if(err){
				console.info('[oracleLayer] Async processing error.');
				cb(err, null);
			} else {
				cb(null, to_send);
			}
		});
	},

	getTable : function(tbname, cb){
		var to_send = [];

		oracledb.getConnection(config, function(err, conn){
			if(err){
				console.info('[oracleLayer.js] Error connecting to OracleDB')
				console.info(err);

				cb({err: 'Error connecting to OracleDB.'}, null);

			} else {
				conn.execute(oracleqrs.getTable(tbname), {}, {}, function(err, result){
					if(err){
						console.info('[oracleLayer.js] Query error!' + err);
						cb({err: 'Query error'}, null);
					} else {
						cb(null, result);
					}

					finish(conn);
				});
			}
		})
	},

	getTablePK : function(tbname, cb){
		var to_send = [];

		oracledb.getConnection(config, function(err, conn){
			if(err){
				console.info('[oracleLayer.js] Error connecting to OracleDB')
				console.info(err);

				cb({err: 'Error connecting to OracleDB.'}, null);

			} else {
				conn.execute(oracleqrs.getTablePK(tbname), {}, {}, function(err, result){
					if(err){
						console.info('[oracleLayer.js] Query error!' + err);
						
						cb({err: 'Query error'}, null);

					} else {
						cb(null, result);
					}

					finish(conn);
				});
			}
		})
	},

	getTableFK : function(tbname, cb){
		var to_send = [];

		oracledb.getConnection(config, function(err, conn){
			if(err){
				console.info('[oracleLayer.js] Error connecting to OracleDB')
				console.info(err);

				cb({err: 'Error connecting to OracleDB.'}, null);

			} else {
				conn.execute(oracleqrs.getTableFK(tbname), {}, {}, function(err, result){
					if(err){
						console.info('[oracleLayer.js] Query error!' + err);
						
						cb({err: 'Query error'}, null);

					} else {
						cb(null, result);
					}

					finish(conn);
				});
			}
		})
	},

	getTableJoin : function(data, cb){

	},

	getTableSk : function(tbname, cb){
		var to_send = [];

		oracledb.getConnection(config, function(err, conn){
			if(err){
				console.info('[oracleLayer.js] Error connecting to OracleDB')
				console.info(err);

				cb({err: 'Error connecting to OracleDB.'}, null);

			} else {
				conn.execute(oracleqrs.getTableSk(tbname), {}, {}, function(err, result){
					if(err){
						console.info('[oracleLayer.js] Query error!' + err);
						
						cb({err: 'Query error'}, null);

					} else {
						cb(null, result);
					}

					finish(conn);
				});
			}
		})
	}

};
