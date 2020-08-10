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
		<div v-bind:id="rightId" class="split">
			<div v-bind:id="rightUpperId" class="split single-node-container" v-on:dblclick="dblclicked('rightUpper')" v-bind:style="rightUpperSingleNodeStyleObject">
				<div v-bind:id="rightUpperTextPanelId" class="split">
					<text-panel v-bind:arrows="rightUpperArrows" v-bind:dataFacts="rightUpperDataFacts" v-bind:ref="rightUpperTextPanelId" v-bind:dataFactsContents="rightUpperDataFactsContents"></text-panel>
				</div>
				<div v-bind:id="rightUpperVisPanelId" class="split">
					<vis-panel v-bind:visSpec="rightUpperVisSpec" 
						v-bind:nodeName="rightUpperNodeName" 
						v-bind:chartComicStyle="chartComicStyle"
						v-bind:chartTheme="chartTheme">
					</vis-panel>
				</div>
			</div>
			<div v-bind:id="rightBottomId" class="split single-node-container" v-on:dblclick="dblclicked('rightBottom')" v-bind:style="rightBottomSingleNodeStyleObject">
				<div v-bind:id="rightBottomTextPanelId" class="split">
					<text-panel v-bind:arrows="rightBottomArrows" v-bind:dataFacts="rightBottomDataFacts" v-bind:ref="rightBottomTextPanelId" v-bind:dataFactsContents="rightBottomDataFactsContents"></text-panel>
				</div>
				<div v-bind:id="rightBottomVisPanelId" class="split">
					<vis-panel v-bind:visSpec="rightBottomVisSpec" 
						v-bind:nodeName="rightBottomNodeName" 
						v-bind:chartComicStyle="chartComicStyle"
						v-bind:chartTheme="chartTheme">
					</vis-panel>
				</div>
			</div>
		</div>
	</div>
