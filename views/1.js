new Vue({
	//element of HTML, or id, to attach this
	el: "#list-tables",

	//data of vue 'class'
	data: {
		tables: [], //array of tables
		global_loading : true, //flag to show loading bar and disable submit button
		submit_loading : false, //flag to show loading bar and disable submit button
		error : false,
		snackbar_msg : "",
		received_msg : ""
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

		showSnackbar : function(msg){
			return(this.snackbar_msg.length > 0);
		},

		showTxt : function(){
			return(this.received_msg != '')
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

		setSnackbar : function(msg){
			var self = this;
			self.$set(self, 'snackbar_msg', msg);
			setTimeout(function(){ self.$set(self, 'snackbar_msg', ''); }, 3000);
		},

		fetchTables : function(){
			this.global_loading = true;
			
			superagent.get('/get/tables').then((res) => {
				for(idx in res.body){
					res.body[idx].checked = false;

					if(res.body[idx].fk_flag){
						res.body[idx].fk_array.unshift(" ");
						res.body[idx].fk_selected = " ";
					}

					this.tables.push(res.body[idx]);
				}

				this.global_loading = false;

			}, (res) => {
				this.global_loading = false;
			  	this.error = true;

			  	this.setSnackbar(res.body.err);
			});

		},

		close : function(){
			this.$set(this, 'received_msg', '');
		},

		submit : function(){

			this.submit_loading = true;
			
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

			if(to_send.length == 0){
				this.submit_loading = false;
				this.setSnackbar("Nothing Selected...");
			} else {
				
				superagent.post('/post/tomongo')
				.send(to_send)
				.then((res) => {
					this.submit_loading = false;
					this.$set(this, 'received_msg', res.body.join('\n'));
				}, (res) => {
					this.submit_loading = false;
				});
			}
		}
	}
});
