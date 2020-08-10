import resize from 'vue-resize-directive';

let visPanelTemplate = `
<div class="text-panel-container" v-resize:debounce="onResize">
	<div v-bind:id="scrollingContainerID" class="quill-scrolling-container">
		<div v-bind:id="editorContainerID" class="quill-editor-container">
		  <p v-if="showingContent(dataFact)" v-for="dataFact in dataFacts">{{ getContent(dataFact) }}</p>
		</div>
	</div>
</div>
`;

Vue.component('text-panel', {
	template: visPanelTemplate,
	directives: {
		resize
	},
	props: {
		dataFacts: Array
	},
	data() {

	},
	mounted: function() {
		let options = {
		  modules: {
		    toolbar: [
		      [{ header: [1, 2, false] }],
		      ['bold', 'italic', 'underline']
		    ]
		  },
		  scrollingContainer: '#' + this.scrollingContainerID,
		  theme: 'bubble'
		};

		let editor = new Quill('#' + this.editorContainerID, options);
		this.editor = editor;
	},
	computed: {
		scrollingContainerID: function() {
			return "scrolling-container-" + this.uuid();
		},
		editorContainerID: function() {
			return "editor-container-" + this.uuid();
		},
		toolbarID: function() {
			return "toolbar-" + this.uuid();
		}
	},
	methods: {
		onResize: function(el) {

		},
		getContent: function(dataFact) {
			if(dataFact.content !== undefined) {
				return dataFact.content;
			}
			return "Sample Text";
		},
		showingContent: function(dataFact) {
			if(dataFact.content !== undefined) {
				return dataFact.tier <= 2;
			}
			return false;
		},
		uuid: function() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0,
						v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		}
	}
})