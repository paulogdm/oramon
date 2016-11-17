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

	computed: {
		allSelected : function(){
			for(idx in this.tables){
				if(this.tables[idx].checked == false){
					return false;
				}
			}

			return true;
		},
	},

	methods : {

			selectAll: function (task) {
				var targetValue = this.allSelected ? false : true;
				for (var i = 0; i < this.tables.length; i++) {
					this.tables[i].checked = targetValue;
				}
		},

		check : function(table){
			table.checked = true;
		},

		isChecked : function(table){
			return table.checked;
		},

		fetchTables : function(){
			
			this.$http.get('/get/tables').then((res) => {


				for(idx in res.data){
					res.data[idx].checked = false;

					if(res.data[idx].fk_flag){
						res.data[idx].fk_array.unshift(" ");
						res.data[idx].fk_selected = " ";
					}

					this.tables.push(res.data[idx]);
				}


			}, (res) => {
			  // error callback
			});



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
