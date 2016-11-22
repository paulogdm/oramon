// demo data
var data = {
	root: true,
	children: [
	]
}

var tables = {
	" ": [],
	"LE01" : ["_id", "test1"],
	"LE02" : ["_id", "test2"],
	"LE03" : ["_id", "test3"],
	"LE04" : ["_id", "test4"]
}

// define the item component
Vue.component('item', {
	template: '#item-template',
	props: {
		model: Object,
		tables : Object, 
		table_selected: '',
	},
	data: function(){
		return {
			and: false,
			operands: [" ", "=", ">", ">=", "<", "<=", "!=", "has", "!has"],
			operand_selected: '',
			field_selected : '',
			field_value : ''
		}
	},

	computed: {
		isGroup: function(){
			return this.model.children;
		},
		
		isRoot: function(){
			return this.model.root;
		}
	},
	methods: {
		toggleAndOr: function(){
			Vue.set(this, 'and', !this.and);
		},

		clear: function(){
			Vue.set(this.model, 'children', []);
		},

		addGroup: function(){
			this.model.children.push({parent: this});
			Vue.set(this.model.children[this.model.children.length - 1], 'children', []);
		},

		addRule: function(){
			this.model.children.push({name: 'aaaa', parent: this});
		},

		suicideGroup: function(){
			this.model.parent.delChild(this.model);
		},

		suicideRule: function(){
			this.model.parent.delChild(this.model);
		},

		delChild: function(obj){
			for(idx in this.model.children){
				if(this.model.children[idx] === obj){
					this.model.children.splice(idx, 1);
				}
			}
		}
	}
})

// boot up the demo
var demo = new Vue({
	el: '#main',
	data: {
		treeData: data,
		tables: tables,
		table_selected: '',
		loading: false,
		snackbar_msg : "",
		question: '',
		answer: ''
	},
	computed: {

		showSnackbar : function(msg){
			return(this.snackbar_msg.length > 0);
		},

		showTxt : function(){
			return(this.answer != '')
		},

		selectedTableFields: function(){
			if(this.table_selected)
				return this.tables[this.table_selected];
			else return [];
		}
	},

	methods : {

		setSnackbar : function(msg){
			var self = this;
			self.$set(self, 'snackbar_msg', msg);
			setTimeout(function(){ self.$set(self, 'snackbar_msg', ''); }, 3000);
		},

		submit : function(){

			this.loading = true;

			superagent.post(POST_DATA_URL)
			.send(this.question)
			.then((res) => {
				this.$set(this, 'answer', res.body.join('\n'));
				this.loading = false;
			}, (res) => {
				setSnackbar('['+res.status + ']: Error received from server')
				this.loading = false;
			});

		}
	}
})
