var tables = [];

tables.push({name: "LE01", fk_flag : true, fk_array : ["LE02", "LE03"] } );
tables.push({name: "LE02", fk_flag : true, fk_array : ["LE03"] } );
tables.push({name: "LE03", fk_flag : true, fk_array : ["LE05"] } );
tables.push({name: "LE04", fk_flag : false, fk_array : []});
tables.push({name: "LE05", fk_flag : false, fk_array : []});

var vtables = new Vue({
	el: "#list-tables",
	data: {tables: tables}
});

