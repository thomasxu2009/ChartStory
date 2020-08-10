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
			<div v-bind:id="rightUpperId" class="split">
				<div v-bind:id="rightUpperLeftId" class="split single-node-container" v-on:dblclick="dblclicked('rightUpperLeft')" v-bind:style="rightUpperLeftSingleNodeStyleObject">
					<div v-bind:id="rightUpperLeftTextPanelId" class="split">
						<text-panel v-bind:arrows="rightUpperLeftArrows" v-bind:dataFacts="rightUpperLeftDataFacts" v-bind:ref="rightUpperLeftTextPanelId" v-bind:dataFactsContents="rightUpperLeftDataFactsContents"></text-panel>
					</div>
					<div v-bind:id="rightUpperLeftVisPanelId" class="split">
						<vis-panel v-bind:visSpec="rightUpperLeftVisSpec" 
							v-bind:nodeName="rightUpperLeftNodeName" 
							v-bind:chartComicStyle="chartComicStyle"
							v-bind:chartTheme="chartTheme">
						</vis-panel>
					</div>
				</div>
				<div v-bind:id="rightUpperRightId" class="split single-node-container" v-on:dblclick="dblclicked('rightUpperRight')" v-bind:style="rightUpperRightSingleNodeStyleObject">
					<div v-bind:id="rightUpperRightTextPanelId" class="split">
						<text-panel v-bind:arrows="rightUpperRightArrows" v-bind:dataFacts="rightUpperRightDataFacts" v-bind:ref="rightUpperRightTextPanelId" v-bind:dataFactsContents="rightUpperRightDataFactsContents"></text-panel>
					</div>
					<div v-bind:id="rightUpperRightVisPanelId" class="split">
						<vis-panel v-bind:visSpec="rightUpperRightVisSpec" 
							v-bind:nodeName="rightUpperRightNodeName" 
							v-bind:chartComicStyle="chartComicStyle"
							v-bind:chartTheme="chartTheme">
						</vis-panel>
					</div>
				</div>
			</div>
			<div v-bind:id="rightBottomId" class="split single-node-container" v-on:dblclick="dblclicked('rightBottom')" v-bind:style="rightBottomSingleNodeStyleObject">
				<div v-bind:id="rightBottomVisPanelId" class="split">
					<vis-panel v-bind:visSpec="rightBottomVisSpec" 
						v-bind:nodeName="rightBottomNodeName" 
						v-bind:chartComicStyle="chartComicStyle"
						v-bind:chartTheme="chartTheme">
					</vis-panel>
				</div>
				<div v-bind:id="rightBottomTextPanelId" class="split">
					<text-panel v-bind:arrows="rightBottomArrows" v-bind:dataFacts="rightBottomDataFacts" v-bind:ref="rightBottomTextPanelId" v-bind:dataFactsContents="rightBottomDataFactsContents"></text-panel>
				</div>
			</div>
		</div>
	</div>
