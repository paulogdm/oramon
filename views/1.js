new Vue({
	//element of HTML, or id, to attach this
	el: "#list-tables",

	//data of vue 'class'
	data: {
		debug_mode: false, //flag to debug (show array and Vue data bindings)
		tables: [], //array of tables
		loading : true //flag to show loading bar
	},

	// when the vue object is created, then run this.
	created: function(){
		this.fetchTables();
	},

	methods : {
		fetchTables : function(){
			
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open( "GET", '/get/tables', false ); // false for synchronous request
			xmlHttp.send( null );
			this.tables = JSON.parse(xmlHttp.responseText);

			for(idx in this.tables){
				this.tables[idx].checked = true;

				if(this.tables[idx].fk_flag){
					this.tables[idx].fk_array.unshift(" ");
					this.tables[idx].fk_selected = " ";
				}
			}

			this.loading = false;
		},

		submit : function(){
			this.loading = true;
			
			var to_send = [];
			
			for(idx in this.tables){
				
				obj = this.tables[idx];

				if(obj.checked){
					to_send.push({name: obj.name, emb: null});
					if(obj.fk_selected && obj.fk_selected != " "){
						to_send[to_send.length - 1].emb = obj.fk_selected;
					}
				}
			}


			this.$http.post('/post/tomongo', to_send).then((res) => {

			  res.status;

			}, (res) => {
			  // error callback
			});
		}
	}
});
