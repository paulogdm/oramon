var config = require('./config').oracle;
var oracledb = require('oracledb');
var oracleqrs = require('./oracleQuerys');	

var _ = require('underscore-node'); //very useful library for large datasets

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
				conn.execute(oracleqrs.getTables, {}, {}, function(err, result){

					if(err){
						console.info('[oracleLayer.js] Query error!' + err);

						cb({err: 'Query error'}, null);
					} else {

						var count = 0;
						var idx_obj = {}

						var to_send = _.map(result.rows, function(row){
							idx_obj[row[0]] = count++;
							return { name: row[0], fk_flag: false, fk_array: []};
						});

						conn.execute(oracleqrs.getTablesAux, {}, {}, function(err, result){
							if(err){
								console.info('[oracleLayer.js] Query error!' + err);
								cb({err: 'Query error'}, null);
							} else {
								
								_.each(result.rows, function(row){
									var idx = idx_obj[row[0]];
									if(to_send[idx].fk_array.indexOf(row[1]) == -1){
										to_send[idx].fk_array.push(row[1]);
										to_send[idx].fk_flag = true;
									}
								});


								cb(null, to_send);
							}

							conn.release(function(error){
								console.info("[oracleLayer.js] Failed to release!" + error);
							});
						});
					}
				});
			}
		})
	},

	getTable : function(data, cb){
		var to_send = [];

		oracledb.getConnection(config, function(err, conn){
			if(err){
				console.info('[oracleLayer.js] Error connecting to OracleDB')
				console.info(err);

				cb({err: 'Error connecting to OracleDB.'}, null);

			} else {
				conn.execute(oracleqrs.getTable, {}, {}, function(err, result){
					if(err){
						console.info('[oracleLayer.js] Query error!' + err);
						

						cb({err: 'Query error'}, null);

					} else {
					}

					conn.release(function(error){
						console.info("[oracleLayer.js] Failed to release!" + error);
					});
				});
			}
		})
	},

	getTablePK : function(data, cb){
		var to_send = [];

		oracledb.getConnection(config, function(err, conn){
			if(err){
				console.info('[oracleLayer.js] Error connecting to OracleDB')
				console.info(err);

				cb({err: 'Error connecting to OracleDB.'}, null);

			} else {
				conn.execute(oracleqrs.getTablePK, {}, {}, function(err, result){
					if(err){
						console.info('[oracleLayer.js] Query error!' + err);
						
						cb({err: 'Query error'}, null);

					} else {
					}

					conn.release(function(error){
						console.info("[oracleLayer.js] Failed to release!" + error);
					});
				});
			}
		})
	},

	getTableJoin : function(data, cb){

	}
};
