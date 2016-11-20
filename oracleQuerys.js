module.exports = {
	getTables : "SELECT table_name name FROM user_tables where table_name like 'LE%'",
	getTablesFK : "SELECT \
				    CONS.TABLE_NAME NAME, \
				    CONS_R.TABLE_NAME FK_TABLE, \
				    CONS.CONSTRAINT_NAME, \
				    COLS.COLUMN_NAME COL, \
				    CONS.R_CONSTRAINT_NAME, \
				    COLS_R.COLUMN_NAME FK_COL \
				    \
					FROM USER_CONSTRAINTS CONS \
				    LEFT JOIN USER_CONS_COLUMNS COLS ON COLS.CONSTRAINT_NAME = CONS.CONSTRAINT_NAME \
				    LEFT JOIN USER_CONSTRAINTS CONS_R ON CONS_R.CONSTRAINT_NAME = CONS.R_CONSTRAINT_NAME \
				    LEFT JOIN USER_CONS_COLUMNS COLS_R ON COLS_R.CONSTRAINT_NAME = CONS.R_CONSTRAINT_NAME \
				    \
					WHERE CONS.CONSTRAINT_TYPE = 'R' AND CONS.TABLE_NAME LIKE 'LE%' \
					\
					ORDER BY CONS.TABLE_NAME, COLS.COLUMN_NAME",

	getTablePK : function(tbname){
					var query = "SELECT column_name PK FROM all_cons_columns WHERE constraint_name = (\
						SELECT constraint_name FROM user_constraints \
						WHERE UPPER(table_name) = UPPER('"+tbname.trim().toUpperCase()+"') AND CONSTRAINT_TYPE = 'P')";

					return query;
	},
	
	getTable : function(tbname){
		var query = "SELECT * FROM " + tbname.trim().toUpperCase();

		return query;
	},

	getTableFK : function(tbname){
		return ("SELECT \
		CONS.TABLE_NAME NAME, \
		COLS.COLUMN_NAME COL, \
		CONS_R.TABLE_NAME FK_TABLE, \
		COLS_R.COLUMN_NAME FK_COL \
		\
		FROM USER_CONSTRAINTS CONS \
		LEFT JOIN USER_CONS_COLUMNS COLS ON COLS.CONSTRAINT_NAME = CONS.CONSTRAINT_NAME \
		LEFT JOIN USER_CONSTRAINTS CONS_R ON CONS_R.CONSTRAINT_NAME = CONS.R_CONSTRAINT_NAME \
		LEFT JOIN USER_CONS_COLUMNS COLS_R ON COLS_R.CONSTRAINT_NAME = CONS.R_CONSTRAINT_NAME \
		\
		WHERE CONS.CONSTRAINT_TYPE = 'R' AND CONS.TABLE_NAME = '"+tbname+"'");

	},

	getTableJoin : function(tbmain, tbjoin, params){
		// this.getTable(tbmain) + " LEFT JOIN ON " + params.first + " = " params.second; 
	},

	getTablePkSk : function(tbname){
		return("SELECT cols.column_name\
		FROM all_constraints cons, all_cons_columns cols\
		WHERE cols.table_name = '"+tbname+"'\
		AND (cons.constraint_type = 'P' OR cons.constraint_type = 'U')\
		AND cons.constraint_name = cols.constraint_name\
		AND cons.owner = cols.owner\
		ORDER BY cols.table_name, cols.position;");
	}
}