</div>
`;

Vue.component('four-nodes-left-unequal-branch', {
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
			rightUpperLeftSingleNodeStyleObject: {},
			rightUpperRightSingleNodeStyleObject: {},
			rightBottomSingleNodeStyleObject: {},
			leftId: "four-nodes-left-unequal-branch-left-node-" + this.index,
			leftTextPanelId: "four-nodes-left-unequal-branch-left-text-panel-" + this.index,
			leftVisPanelId: "four-nodes-left-unequal-branch-left-vis-panel-" + this.index,
			rightId: "four-nodes-left-unequal-branch-right-three-nodes-" + this.index,
			rightUpperId: "four-nodes-left-unequal-branch-right-upper-two-nodes-" + this.index,
			rightUpperLeftId: "four-nodes-left-unequal-branch-right-upper-left-node-" + this.index,
			rightUpperLeftTextPanelId: "four-nodes-left-unequal-branch-right-upper-left-text-panel-" + this.index,
			rightUpperLeftVisPanelId: "four-nodes-left-unequal-branch-right-upper-left-vis-panel-" + this.index,
			rightUpperRightId: "four-nodes-left-unequal-branch-right-upper-right-node-" + this.index,
			rightUpperRightTextPanelId: "four-nodes-left-unequal-branch-right-upper-right-text-panel-" + this.index,
			rightUpperRightVisPanelId: "four-nodes-left-unequal-branch-right-upper-right-vis-panel-" + this.index,
			rightBottomId: "four-nodes-left-unequal-branch-right-bottom-node-" + this.index,
			rightBottomTextPanelId: "four-nodes-left-unequal-branch-right-bottom-text-panel-" + this.index,
			rightBottomVisPanelId: "four-nodes-left-unequal-branch-right-bottom-vis-panel-" + this.index,
			leftArrows: ["bottom-left", ""],
			rightUpperLeftArrows: ["bottom-left", ""],
			rightUpperRightArrows: ["bottom-left", ""],
			rightBottomArrows: ["bottom-left", ""]
		};
	},
	mounted: function() {
		Split(["#four-nodes-left-unequal-branch-left-node-" + this.index, "#four-nodes-left-unequal-branch-right-three-nodes-" + this.index], {
			direction: 'horizontal',
			sizes: [40, 60],
			minSize: [0, 0],
			gutterSize: 10,
			gutterStyle: (dimension, gutterSize, index) => ({
        'width': gutterSize + 'px',
        'background-color': 'transparent'
    	})
		});
		Split(["#four-nodes-left-unequal-branch-right-upper-two-nodes-" + this.index, "#four-nodes-left-unequal-branch-right-bottom-node-" + this.index], {
			direction: 'vertical',
			sizes: [50, 50],
			minSize: [0, 0],
			gutterSize: 10,
			gutterStyle: (dimension, gutterSize, index) => ({
        'height': gutterSize + 'px',
        'background-color': 'transparent'
    	})
		});
		Split(["#four-nodes-left-unequal-branch-right-upper-left-node-" + this.index, "#four-nodes-left-unequal-branch-right-upper-right-node-" + this.index], {
			direction: 'horizontal',
			sizes: [50, 50],
			minSize: [0, 0],
			gutterSize: 10,
			gutterStyle: (dimension, gutterSize, index) => ({
        'width': gutterSize + 'px',
        'background-color': 'transparent'
    	})
		});
		Split(["#four-nodes-left-unequal-branch-left-text-panel-" + this.index, "#four-nodes-left-unequal-branch-left-vis-panel-" + this.index], {
			direction: 'vertical',
			sizes: [30, 70],
			minSize: [0, 0],
			gutterSize: 3
		});
		Split(["#four-nodes-left-unequal-branch-right-upper-left-text-panel-" + this.index, "#four-nodes-left-unequal-branch-right-upper-left-vis-panel-" + this.index], {
			direction: 'vertical',
			sizes: [30, 70],
			minSize: [0, 0],
			gutterSize: 3
		});
		Split(["#four-nodes-left-unequal-branch-right-upper-right-text-panel-" + this.index, "#four-nodes-left-unequal-branch-right-upper-right-vis-panel-" + this.index], {
			direction: 'vertical',
			sizes: [30, 70],
			minSize: [0, 0],
			gutterSize: 3
		});
		Split(["#four-nodes-left-unequal-branch-right-bottom-vis-panel-" + this.index, "#four-nodes-left-unequal-branch-right-bottom-text-panel-" + this.index], {
			direction: 'horizontal',
			sizes: [60, 40],
			minSize: [0, 0],
			gutterSize: 3
		});
	},
	computed: {
		leftVisSpec: function() {
			return this.layoutData.mst.chartInfo.sourceCode;
		},
		rightUpperLeftVisSpec: function() {
			return this.layoutData.mst.children[0].chartInfo.sourceCode;
		},
		rightUpperRightVisSpec: function() {
			return this.layoutData.mst.children[0].children[0].chartInfo.sourceCode;
		},
		rightBottomVisSpec: function() {
			return this.layoutData.mst.children[1].chartInfo.sourceCode;
		},
		leftNodeName: function() {
			return this.layoutData.mst.name;
		},
		rightUpperLeftNodeName: function() {
			return this.layoutData.mst.children[0].name;
		},
		rightUpperRightNodeName: function() {
			return this.layoutData.mst.children[0].children[0].name;
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
		rightUpperLeftDataFacts: function() {
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
		rightUpperRightDataFacts: function() {
			let sortedDataFacts = sortDataFacts({
				targetChartDataFacts: this.layoutData.mst.children[0].children[0].chartInfo.dataFacts,
				firstRelatedChartDataFacts: this.layoutData.mst.children[0].chartInfo.dataFacts
			});
			this.layoutData.mst.children[0].children[0].chartInfo.sortedDataFacts = sortedDataFacts;
			this.layoutData.mst.children[0].children[0].chartInfo.selectedDataFactsIndex = new Set(this.layoutData.mst.children[0].children[0].chartInfo.selectedDataFactsIndex);
			let selectedDataFactsIndexSet = this.layoutData.mst.children[0].children[0].chartInfo.selectedDataFactsIndex;
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
		rightUpperLeftDataFactsContents: function() {
			return this.layoutData.mst.children[0].chartInfo.dataFactsContents;
		},
		rightUpperRightDataFactsContents: function() {
			return this.layoutData.mst.children[0].children[0].chartInfo.dataFactsContents;
		},
		rightBottomDataFactsContents: function() {
			return this.layoutData.mst.children[1].chartInfo.dataFactsContents;
		}
	},
	watch: {
		reset: function(value) {
			if(value) {
				this.leftSingleNodeStyleObject = {};
				this.rightUpperLeftSingleNodeStyleObject = {};
				this.rightUpperRightSingleNodeStyleObject = {};
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
			} else if(position == 'rightUpperLeft') {
				if(Object.keys(this.rightUpperLeftSingleNodeStyleObject).length == 0) {
					this.rightUpperLeftSingleNodeStyleObject = {
						border: "2px solid #639fff"
					};
					this.layoutData.mst.children[0].chartInfo.dataFactsContents = this.$refs[this.rightUpperLeftTextPanelId].getEditorContents();
					this.$emit('selectSwitch', {
						node: this.layoutData.mst.children[0],
						index: this.index
					});
				} else {
					this.rightUpperLeftSingleNodeStyleObject = {};
					this.$emit('unselectSwitch');
				}
			} else if(position == 'rightUpperRight') {
				if(Object.keys(this.rightUpperRightSingleNodeStyleObject).length == 0) {
					this.rightUpperRightSingleNodeStyleObject = {
						border: "2px solid #639fff"
					};
					this.layoutData.mst.children[0].children[0].chartInfo.dataFactsContents = this.$refs[this.rightUpperRightTextPanelId].getEditorContents();
					this.$emit('selectSwitch', {
						node: this.layoutData.mst.children[0].children[0],
						index: this.index
					});
				} else {
					this.rightUpperRightSingleNodeStyleObject = {};
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