// import Vue from 'vue';
// import ace from 'ace-editor';
import resize from 'vue-resize-directive';

let template = `
<div
	class="vega-lite-editor-container"
	v-resize="onResize"
	style="border: 1px solid rgba(34,36,38,.15); border-radius: .28571429rem;"
>
	<div ref="vegaliteEditor" class="vega-lite-editor" style="height: 400px;"></div>
</div>
`;

Vue.component('vega-lite-editor', {
	template: template,
	directives: {
		resize
	},
	props: {
		value: {
			type: String,
			required: true
		},
		attributes: Array
	},
	data: function() {
		return {
			otherContainerStyles: {
				position: 'fixed',
				width: '5px',
				zIndex: 100,
				display: 'flex',
				alignItems: 'center'
			},
			otherButtonStyles: {
				padding: '20px 1px',
				borderTopLeftRadius: '0px',
				borderBottomLeftRadius: '0px',
				borderTopRightRadius: '10px',
				borderBottomRightRadius: '10px'
			},
			displayStyle: {
				display: 'none'
			}
		};
	},
	computed: {

	},
	methods: {
		insertAtCursor: function(text) {
			this.editor.session.insert(this.editor.getCursorPosition(), text);
		},
		onResize: function(el) {
			this.editor.resize();
		}
	},
	mounted: function() {
		let vm = this;
		let langTools = ace.require('ace/ext/language_tools');
		let editor = ace.edit(this.$refs['vegaliteEditor']);
		this.editor = editor;
		editor.setTheme('ace/theme/chrome');
		editor.setOptions({
			tabSize: 2,
			fontSize: '10pt',
			enableBasicAutocompletion: true,
			enableLiveAutocompletion: true
		});
		editor.getSession().setMode('ace/mode/json');
		editor.getSession().setUseWrapMode(true);
		editor.$blockScrolling = Infinity;
		editor.setValue(this.value, 1);
		let attrCompleter = {
			getCompletions: function(editor, session, pos, prefix, callback) {
				let wordList = vm.attributes;
				callback(null, wordList.map(function(word) {
					return {
						caption: word,
						value: word,
						meta: "attribute"
					}
				}));
			}
		}
		langTools.addCompleter(attrCompleter);

		editor.on('change', function() {
			const content = editor.getValue();
			vm.$emit('input', content);
		})
	},
	watch: {
		value: function(value) {
			if(this.editor.getValue() !== value){
				this.editor.setValue(value, 1);
			}
		}
	}
})
