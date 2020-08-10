import sortDataFacts from './sortDataFacts';

let template = `
<div>
	<a class="ui big red circular label" v-if="showStoryPieceNumber" v-on:dblclick="dblclickStoryPieceNumber">{{ index + 1 }}</a>
	<div class="single-motif-container" v-bind:style="singleMotifStyleObject">
		<div v-bind:id="leftId" class="split single-node-container" v-on:dblclick="dblclicked('left')" v-bind:style="leftSingleNodeStyleObject">
			<div v-bind:id="leftTextPanelId" class="split">
				<text-panel v-bind:arrows="leftArrows" v-bind:dataFacts="leftDataFacts" v-bind:ref="leftTextPanelId" v-bind:dataFactsContents="leftDataFactsContents"></text-panel>
			</div>
			<div v-bind:id="leftVisPanelId" class="split">
				<vis-panel v-bind:visSpec="leftVisSpec" 
					v-bind:nodeName="leftNodeName" 
					v-bind:chartComicStyle="chartComicStyle"
					v-bind:chartTheme="chartTheme">
				</vis-panel>
			</div>
		</div>
		<div v-bind:id="middleId" class="split single-node-container" v-on:dblclick="dblclicked('middle')" v-bind:style="middleSingleNodeStyleObject">
			<div v-bind:id="middleTextPanelId" class="split">
				<text-panel v-bind:arrows="middleArrows" v-bind:dataFacts="middleDataFacts" v-bind:ref="middleTextPanelId" v-bind:dataFactsContents="middleDataFactsContents"></text-panel>
			</div>
			<div v-bind:id="middleVisPanelId" class="split">
				<vis-panel v-bind:visSpec="middleVisSpec" 
					v-bind:nodeName="middleNodeName" 
					v-bind:chartComicStyle="chartComicStyle"
					v-bind:chartTheme="chartTheme">
				</vis-panel>
			</div>
		</div>
		<div v-bind:id="rightId" class="split single-node-container" v-on:dblclick="dblclicked('right')" v-bind:style="rightSingleNodeStyleObject">
			<div v-bind:id="rightTextPanelId" class="split">
				<text-panel v-bind:arrows="rightArrows" v-bind:dataFacts="rightDataFacts" v-bind:ref="rightTextPanelId" v-bind:dataFactsContents="rightDataFactsContents"></text-panel>
			</div>
			<div v-bind:id="rightVisPanelId" class="split">
				<vis-panel v-bind:visSpec="rightVisSpec" 
					v-bind:nodeName="rightNodeName" 
					v-bind:chartComicStyle="chartComicStyle"
					v-bind:chartTheme="chartTheme">
				</vis-panel>
			</div>
		</div>
	</div>
</div>
`;

