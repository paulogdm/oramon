var tables = [];

tables.push({name: "LE01", fk_flag : true, fk_array : ["LE02", "LE03"] } );
tables.push({name: "LE02", fk_flag : true, fk_array : ["LE03"] } );
tables.push({name: "LE03", fk_flag : true, fk_array : ["LE05"] } );
tables.push({name: "LE04", fk_flag : false, fk_array : []});
tables.push({name: "LE05", fk_flag : false, fk_array : []});

table_names = [];

for (table in tables){
	table_names.push(tables[table].name);
}

var vtables = new Vue({
	el: "#list-tables",
	data: {
		tables: tables,
		table_checked: table_names,
		emb_checked: []
	}
});

