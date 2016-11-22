//External libs
var mongodb = require('mongodb');
var_

//My libs
var config = require('./config').mongo;

var createConn = _.once(function(){
	mongodb.MongoClient.connect(config.url, function(err, db) {
		assert.equal(null, err);
		console.log("Connected successfully to server");

		db.close();
	});

})

module.exports = {
	//Functions to handle mongoDB
	
	getCollectionAndFields : function(req, cb){
		createConn();

	    //collections = [{"name": "coll1"}, {"name": "coll2"}]
	    db.listCollections().toArray(function(err, collections){
	    	var coll = _.pluck(collections, 'name'){
	    		_.each(coll, function(name){
	    			mr = db.runCommand({"mapreduce" : name, "map" : function() {  
	    					for (var key in this) { emit(key, null); }  
	    				},
	    				"reduce" : function(key, stuff) { return null; },  
	    				"out": name + "_keys"  
	    			})
	    			var result = db[mr.result].distinct("_id");
	    			console.info(result)
	    		});
	    	}
	    });
	}
};
