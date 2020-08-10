import resize from 'vue-resize-directive';

let textPanelTemplate = `
<div class="text-panel-container" v-resize:debounce="onResize">
	<div v-bind:id="scrollingContainerID" class="quill-scrolling-container">
		<div v-bind:id="editorContainerID" class="quill-editor-container special-comic-text">
		</div>
	</div>
	<div v-bind:class="[firstArrowClass]"></div>
	<div v-if="arrows[1] != ''" v-bind:class="[secondArrowClass]"></div>
</div>
`;

Vue.component('text-panel', {
	template: textPanelTemplate,
	directives: {
		resize
	},
	props: {
		dataFacts: Object,
		arrows: Array,
		dataFactsContents: Array
	},
	data() {
		return {};
	},
	mounted: function() {
		var Size = Quill.import('attributors/style/size');
		Size.whitelist = ['10px', '12px', '14px'];
		Quill.register(Size, true);

		let options = {
		  modules: {
		    toolbar: [
		      [{ 'size': ['10px', '12px', '14px'] }],
		      ['bold', 'italic', 'underline'],
		      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
		      [{ 'color': [] }, { 'background': [] }],
				  [{ 'align': [] }],
				  ['link', 'image'],
				  ['clean']
		    ]
		  },
		  bounds: '#' + this.scrollingContainerID,
		  scrollingContainer: '#' + this.scrollingContainerID,
		  readOnly: true,
		  theme: 'bubble'
		};

		let editor = new Quill('#' + this.editorContainerID, options);
		this.editor = editor;
		this.updateContent(this.dataFacts);
	},
	computed: {
		scrollingContainerID: function() {
			return "text-panel-scrolling-container-" + this.uuid();
		},
		editorContainerID: function() {
			return "text-panel-editor-container-" + this.uuid();
		},
		firstArrowClass: function() {
			return "text-panel-container-arrow-" + this.arrows[0];
		},
		secondArrowClass: function() {
			return "text-panel-container-arrow-" + this.arrows[1];
		}
	},
	watch: {
		dataFacts: function(value) {
			this.updateContent(value);
		},
		dataFactsContents: function(value) {
			this.editor.setContents(value);
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
				return dataFact.tier <= 3;
			}
			return false;
		},
		updateContent: function(dataFacts) {
			let vm = this;
			let newContent = [];
			// dataFacts.forEach(dataFact => {
			// 	if(vm.showingContent(dataFact)) {
			// 		newContent.push({
			// 			insert: "  ●  "
			// 		});
			// 		newContent.push({
			// 			insert: vm.getContent(dataFact)
			// 		});
			// 	}
			// });
			// Vue.nextTick(function () {
			// 	vm.editor.setContents(newContent);
			// });
			$.post('./intermediateDataFacts', { dataFactDetails: dataFacts }, (rewrittenDataFacts) => {
				if(rewrittenDataFacts) {
					rewrittenDataFacts = JSON.parse(rewrittenDataFacts);
					newContent = vm.wikipediaLinkAdder(rewrittenDataFacts);
					Vue.nextTick(function () {
						vm.editor.setContents(newContent);
					});
				}
			});
		},
		wikipediaLinkAdder: function(rewrittenDataFacts) {
			let newContent = [];
			let rewrittenDataFactsTextList = rewrittenDataFacts.rewritten_data_facts.split(" ");
			let entityWikiList = rewrittenDataFacts.entity_wiki_pages;


			let space = "";
			let previousWord = "";
			rewrittenDataFactsTextList.forEach(word => {
				let isEntity = false;
				if (word.includes("/")) {
					isEntity = true;
					let space = " ";
					let slash = "";
					let wordList = word.split("/");
					wordList.forEach(eachSeperateWord => {
						let isEntity = false;
						Object.keys(entityWikiList).forEach(entity => {
							if(eachSeperateWord.includes(entity)
								|| this.checkWordEntityExceptions(eachSeperateWord, entity)) {
								isEntity = true;
								newContent.push({
									insert: space + slash
								});
								newContent.push({
									attributes: {
										link: entityWikiList[entity]
									},
									insert: eachSeperateWord
								});
								space = "";
								slash = "/";
							}
						});
						if (!isEntity) {
							newContent.push({
								insert: space + slash + eachSeperateWord
							});
							space = "";
							slash = "/";
						}
					});
				} else if (this.checkPhraseEntityExceptions(previousWord, word)) {
					isEntity = true;
					newContent.pop();
					let phrase = previousWord + " " + word;
					Object.keys(entityWikiList).forEach(entity => {
						if(phrase.includes(entity)
							|| this.checkWordEntityExceptions(phrase, entity)) {
							isEntity = true;
							newContent.push({
								insert: space
							});
							newContent.push({
								attributes: {
									link: entityWikiList[entity]
								},
								insert: phrase
							});
							space = " ";
						}
					});
				} else {
					Object.keys(entityWikiList).forEach(entity => {
						if(word.includes(entity)
							|| this.checkWordEntityExceptions(word, entity)) {
							isEntity = true;
							newContent.push({
								insert: space
							});
							newContent.push({
								attributes: {
									link: entityWikiList[entity]
								},
								insert: word
							});
							space = " ";
						}
					});
				}

				if (!isEntity) {
					newContent.push({
						insert: space + word
					});
					space = " ";
				}
				previousWord = word;
			});

			return newContent;
		},
		checkWordEntityExceptions: function(word, entity) {
			if (word == "explosives" && entity == "explosive material") {
				return true;
			}
			if (word == "incendiary" && entity == "incendiary device") {
				return true;
			}
			return false;
		},
		checkPhraseEntityExceptions: function(previousWord, word) {
			if (previousWord == "middle" && word == "east") {
				return true;
			}
			if (previousWord == "north" && word == "africa") {
				return true;
			}
			if (previousWord == "south" && word == "asia") {
				return true;
			}
			return false;
		},
		getEditorContents: function() {
			return this.editor.getContents();
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