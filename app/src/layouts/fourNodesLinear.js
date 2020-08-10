import sortDataFacts from './sortDataFacts';

let template = `
<div>
	<a class="ui big red circular label" v-if="showStoryPieceNumber" v-on:dblclick="dblclickStoryPieceNumber">{{ index + 1 }}</a>
	<div class="single-motif-container" v-bind:style="singleMotifStyleObject">
		<div v-bind:id="upperId" class="split">
			<div v-bind:id="upperLeftId" class="split single-node-container" v-on:dblclick="dblclicked('upperLeft')" v-bind:style="upperLeftSingleNodeStyleObject">
				<div v-bind:id="upperLeftTextPanelId" class="split">
					<text-panel v-bind:arrows="upperLeftArrows" v-bind:dataFacts="upperLeftDataFacts" v-bind:ref="upperLeftTextPanelId" v-bind:dataFactsContents="upperLeftDataFactsContents"></text-panel>
				</div>
				<div v-bind:id="upperLeftVisPanelId" class="split">
					<vis-panel v-bind:visSpec="upperLeftVisSpec" 
						v-bind:nodeName="upperLeftNodeName" 
						v-bind:chartComicStyle="chartComicStyle"
						v-bind:chartTheme="chartTheme">
					</vis-panel>
				</div>
			</div>
			<div v-bind:id="upperRightId" class="split single-node-container" v-on:dblclick="dblclicked('upperRight')" v-bind:style="upperRightSingleNodeStyleObject">
				<div v-bind:id="upperRightTextPanelId" class="split">
					<text-panel v-bind:arrows="upperRightArrows" v-bind:dataFacts="upperRightDataFacts" v-bind:ref="upperRightTextPanelId" v-bind:dataFactsContents="upperRightDataFactsContents"></text-panel>
				</div>
				<div v-bind:id="upperRightVisPanelId" class="split">
					<vis-panel v-bind:visSpec="upperRightVisSpec" 
						v-bind:nodeName="upperRightNodeName" 
						v-bind:chartComicStyle="chartComicStyle"
						v-bind:chartTheme="chartTheme">
					</vis-panel>
				</div>
			</div>
		</div>
		<div v-bind:id="bottomId" class="split">
			<div v-bind:id="bottomLeftId" class="split single-node-container" v-on:dblclick="dblclicked('bottomLeft')" v-bind:style="bottomLeftSingleNodeStyleObject">
				<div v-bind:id="bottomLeftTextPanelId" class="split">
					<text-panel v-bind:arrows="bottomLeftArrows" v-bind:dataFacts="bottomLeftDataFacts" v-bind:ref="bottomLeftTextPanelId" v-bind:dataFactsContents="bottomLeftDataFactsContents"></text-panel>
				</div>
				<div v-bind:id="bottomLeftVisPanelId" class="split">
					<vis-panel v-bind:visSpec="bottomLeftVisSpec" 
						v-bind:nodeName="bottomLeftNodeName" 
						v-bind:chartComicStyle="chartComicStyle"
						v-bind:chartTheme="chartTheme">
					</vis-panel>
				</div>
			</div>
			<div v-bind:id="bottomRightId" class="split single-node-container" v-on:dblclick="dblclicked('bottomRight')" v-bind:style="bottomRightSingleNodeStyleObject">
				<div v-bind:id="bottomRightTextPanelId" class="split">
					<text-panel v-bind:arrows="bottomRightArrows" v-bind:dataFacts="bottomRightDataFacts" v-bind:ref="bottomRightTextPanelId" v-bind:dataFactsContents="bottomRightDataFactsContents"></text-panel>
				</div>
				<div v-bind:id="bottomRightVisPanelId" class="split">
					<vis-panel v-bind:visSpec="bottomRightVisSpec" 
						v-bind:nodeName="bottomRightNodeName" 
						v-bind:chartComicStyle="chartComicStyle"
						v-bind:chartTheme="chartTheme">
					</vis-panel>
				</div>
			</div>
		</div>
	</div>
</div>
`;

