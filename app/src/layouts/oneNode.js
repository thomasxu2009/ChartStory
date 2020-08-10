import sortDataFacts from './sortDataFacts';

let template = `
<div>
	<a class="ui big red circular label" v-if="showStoryPieceNumber" v-on:dblclick="dblclickStoryPieceNumber">{{ index + 1 }}</a>
	<div class="single-motif-container" v-bind:style="singleMotifStyleObject">
		<div class="split single-node-container" v-on:dblclick="dblclicked" v-bind:style="singleNodeStyleObject">
			<div v-bind:id="leftId" class="split">
				<vis-panel v-bind:visSpec="visSpec" 
					v-bind:nodeName="nodeName"
					v-bind:chartComicStyle="chartComicStyle"
					v-bind:chartTheme="chartTheme">
				</vis-panel>
			</div>
			<div v-bind:id="rightId" class="split">
				<text-panel v-bind:arrows="arrows" v-bind:dataFacts="dataFacts" v-bind:ref="rightId" v-bind:dataFactsContents="dataFactsContents"></text-panel>
			</div>
		</div>
	</div>
</div>
`;

Vue.component('one-node', {
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
			singleNodeStyleObject: {},
			leftId: "one-node-left-" + this.index,
			rightId: "one-node-right-" + this.index,
			arrows: ["middle-left", ""]
		};
	},
	mounted: function() {
		Split(["#one-node-left-" + this.index, "#one-node-right-" + this.index], {
			direction: 'horizontal',
			sizes: [67, 33],
			minSize: [0, 0],
			gutterSize: 3
		});
	},
	computed: {
		visSpec: function() {
			return this.layoutData.mst.chartInfo.sourceCode;
		},
		nodeName: function() {
			return this.layoutData.mst.name;
		},
		dataFacts: function() {
			let sortedDataFacts = sortDataFacts({
				targetChartDataFacts: this.layoutData.mst.chartInfo.dataFacts
			});
			this.layoutData.mst.chartInfo.sortedDataFacts = sortedDataFacts;
			this.layoutData.mst.chartInfo.selectedDataFactsIndex = new Set(this.layoutData.mst.chartInfo.selectedDataFactsIndex);
			let selectedDataFactsIndexSet = this.layoutData.mst.chartInfo.selectedDataFactsIndex;
			return sortedDataFacts.filter((d, i) => selectedDataFactsIndexSet.has(i));
		},
		dataFactsContents: function() {
			return this.layoutData.mst.chartInfo.dataFactsContents;
		}
	},
	watch: {
		reset: function(value) {
			if(value) {
				this.singleNodeStyleObject = {};
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
		dblclicked: function() {
			if(Object.keys(this.singleNodeStyleObject).length == 0) {
				this.singleNodeStyleObject = {
					border: "2px solid #639fff"
				};
				this.layoutData.mst.chartInfo.dataFactsContents = this.$refs[this.rightId].getEditorContents();
				this.$emit('selectSwitch', {
					node: this.layoutData.mst,
					index: this.index
				});
			} else {
				this.singleNodeStyleObject = {};
				this.$emit('unselectSwitch');
			}
		}
	}
});