</div>
`;

Vue.component('three-nodes-branch', {
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
			rightUpperSingleNodeStyleObject: {},
			rightBottomSingleNodeStyleObject: {},
			leftId: "three-nodes-branch-left-node-" + this.index,
			leftTextPanelId: "three-nodes-branch-left-text-panel-" + this.index,
			leftVisPanelId: "three-nodes-branch-left-vis-panel-" + this.index,
			rightId: "three-nodes-branch-right-two-nodes-" + this.index,
			rightUpperId: "three-nodes-branch-right-upper-node-" + this.index,
			rightUpperTextPanelId: "three-nodes-branch-right-upper-text-panel-" + this.index,
			rightUpperVisPanelId: "three-nodes-branch-right-upper-vis-panel-" + this.index,
			rightBottomId: "three-nodes-branch-right-bottom-node-" + this.index,
			rightBottomTextPanelId: "three-nodes-branch-right-bottom-text-panel-" + this.index,
			rightBottomVisPanelId: "three-nodes-branch-right-bottom-vis-panel-" + this.index,
			leftArrows: ["bottom-left", ""],
			rightUpperArrows: ["bottom-left", ""],
			rightBottomArrows: ["bottom-left", ""]
		};
	},
	mounted: function() {
		Split(["#three-nodes-branch-left-node-" + this.index, "#three-nodes-branch-right-two-nodes-" + this.index], {
			direction: 'horizontal',
			sizes: [50, 50],
			minSize: [0, 0],
			gutterSize: 10,
			gutterStyle: (dimension, gutterSize, index) => ({
        'width': gutterSize + 'px',
        'background-color': 'transparent'
    	})
		});
		Split(["#three-nodes-branch-right-upper-node-" + this.index, "#three-nodes-branch-right-bottom-node-" + this.index], {
			direction: 'vertical',
			sizes: [50, 50],
			minSize: [0, 0],
			gutterSize: 10,
			gutterStyle: (dimension, gutterSize, index) => ({
        'height': gutterSize + 'px',
        'background-color': 'transparent'
    	})
		});
		Split(["#three-nodes-branch-left-text-panel-" + this.index, "#three-nodes-branch-left-vis-panel-" + this.index], {
			direction: 'vertical',
			sizes: [30, 70],
			minSize: [0, 0],
			gutterSize: 3
		});
		Split(["#three-nodes-branch-right-upper-text-panel-" + this.index, "#three-nodes-branch-right-upper-vis-panel-" + this.index], {
			direction: 'vertical',
			sizes: [30, 70],
			minSize: [0, 0],
			gutterSize: 3
		});
		Split(["#three-nodes-branch-right-bottom-text-panel-" + this.index, "#three-nodes-branch-right-bottom-vis-panel-" + this.index], {
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
		rightUpperVisSpec: function() {
			return this.layoutData.mst.children[0].chartInfo.sourceCode;
		},
		rightBottomVisSpec: function() {
			return this.layoutData.mst.children[1].chartInfo.sourceCode;
		},
		leftNodeName: function() {
			return this.layoutData.mst.name;
		},
		rightUpperNodeName: function() {
			return this.layoutData.mst.children[0].name;
		},
		rightBottomNodeName: function() {
			return this.layoutData.mst.children[1].name;
		},
		leftDataFacts: function() {
			let sortedDataFacts = sortDataFacts({
				targetChartDataFacts: this.layoutData.mst.chartInfo.dataFacts,
				firstRelatedChartDataFacts: this.layoutData.mst.children[0].chartInfo.dataFacts,
				secondRelatedChartDataFacts: this.layoutData.mst.children[1].chartInfo.dataFacts
			});
			this.layoutData.mst.chartInfo.sortedDataFacts = sortedDataFacts;
			this.layoutData.mst.chartInfo.selectedDataFactsIndex = new Set(this.layoutData.mst.chartInfo.selectedDataFactsIndex);
			let selectedDataFactsIndexSet = this.layoutData.mst.chartInfo.selectedDataFactsIndex;
			return sortedDataFacts.filter((d, i) => selectedDataFactsIndexSet.has(i));
		},
		rightUpperDataFacts: function() {
			let sortedDataFacts = sortDataFacts({
				targetChartDataFacts: this.layoutData.mst.children[0].chartInfo.dataFacts,
				firstRelatedChartDataFacts: this.layoutData.mst.chartInfo.dataFacts
			});
			this.layoutData.mst.children[0].chartInfo.sortedDataFacts = sortedDataFacts;
			this.layoutData.mst.children[0].chartInfo.selectedDataFactsIndex = new Set(this.layoutData.mst.children[0].chartInfo.selectedDataFactsIndex);
			let selectedDataFactsIndexSet = this.layoutData.mst.children[0].chartInfo.selectedDataFactsIndex;
			return sortedDataFacts.filter((d, i) => selectedDataFactsIndexSet.has(i));
		},
		rightBottomDataFacts: function() {
			let sortedDataFacts = sortDataFacts({
				targetChartDataFacts: this.layoutData.mst.children[1].chartInfo.dataFacts,
				firstRelatedChartDataFacts: this.layoutData.mst.chartInfo.dataFacts
			});
			this.layoutData.mst.children[1].chartInfo.sortedDataFacts = sortedDataFacts;
			this.layoutData.mst.children[1].chartInfo.selectedDataFactsIndex = new Set(this.layoutData.mst.children[1].chartInfo.selectedDataFactsIndex);
			let selectedDataFactsIndexSet = this.layoutData.mst.children[1].chartInfo.selectedDataFactsIndex;
			return sortedDataFacts.filter((d, i) => selectedDataFactsIndexSet.has(i));
		},
		leftDataFactsContents: function() {
			return this.layoutData.mst.chartInfo.dataFactsContents;
		},
		rightUpperDataFactsContents: function() {
			return this.layoutData.mst.children[0].chartInfo.dataFactsContents;
		},
		rightBottomDataFactsContents: function() {
			return this.layoutData.mst.children[1].chartInfo.dataFactsContents;
		}
	},
	watch: {
		reset: function(value) {
			if(value) {
				this.leftSingleNodeStyleObject = {};
				this.rightUpperSingleNodeStyleObject = {};
				this.rightBottomSingleNodeStyleObject = {};
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
			} else if(position == 'rightUpper') {
				if(Object.keys(this.rightUpperSingleNodeStyleObject).length == 0) {
					this.rightUpperSingleNodeStyleObject = {
						border: "2px solid #639fff"
					};
					this.layoutData.mst.children[0].chartInfo.dataFactsContents = this.$refs[this.rightUpperTextPanelId].getEditorContents();
					this.$emit('selectSwitch', {
						node: this.layoutData.mst.children[0],
						index: this.index
					});
				} else {
					this.rightUpperSingleNodeStyleObject = {};
					this.$emit('unselectSwitch');
				}
			}	else {
				if(Object.keys(this.rightBottomSingleNodeStyleObject).length == 0) {
					this.rightBottomSingleNodeStyleObject = {
						border: "2px solid #639fff"
					};
					this.layoutData.mst.children[1].chartInfo.dataFactsContents = this.$refs[this.rightBottomTextPanelId].getEditorContents();
					this.$emit('selectSwitch', {
						node: this.layoutData.mst.children[1],
						index: this.index
					});
				} else {
					this.rightBottomSingleNodeStyleObject = {};
					this.$emit('unselectSwitch');
				}
			}
		}
	}
});