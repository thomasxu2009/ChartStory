import "./editor";

let template = `
<div id="authoring-panel" class="split">
	<div class="ui segment" style="height: 100%; margin: 0px; border: none; border-radius: 0px; box-shadow: none;">
		<div class="ui pointing secondary menu">
			<a class="active item special-comic-text" data-tab="ratio">
				Page Setting
			</a>
			<a class="item special-comic-text" data-tab="theme">
				Theme
			</a>
			<a class="item special-comic-text" data-tab="authoring">
				Content Editing
			</a>
		</div>
		<div class="ui tab segment active" data-tab="ratio" style="max-height: calc(100% - 70px); overflow: auto; border-color: #aaa;">
			<div id="page-accordion" class="ui accordion">
				<div class="active title special-comic-text">
					<i class="dropdown icon"></i>
					Story Piece Setting
				</div>
				<div class="active content">
					<div class="ui form">
						<div class="inline field">
							<div id="story-piece-number-checkbox" class="ui toggle checkbox special-comic-text">
								<input type="checkbox" tabindex="0" class="hidden">
								<label>Show Story Piece Number</label>
							</div>
						</div>
						<div class="inline field">
							<img class="ui fluid image" draggable = "false" src="/app/style/otherFigures/storyPieceNumber.png">
						</div>
					</div>
				</div>
				<div class="title special-comic-text">
					<i class="dropdown icon"></i>
					Aspect Ratio
				</div>
				<div class="content">
					<div class="ui raised segment authoring-ratio-item special-comic-text" v-on:click="$emit('changeLayoutRatio', { layoutRatio: '2:1' })">
						2 : 1
						<img class="ui fluid image" draggable = "false" src="/app/style/aspectRatios/2-1.png">
					</div>
					<div class="ui raised segment authoring-ratio-item special-comic-text" v-on:click="$emit('changeLayoutRatio', { layoutRatio: 'golden' })">
						Golden
						<img class="ui fluid image" draggable = "false" src="/app/style/aspectRatios/golden.png">
					</div>
					<div class="ui raised segment authoring-ratio-item special-comic-text" v-on:click="$emit('changeLayoutRatio', { layoutRatio: 'square' })">
						Square
						<img class="ui fluid image" draggable = "false" src="/app/style/aspectRatios/square.png">
					</div>
				</div>
			</div>
		</div>
		<div class="ui tab segment" data-tab="theme" style="max-height: calc(100% - 70px); overflow: auto; border-color: #aaa;">
			<div id="theme-accordion" class="ui accordion">
				<div class="active title special-comic-text">
					<i class="dropdown icon"></i>
					Chart Effects
				</div>
				<div class="active content">
					<div class="ui form">
						<div class="inline field">
							<div id="chart-comic-style-checkbox" class="ui toggle checkbox special-comic-text">
								<input type="checkbox" tabindex="0" class="hidden">
								<label>Add Comic Style for Charts</label>
							</div>
						</div>
						<div class="inline field">
							<img class="ui fluid image" draggable = "false" src="/app/style/otherFigures/chartComicStyle.png">
						</div>
					</div>
				</div>
				<div class="title special-comic-text">
					<i class="dropdown icon"></i>
					General Theme
				</div>
				<div class="content">
					<div class="ui raised segment authoring-theme-item special-comic-text" v-on:click="$emit('changeGeneralTheme', { generalTheme: 'latimes' })">
						Latimes
						<img class="ui fluid image" draggable = "false" src="/app/style/themes/latimes.png">
					</div>
					<div class="ui raised segment authoring-theme-item special-comic-text" v-on:click="$emit('changeGeneralTheme', { generalTheme: 'excel' })">
						Excel
						<img class="ui fluid image" draggable = "false" src="/app/style/themes/excel.png">
					</div>
					<div class="ui raised segment authoring-theme-item special-comic-text" v-on:click="$emit('changeGeneralTheme', { generalTheme: 'ggplot2' })">
						Ggplot2
						<img class="ui fluid image" draggable = "false" src="/app/style/themes/ggplot2.png">
					</div>
					<div class="ui raised segment authoring-theme-item special-comic-text" v-on:click="$emit('changeGeneralTheme', { generalTheme: 'quartz' })">
						Quartz
						<img class="ui fluid image" draggable = "false" src="/app/style/themes/quartz.png">
					</div>
					<div class="ui raised segment authoring-theme-item special-comic-text" v-on:click="$emit('changeGeneralTheme', { generalTheme: 'vox' })">
						Vox
						<img class="ui fluid image" draggable = "false" src="/app/style/themes/vox.png">
					</div>
					<div class="ui raised segment authoring-theme-item special-comic-text" v-on:click="$emit('changeGeneralTheme', { generalTheme: 'fivethirtyeight' })">
						Fivethirtyeight
						<img class="ui fluid image" draggable = "false" src="/app/style/themes/fivethirtyeight.png">
					</div>
					<div class="ui raised segment authoring-theme-item special-comic-text" v-on:click="$emit('changeGeneralTheme', { generalTheme: 'dark' })">
						Dark
						<img class="ui fluid image" draggable = "false" src="/app/style/themes/dark.png">
					</div>
				</div>
			</div>
		</div>
		<div class="ui tab segment" data-tab="authoring" style="max-height: calc(100% - 70px); overflow: auto; border-color: #aaa;">
			<div id="authoring-accordion" class="ui accordion">
				<div class="active title special-comic-text">
					<i class="dropdown icon"></i>
					Data Facts
				</div>
				<div class="active content">
					<div class="ui form">
						<div class="field" v-for="(dataFact, index) in selectedChartAllDataFacts">
							<div class="ui checkbox">
								<input type="checkbox" v-bind:checked="isChecked(index)" @change="checkCheckBox($event, index)">
								<label>
									{{ dataFact.content }}
								</label>
							</div>
						</div>
					</div>
				</div>
				<div class="title special-comic-text">
					<i class="dropdown icon"></i>
					Font
				</div>
				<div class="content">
					<div v-bind:id="scrollingContainerID" class="quill-scrolling-container">
						<div v-bind:id="editorContainerID" class="quill-editor-container special-comic-text">
						</div>
					</div>
				</div>
				<div class="title special-comic-text">
					<i class="dropdown icon"></i>
					Chart
				</div>
				<div class="content">
					<div v-if="selectedChart.chartInfo !== undefined" class="ui form">
						<div class="inline field">
							<div id="single-chart-theme-selection" class="ui floating dropdown labeled basic icon button" title="single chart theme selection">
								<i class="paint brush icon"></i>
								<span class="text">Select Theme</span>
								<div class="menu">
									<div class="item">Latimes</div>
									<div class="item">Excel</div>
									<div class="item">Ggplot2</div>
									<div class="item">Quartz</div>
									<div class="item">Vox</div>
									<div class="item">Fivethirtyeight</div>
									<div class="item">Dark</div>
								</div>
							</div>
						</div>
						<div class="inline field">
							<div id="single-chart-comic-style-checkbox" class="ui toggle checkbox special-comic-text">
								<input type="checkbox" tabindex="0" class="hidden">
								<label>Add Comic Style for Charts</label>
							</div>
						</div>
						<div class="inline field">
							<label>Legend Label Font Size</label>
							<input type="text" name="legendLabelFontSize" placeholder="12">
						</div>
						<div class="inline field">
							<label>Axis Label Font Size</label>
							<input type="text" name="axisLabelFontSize" placeholder="12">
						</div>
						<div class="inline field">
							<label>Title Font Size</label>
							<input type="text" name="axisLabelFontSize" placeholder="14">
						</div>
						<div class="inline field">
							<label>Vis Spec</label>
							<vega-lite-editor
								ref="vegaliteEditor"
								v-bind:attributes="attributes"
								v-bind:value="visSpec"
								v-on:input="slowUpdateVis"
							></vega-lite-editor>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
`;