Vue.component('three-nodes-linear', {
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
			leftSingleNodeStyleObject: {},
			middleSingleNodeStyleObject: {},
			rightSingleNodeStyleObject: {},
			leftId: "three-nodes-linear-left-node-" + this.index,
			leftTextPanelId: "three-nodes-linear-left-text-panel-" + this.index,
			leftVisPanelId: "three-nodes-linear-left-vis-panel-" + this.index,
			middleId: "three-nodes-linear-middle-node-" + this.index,
			middleTextPanelId: "three-nodes-linear-middle-text-panel-" + this.index,
			middleVisPanelId: "three-nodes-linear-middle-vis-panel-" + this.index,
			rightId: "three-nodes-linear-right-node-" + this.index,
			rightTextPanelId: "three-nodes-linear-right-text-panel-" + this.index,
			rightVisPanelId: "three-nodes-linear-right-vis-panel-" + this.index,
			leftArrows: ["bottom-left", ""],
			middleArrows: ["bottom-left", ""],
			rightArrows: ["bottom-left", ""]
		};
	},
	mounted: function() {
		Split(["#three-nodes-linear-left-node-" + this.index, "#three-nodes-linear-middle-node-" + this.index, "#three-nodes-linear-right-node-" + this.index], {
			direction: 'horizontal',
			sizes: [40, 30, 30],
			minSize: [0, 0, 0],
			gutterSize: 10,
			gutterStyle: (dimension, gutterSize, index) => ({
        'width': gutterSize + 'px',
        'background-color': 'transparent'
    	})
		});
		Split(["#three-nodes-linear-left-text-panel-" + this.index, "#three-nodes-linear-left-vis-panel-" + this.index], {
			direction: 'vertical',
			sizes: [30, 70],
			minSize: [0, 0],
			gutterSize: 3
		});
		Split(["#three-nodes-linear-middle-text-panel-" + this.index, "#three-nodes-linear-middle-vis-panel-" + this.index], {
			direction: 'vertical',
			sizes: [30, 70],
			minSize: [0, 0],
			gutterSize: 3
		});
		Split(["#three-nodes-linear-right-text-panel-" + this.index, "#three-nodes-linear-right-vis-panel-" + this.index], {
			direction: 'vertical',
			sizes: [30, 70],
			minSize: [0, 0],
			gutterSize: 3
		});
	},
	computed: {
		leftVisSpec: function() {
			return this.layoutData.mst.chartInfo.sourceCode;
		},
		middleVisSpec: function() {
			return this.layoutData.mst.children[0].chartInfo.sourceCode;
		},
		rightVisSpec: function() {
			return this.layoutData.mst.children[0].children[0].chartInfo.sourceCode;
		},
		leftNodeName: function() {
			return this.layoutData.mst.name;
		},
		middleNodeName: function() {
			return this.layoutData.mst.children[0].name;
		},
		rightNodeName: function() {
			return this.layoutData.mst.children[0].children[0].name;
		},
		leftDataFacts: function() {
			let sortedDataFacts = sortDataFacts({
				targetChartDataFacts: this.layoutData.mst.chartInfo.dataFacts,
				firstRelatedChartDataFacts: this.layoutData.mst.children[0].chartInfo.dataFacts
			});
			this.layoutData.mst.chartInfo.sortedDataFacts = sortedDataFacts;
			this.layoutData.mst.chartInfo.selectedDataFactsIndex = new Set(this.layoutData.mst.chartInfo.selectedDataFactsIndex);
			let selectedDataFactsIndexSet = this.layoutData.mst.chartInfo.selectedDataFactsIndex;
			return sortedDataFacts.filter((d, i) => selectedDataFactsIndexSet.has(i));
		},
		middleDataFacts: function() {
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
		rightDataFacts: function() {
			let sortedDataFacts = sortDataFacts({
				targetChartDataFacts: this.layoutData.mst.children[0].children[0].chartInfo.dataFacts,
				firstRelatedChartDataFacts: this.layoutData.mst.children[0].chartInfo.dataFacts
			});
			this.layoutData.mst.children[0].children[0].chartInfo.sortedDataFacts = sortedDataFacts;
			this.layoutData.mst.children[0].children[0].chartInfo.selectedDataFactsIndex = new Set(this.layoutData.mst.children[0].children[0].chartInfo.selectedDataFactsIndex);
			let selectedDataFactsIndexSet = this.layoutData.mst.children[0].children[0].chartInfo.selectedDataFactsIndex;
			return sortedDataFacts.filter((d, i) => selectedDataFactsIndexSet.has(i));
		},
		leftDataFactsContents: function() {
			return this.layoutData.mst.chartInfo.dataFactsContents;
		},
		middleDataFactsContents: function() {
			return this.layoutData.mst.children[0].chartInfo.dataFactsContents;
		},
		rightDataFactsContents: function() {
			return this.layoutData.mst.children[0].children[0].chartInfo.dataFactsContents;
		}
	},
	watch: {
		reset: function(value) {
			if(value) {
				this.leftSingleNodeStyleObject = {};
				this.middleSingleNodeStyleObject = {};
				this.rightSingleNodeStyleObject = {};
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
			if(position == 'left') {
				if(Object.keys(this.leftSingleNodeStyleObject).length == 0) {
					this.leftSingleNodeStyleObject = {
						border: "2px solid #639fff"
					};
					this.layoutData.mst.chartInfo.dataFactsContents = this.$refs[this.leftTextPanelId].getEditorContents();
					this.$emit('selectSwitch', {
						node: this.layoutData.mst,
						index: this.index
					});
				} else {
					this.leftSingleNodeStyleObject = {};
					this.$emit('unselectSwitch');
				}
			} else if(position == 'middle') {
				if(Object.keys(this.middleSingleNodeStyleObject).length == 0) {
					this.middleSingleNodeStyleObject = {
						border: "2px solid #639fff"
					};
					this.layoutData.mst.children[0].chartInfo.dataFactsContents = this.$refs[this.middleTextPanelId].getEditorContents();
					this.$emit('selectSwitch', {
						node: this.layoutData.mst.children[0],
						index: this.index
					});
				} else {
					this.middleSingleNodeStyleObject = {};
					this.$emit('unselectSwitch');
				}
			}	else {
				if(Object.keys(this.rightSingleNodeStyleObject).length == 0) {
					this.rightSingleNodeStyleObject = {
						border: "2px solid #639fff"
					};
					this.layoutData.mst.children[0].children[0].chartInfo.dataFactsContents = this.$refs[this.rightTextPanelId].getEditorContents();
					this.$emit('selectSwitch', {
						node: this.layoutData.mst.children[0].children[0],
						index: this.index
					});
				} else {
					this.rightSingleNodeStyleObject = {};
					this.$emit('unselectSwitch');
				}
			}
		}
	}
});