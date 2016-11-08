var tables = [];

tables.push({name: "LE01", fk_flag : true, fk_array : ["LE02", "LE03"] } );
tables.push({name: "LE02", fk_flag : true, fk_array : ["LE03"] } );
tables.push({name: "LE03", fk_flag : true, fk_array : ["LE05"] } );
tables.push({name: "LE04", fk_flag : false, fk_array : []});
tables.push({name: "LE05", fk_flag : false, fk_array : []});

table_names = [];


var vtables = new Vue({
	//element of HTML, or id, to attach this 
	el: "#list-tables",

	//data of vue 'class'
	data: {
		tables: tables, //array of tables
		table_checked: [], //array of select checkbox
		emb_checked: [] //array of select checkbox
	},

	// when the js is loaded, then run this.
	ready: function() {

		for (table in this.tables){
			this.table_checked.push(this.tables[table].name);
		}
	}
});

//tables and infos
/*
	EXAMPLE:
	table : {
		name: "LE01ALGO",
		fk_flag: true, 						//foreign key constraint?
		fk_array: ["LE02AAA", "LE04BBBB"]	//wich tables?
	}
*/