Vue.component('four-nodes-linear', {
	template: template,
	props: {
		index: Number,
		layoutData: {
			default: {}
		},
		reset: Boolean,
		showStoryPieceNumber: Boolean,
		chartComicStyle: Boolean,
		chartTheme: String
	},
	data() {
		return {
			singleMotifStyleObject: {},
			upperLeftSingleNodeStyleObject: {},
			upperRightSingleNodeStyleObject: {},
			bottomLeftSingleNodeStyleObject: {},
			bottomRightSingleNodeStyleObject: {},
			upperId: "four-nodes-linear-upper-two-nodes-" + this.index,
			upperLeftId: "four-nodes-linear-upper-left-node-" + this.index,
			upperLeftTextPanelId: "four-nodes-linear-upper-left-text-panel-" + this.index,
			upperLeftVisPanelId: "four-nodes-linear-upper-left-vis-panel-" + this.index,
			upperRightId: "four-nodes-linear-upper-right-node-" + this.index,
			upperRightTextPanelId: "four-nodes-linear-upper-right-text-panel-" + this.index,
			upperRightVisPanelId: "four-nodes-linear-upper-right-vis-panel-" + this.index,
			bottomId: "four-nodes-linear-bottom-two-nodes-" + this.index,
			bottomLeftId: "four-nodes-linear-bottom-left-node-" + this.index,
			bottomLeftTextPanelId: "four-nodes-linear-bottom-left-text-panel-" + this.index,
			bottomLeftVisPanelId: "four-nodes-linear-bottom-left-vis-panel-" + this.index,
			bottomRightId: "four-nodes-linear-bottom-right-node-" + this.index,
			bottomRightTextPanelId: "four-nodes-linear-bottom-right-text-panel-" + this.index,
			bottomRightVisPanelId: "four-nodes-linear-bottom-right-vis-panel-" + this.index,
			upperLeftArrows: ["bottom-left", ""],
			upperRightArrows: ["bottom-left", ""],
			bottomLeftArrows: ["bottom-left", ""],
			bottomRightArrows: ["bottom-left", ""]
		};
	},
	mounted: function() {
		Split(["#four-nodes-linear-upper-two-nodes-" + this.index, "#four-nodes-linear-bottom-two-nodes-" + this.index], {
			direction: 'vertical',
			sizes: [50, 50],
			minSize: [0, 0],
			gutterSize: 10,
			gutterStyle: (dimension, gutterSize, index) => ({
        'height': gutterSize + 'px',
        'background-color': 'transparent'
    	})
		});
		Split(["#four-nodes-linear-upper-left-node-" + this.index, "#four-nodes-linear-upper-right-node-" + this.index], {
			direction: 'horizontal',
			sizes: [50, 50],
			minSize: [0, 0],
			gutterSize: 10,
			gutterStyle: (dimension, gutterSize, index) => ({
        'width': gutterSize + 'px',
        'background-color': 'transparent'
    	})
		});
		Split(["#four-nodes-linear-bottom-left-node-" + this.index, "#four-nodes-linear-bottom-right-node-" + this.index], {
			direction: 'horizontal',
			sizes: [50, 50],
			minSize: [0, 0],
			gutterSize: 10,
			gutterStyle: (dimension, gutterSize, index) => ({
        'width': gutterSize + 'px',
        'background-color': 'transparent'
    	})
		});
		Split(["#four-nodes-linear-upper-left-text-panel-" + this.index, "#four-nodes-linear-upper-left-vis-panel-" + this.index], {
			direction: 'vertical',
			sizes: [30, 70],
			minSize: [0, 0],
			gutterSize: 3
		});
		Split(["#four-nodes-linear-upper-right-text-panel-" + this.index, "#four-nodes-linear-upper-right-vis-panel-" + this.index], {
			direction: 'vertical',
			sizes: [30, 70],
			minSize: [0, 0],
			gutterSize: 3
		});
		Split(["#four-nodes-linear-bottom-left-text-panel-" + this.index, "#four-nodes-linear-bottom-left-vis-panel-" + this.index], {
			direction: 'vertical',
			sizes: [30, 70],
			minSize: [0, 0],
			gutterSize: 3
		});
		Split(["#four-nodes-linear-bottom-right-text-panel-" + this.index, "#four-nodes-linear-bottom-right-vis-panel-" + this.index], {
			direction: 'vertical',
			sizes: [30, 70],
			minSize: [0, 0],
			gutterSize: 3
		});
	},
	computed: {
		upperLeftVisSpec: function() {
			return this.layoutData.mst.chartInfo.sourceCode;
		},
		upperRightVisSpec: function() {
			return this.layoutData.mst.children[0].chartInfo.sourceCode;
		},
		bottomLeftVisSpec: function() {
			return this.layoutData.mst.children[0].children[0].chartInfo.sourceCode;
		},
		bottomRightVisSpec: function() {
			return this.layoutData.mst.children[0].children[0].children[0].chartInfo.sourceCode;
		},
		upperLeftNodeName: function() {
			return this.layoutData.mst.name;
		},
		upperRightNodeName: function() {
			return this.layoutData.mst.children[0].name;
		},
		bottomLeftNodeName: function() {
			return this.layoutData.mst.children[0].children[0].name;
		},
		bottomRightNodeName: function() {
			return this.layoutData.mst.children[0].children[0].children[0].name;
		},
		upperLeftDataFacts: function() {
			let sortedDataFacts = sortDataFacts({
				targetChartDataFacts: this.layoutData.mst.chartInfo.dataFacts,
				firstRelatedChartDataFacts: this.layoutData.mst.children[0].chartInfo.dataFacts
			});
			this.layoutData.mst.chartInfo.sortedDataFacts = sortedDataFacts;
			this.layoutData.mst.chartInfo.selectedDataFactsIndex = new Set(this.layoutData.mst.chartInfo.selectedDataFactsIndex);
			let selectedDataFactsIndexSet = this.layoutData.mst.chartInfo.selectedDataFactsIndex;
			return sortedDataFacts.filter((d, i) => selectedDataFactsIndexSet.has(i));
		},
		upperRightDataFacts: function() {
			let sortedDataFacts = sortDataFacts({
				targetChartDataFacts: this.layoutData.mst.children[0].chartInfo.dataFacts,
				firstRelatedChartDataFacts: this.layoutData.mst.chartInfo.dataFacts,
				secondRelatedChartDataFacts: this.layoutData.mst.children[0].children[0].chartInfo.dataFacts
			});
			this.layoutData.mst.children[0].chartInfo.sortedDataFacts = sortedDataFacts;
			this.layoutData.mst.children[0].chartInfo.selectedDataFactsIndex = new Set(this.layoutData.mst.children[0].chartInfo.selectedDataFactsIndex);
			let selectedDataFactsIndexSet = this.layoutData.mst.children[0].chartInfo.selectedDataFactsIndex;
			return sortedDataFacts.filter((d, i) => selectedDataFactsIndexSet.has(i));
		},
		bottomLeftDataFacts: function() {
			let sortedDataFacts = sortDataFacts({
				targetChartDataFacts: this.layoutData.mst.children[0].children[0].chartInfo.dataFacts,
				firstRelatedChartDataFacts: this.layoutData.mst.children[0].chartInfo.dataFacts,
				secondRelatedChartDataFacts: this.layoutData.mst.children[0].children[0].children[0].chartInfo.dataFacts
			});
			this.layoutData.mst.children[0].children[0].chartInfo.sortedDataFacts = sortedDataFacts;
			this.layoutData.mst.children[0].children[0].chartInfo.selectedDataFactsIndex = new Set(this.layoutData.mst.children[0].children[0].chartInfo.selectedDataFactsIndex);
			let selectedDataFactsIndexSet = this.layoutData.mst.children[0].children[0].chartInfo.selectedDataFactsIndex;
			return sortedDataFacts.filter((d, i) => selectedDataFactsIndexSet.has(i));
		},
		bottomRightDataFacts: function() {
			let sortedDataFacts = sortDataFacts({
				targetChartDataFacts: this.layoutData.mst.children[0].children[0].children[0].chartInfo.dataFacts,
				firstRelatedChartDataFacts: this.layoutData.mst.children[0].children[0].chartInfo.dataFacts
			});
			this.layoutData.mst.children[0].children[0].children[0].chartInfo.sortedDataFacts = sortedDataFacts;
			this.layoutData.mst.children[0].children[0].children[0].chartInfo.selectedDataFactsIndex = new Set(this.layoutData.mst.children[0].children[0].children[0].chartInfo.selectedDataFactsIndex);
			let selectedDataFactsIndexSet = this.layoutData.mst.children[0].children[0].children[0].chartInfo.selectedDataFactsIndex;
			return sortedDataFacts.filter((d, i) => selectedDataFactsIndexSet.has(i));
		},
		upperLeftDataFactsContents: function() {
			return this.layoutData.mst.chartInfo.dataFactsContents;
		},
		upperRightDataFactsContents: function() {
			return this.layoutData.mst.children[0].chartInfo.dataFactsContents;
		},
		bottomLeftDataFactsContents: function() {
			return this.layoutData.mst.children[0].children[0].chartInfo.dataFactsContents;
		},
		bottomRightDataFactsContents: function() {
			return this.layoutData.mst.children[0].children[0].children[0].chartInfo.dataFactsContents;
		}
	},
	watch: {
		reset: function(value) {
			if(value) {
				this.upperLeftSingleNodeStyleObject = {};
				this.upperRightSingleNodeStyleObject = {};
				this.bottomLeftSingleNodeStyleObject = {};
				this.bottomRightSingleNodeStyleObject = {};
			}
		},
	},
	methods: {
		dblclickStoryPieceNumber: function() {
			if(Object.keys(this.singleMotifStyleObject).length == 0) {
				this.singleMotifStyleObject = {
					border: "5px solid #639fff"
				};
				this.$emit('selectStoryPiece', {
					motif: this.layoutData,
					index: this.index
				});
			} else {
				this.singleMotifStyleObject = {};
				this.$emit('unselectStoryPiece');
			}
		},
		dblclicked: function(position) {
			if(position == 'upperLeft') {
				if(Object.keys(this.upperLeftSingleNodeStyleObject).length == 0) {
					this.upperLeftSingleNodeStyleObject = {
						border: "2px solid #639fff"
					};
					this.layoutData.mst.chartInfo.dataFactsContents = this.$refs[this.upperLeftTextPanelId].getEditorContents();
					this.$emit('selectSwitch', {
						node: this.layoutData.mst,
						index: this.index
					});
				} else {
					this.upperLeftSingleNodeStyleObject = {};
					this.$emit('unselectSwitch');
				}
			} else if(position == 'upperRight') {
				if(Object.keys(this.upperRightSingleNodeStyleObject).length == 0) {
					this.upperRightSingleNodeStyleObject = {
						border: "2px solid #639fff"
					};
					this.layoutData.mst.children[0].chartInfo.dataFactsContents = this.$refs[this.upperRightTextPanelId].getEditorContents();
					this.$emit('selectSwitch', {
						node: this.layoutData.mst.children[0],
						index: this.index
					});
				} else {
					this.upperRightSingleNodeStyleObject = {};
					this.$emit('unselectSwitch');
				}
			}	else if(position == 'bottomLeft') {
				if(Object.keys(this.bottomLeftSingleNodeStyleObject).length == 0) {
					this.bottomLeftSingleNodeStyleObject = {
						border: "2px solid #639fff"
					};
					this.layoutData.mst.children[0].children[0].chartInfo.dataFactsContents = this.$refs[this.bottomLeftTextPanelId].getEditorContents();
					this.$emit('selectSwitch', {
						node: this.layoutData.mst.children[0].children[0],
						index: this.index
					});
				} else {
					this.bottomLeftSingleNodeStyleObject = {};
					this.$emit('unselectSwitch');
				}
			} else {
				if(Object.keys(this.bottomRightSingleNodeStyleObject).length == 0) {
					this.bottomRightSingleNodeStyleObject = {
						border: "2px solid #639fff"
					};
					this.layoutData.mst.children[0].children[0].children[0].chartInfo.dataFactsContents = this.$refs[this.bottomRightTextPanelId].getEditorContents();
					this.$emit('selectSwitch', {
						node: this.layoutData.mst.children[0].children[0].children[0],
						index: this.index
					});
				} else {
					this.bottomRightSingleNodeStyleObject = {};
					this.$emit('unselectSwitch');
				}
			}
		}
	}
});