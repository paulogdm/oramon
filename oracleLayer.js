var config = require('./config').oracle;
var oracledb = require('oracledb');
var oracleqrs = require('./oracleQuerys')

module.exports = {
	//Functions to handle OracleDB

	getTables : function(req, cb){
		oracledb.getConnection(config, function(err, conn){
			console.info(config);
			if(err){
				console.info('[oracleLayer.js] Error connecting to OracleDB')
				console.info(err);
				cb({err: 'Error connecting to OracleDB'}, null);
			} else {
				conn.execute(oracleqrs.getTables, {}, {}, function(err, result){
					if(err){
						console.info('[oracleLayer.js] Query error!' + err);
						cb({err: 'Query error'}, null);
					} else {
						console.info("test"+result);
						cb(null, result);
					}
				});
			}
		})
	}
};