Vue.component('authoring', {
	template: template,
	props: {
		selectedChart: {
			default: {}
		}
	},
	data() {
		this.timeout = function() {};
		return {};
	},
	mounted: function() {
		let vm = this;
		$('.menu .item')
			.tab()
		;
		$('#page-accordion')
			.accordion({
				exclusive: false
			});
		;
		$('#theme-accordion')
			.accordion({
				exclusive: false
			});
		;
		$('#authoring-accordion')
			.accordion({
				exclusive: false
			});
		;
		$('#story-piece-number-checkbox')
			.checkbox({
				onChecked: function() {
					vm.$emit('changeStoryPieceSettings', { showStoryPieceNumber: true });
				},
				onUnchecked: function() {
					vm.$emit('changeStoryPieceSettings', { showStoryPieceNumber: false });
				},
			})
		;
		$('#chart-comic-style-checkbox')
			.checkbox({
				onChecked: function() {
					vm.$emit('changeChartComicStyle', { chartComicStyle: true });
				},
				onUnchecked: function() {
					vm.$emit('changeChartComicStyle', { chartComicStyle: false });
				},
			})
		;

		$('#single-chart-theme-selection')
			.dropdown({
				onChange: function(value, text, $choice) {
					// vm.$emit('changeDataFile', {
					//  dataFile: value
					// });
				}
			});

		$('#single-chart-comic-style-checkbox')
			.checkbox({
				// onChecked: function() {
			//     vm.$emit('changeChartComicStyle', { chartComicStyle: true });
			//   },
			//   onUnchecked: function() {
			//     vm.$emit('changeChartComicStyle', { chartComicStyle: false });
			//   },
			})
		;

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
			theme: 'snow'
		};

		let editor = new Quill('#' + this.editorContainerID, options);
		this.editor = editor;
		this.editor.on('text-change', function(delta, oldDelta, source) {
			if(source == 'user' && vm.selectedChart.chartInfo !== undefined) {
				vm.selectedChart.chartInfo.dataFactsContents = vm.editor.getContents();
				console.log(vm.editor.getContents());
			}
		});
	},
	computed: {
		selectedChartAllDataFacts: function() {
			if(this.selectedChart.chartInfo !== undefined) {
				return this.selectedChart.chartInfo.sortedDataFacts.slice(0, 5);
			} else {
				return [];
			}
		},
		scrollingContainerID: function() {
			return "authoring-scrolling-container-" + this.uuid();
		},
		editorContainerID: function() {
			return "authoring-editor-container-" + this.uuid();
		},
		attributes: function() {
			if(this.selectedChart.chartInfo !== undefined) {
				return Object.values(this.selectedChart.chartInfo.fields).filter(attribute => attribute != "");
			} else {
				return [];
			}
		},
		visSpec: function() {
			if(this.selectedChart.chartInfo !== undefined) {
				return JSON.stringify(this.selectedChart.chartInfo.sourceCode, null, 2);
			} else {
				return "";
			}
		}
	},

	created: function() {
		this.slowUpdateVis = this.debounce(this.updateVisualization, 2000);
	},

	watch: {
		selectedChart: function(value) {
			if(this.selectedChart.chartInfo !== undefined) {
				this.editor.setContents(this.selectedChart.chartInfo.dataFactsContents);
			} else {
				this.editor.setContents([]);
			}
		}
	},
	methods: {
		isChecked: function(index) {
			if(this.selectedChart.chartInfo !== undefined) {
				let checkedSet = this.selectedChart.chartInfo.selectedDataFactsIndex;
				if(checkedSet.has(index)) {
					return "checked";
				} else {
					return "";
				}
			} else {
				return "";
			}
		},
		checkCheckBox: function(event, index) {
			if(event.target.checked) {
				this.selectedChart.chartInfo.selectedDataFactsIndex = new Set([...this.selectedChart.chartInfo.selectedDataFactsIndex.add(index)]);
				this.updateContent(this.selectedChart.chartInfo.sortedDataFacts.filter((d, i) => this.selectedChart.chartInfo.selectedDataFactsIndex.has(i)));
			} else {
				this.selectedChart.chartInfo.selectedDataFactsIndex.delete(index);
				this.selectedChart.chartInfo.selectedDataFactsIndex = new Set([...this.selectedChart.chartInfo.selectedDataFactsIndex]);
				this.updateContent(this.selectedChart.chartInfo.sortedDataFacts.filter((d, i) => this.selectedChart.chartInfo.selectedDataFactsIndex.has(i)));
			}
			// $.post('./updateLogging', { newEvent: "Modify data facts" });
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
			$.post('./intermediateDataFacts', { dataFactDetails: dataFacts }, (rewrittenDataFacts) => {
				if(rewrittenDataFacts) {
					rewrittenDataFacts = JSON.parse(rewrittenDataFacts);
					newContent = vm.wikipediaLinkAdder(rewrittenDataFacts);
					Vue.nextTick(function () {
						vm.editor.setContents(newContent);
						if(vm.selectedChart.chartInfo !== undefined) {
							vm.selectedChart.chartInfo.dataFactsContents = newContent;
						}
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
		debounce: function(func, wait) {
			let vm = this;
			return function(...args) {
				const context = this;
				clearTimeout(vm.timeout);
				vm.timeout = setTimeout(() => func.apply(context, args), wait);
			}
		},
		updateVisualization: function(visSpec) {
			clearTimeout(this.timeout);
			const vm = this;
			this.selectedChart.chartInfo.sourceCode = JSON.parse(visSpec);
		},
		slowUpdateVis: function(visSpec) {
			this.debounce(this.updateVisualization(visSpec), 2000);
		},
		uuid: function() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0,
						v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		}
	}
});