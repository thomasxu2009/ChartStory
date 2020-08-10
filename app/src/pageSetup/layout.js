import '../layouts/oneNode';
import '../layouts/twoNodes';
import '../layouts/threeNodesLinear';
import '../layouts/threeNodesBranch';
import '../layouts/fourNodesLinear';
import '../layouts/fourNodesEqualBranch';
import '../layouts/fourNodesLeftUnequalBranch';
import '../layouts/fourNodesRightUnequalBranch';
import '../layouts/visPanel';
import '../layouts/textPanel';

let template = `
<div id="layout-panel" class="split">
	<div class="layout-panel-inside" id="layout-panel-inside" v-bind:style="layoutPanelInsideStyleObject">
		<div class="aspect-ratio-box" v-bind:style="layoutAspectRatioBoxStyleObject">
			<div class="aspect-ratio-box-inside">
				<component class="split" 
					v-bind:id="'motif-id-' + index" 
					v-for="(layoutData, index) in layoutsData" 
					v-bind:is="determineLayout(layoutData)" 
					v-bind:index="index" 
					v-bind:layoutData="layoutData"
					v-on:selectStoryPiece="selectStoryPiece"
					v-on:unselectStoryPiece="unselectStoryPiece"
					v-on:selectSwitch="selectSwitch" 
					v-on:unselectSwitch="unselectSwitch" 
					v-bind:reset="reset"
					v-bind:showStoryPieceNumber="showStoryPieceNumber"
					v-bind:chartComicStyle="chartComicStyle"
					v-bind:chartTheme="chartTheme">
				</component>
			</div>
		</div>
	</div>
</div>
`;

Vue.component('layout', {
	template: template,
	props: {
		layoutsData: {
			default: []
		},
		layoutPanelInsideStyleObject: {
			default: {}
		},
		layoutAspectRatioBoxStyleObject: {
			default: {}
		},
		reset: Boolean,
		showStoryPieceNumber: Boolean,
		chartComicStyle: Boolean,
		chartTheme: String
	},
	data() {
		return {};
	},
	mounted: function() {
		
	},
	watch: {
		layoutsData: function(value) {
			let vm = this;
			Vue.nextTick(function () {
			  switch(vm.layoutsData.length) {
					case 1:
						$("#motif-id-0").css("height", "100%");
						break;
					case 2:
						Split(["#motif-id-0", "#motif-id-1"], {
							direction: 'vertical',
							sizes: [50, 50],
							minSize: [0, 0],
							gutterSize: 3,
							gutterStyle: (dimension, gutterSize, index) => ({
				        'height': gutterSize + 'px',
				        'background': `repeating-linear-gradient(
								  to right,
								  #ccc,
								  #ccc 10px,
								  transparent 10px,
								  transparent 20px
								)`
				    	})
						});
						break;
					case 3:
						Split(["#motif-id-0", "#motif-id-1", "#motif-id-2"], {
							direction: 'vertical',
							sizes: [33.4, 33.3, 33.3],
							minSize: [0, 0, 0],
							gutterSize: 3,
							gutterStyle: (dimension, gutterSize, index) => ({
				        'height': gutterSize + 'px',
				        'background': `repeating-linear-gradient(
								  to right,
								  #ccc,
								  #ccc 10px,
								  transparent 10px,
								  transparent 20px
								)`
				    	})
						});
						break;
					case 4:
						Split(["#motif-id-0", "#motif-id-1", "#motif-id-2", "#motif-id-3"], {
							direction: 'vertical',
							sizes: [25, 25, 25, 25],
							minSize: [0, 0, 0, 0],
							gutterSize: 3,
							gutterStyle: (dimension, gutterSize, index) => ({
				        'height': gutterSize + 'px',
				        'background': `repeating-linear-gradient(
								  to right,
								  #ccc,
								  #ccc 10px,
								  transparent 10px,
								  transparent 20px
								)`
				    	})
						});
						break;
					case 5:
						Split(["#motif-id-0", "#motif-id-1", "#motif-id-2", "#motif-id-3", "#motif-id-4"], {
							direction: 'vertical',
							sizes: [20, 20, 20, 20, 20],
							minSize: [0, 0, 0, 0, 0],
							gutterSize: 3,
							gutterStyle: (dimension, gutterSize, index) => ({
				        'height': gutterSize + 'px',
				        'background': `repeating-linear-gradient(
								  to right,
								  #ccc,
								  #ccc 10px,
								  transparent 10px,
								  transparent 20px
								)`
				    	})
						});
						break;
					case 6:
						Split(["#motif-id-0", "#motif-id-1", "#motif-id-2", "#motif-id-3", "#motif-id-4", "#motif-id-5"], {
							direction: 'vertical',
							sizes: [16.7, 16.7, 16.7, 16.7, 16.6, 16.6],
							minSize: [0, 0, 0, 0, 0, 0],
							gutterSize: 3,
							gutterStyle: (dimension, gutterSize, index) => ({
				        'height': gutterSize + 'px',
				        'background': `repeating-linear-gradient(
								  to right,
								  #ccc,
								  #ccc 10px,
								  transparent 10px,
								  transparent 20px
								)`
				    	})
						});
						break;
					case 7:
						Split(["#motif-id-0", "#motif-id-1", "#motif-id-2", "#motif-id-3", "#motif-id-4", "#motif-id-5", "#motif-id-6"], {
							direction: 'vertical',
							sizes: [14.3, 14.3, 14.3, 14.3, 14.3, 14.3, 14.2],
							minSize: [0, 0, 0, 0, 0, 0, 0],
							gutterSize: 3,
							gutterStyle: (dimension, gutterSize, index) => ({
				        'height': gutterSize + 'px',
				        'background': `repeating-linear-gradient(
								  to right,
								  #ccc,
								  #ccc 10px,
								  transparent 10px,
								  transparent 20px
								)`
				    	})
						});
						break;
					case 8:
						Split(["#motif-id-0", "#motif-id-1", "#motif-id-2", "#motif-id-3", "#motif-id-4", "#motif-id-5", "#motif-id-6", "#motif-id-7"], {
							direction: 'vertical',
							sizes: [12.5, 12.5, 12.5, 12.5, 12.5, 12.5, 12.5, 12.5],
							minSize: [0, 0, 0, 0, 0, 0, 0, 0],
							gutterSize: 3,
							gutterStyle: (dimension, gutterSize, index) => ({
				        'height': gutterSize + 'px',
				        'background': `repeating-linear-gradient(
								  to right,
								  #ccc,
								  #ccc 10px,
								  transparent 10px,
								  transparent 20px
								)`
				    	})
						});
						break;
					case 9:
						Split(["#motif-id-0", "#motif-id-1", "#motif-id-2", "#motif-id-3", "#motif-id-4", "#motif-id-5", "#motif-id-6", "#motif-id-7", "#motif-id-8"], {
							direction: 'vertical',
							sizes: [11.2, 11.1, 11.1, 11.1, 11.1, 11.1, 11.1, 11.1, 11.1],
							minSize: [0, 0, 0, 0, 0, 0, 0, 0, 0],
							gutterSize: 3,
							gutterStyle: (dimension, gutterSize, index) => ({
				        'height': gutterSize + 'px',
				        'background': `repeating-linear-gradient(
								  to right,
								  #ccc,
								  #ccc 10px,
								  transparent 10px,
								  transparent 20px
								)`
				    	})
						});
						break;
					case 10:
						Split(["#motif-id-0", "#motif-id-1", "#motif-id-2", "#motif-id-3", "#motif-id-4", "#motif-id-5", "#motif-id-6", "#motif-id-7", "#motif-id-8", "#motif-id-9"], {
							direction: 'vertical',
							sizes: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
							minSize: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
							gutterSize: 3,
							gutterStyle: (dimension, gutterSize, index) => ({
				        'height': gutterSize + 'px',
				        'background': `repeating-linear-gradient(
								  to right,
								  #ccc,
								  #ccc 10px,
								  transparent 10px,
								  transparent 20px
								)`
				    	})
						});
						break;
					default:
						break;
				}
			})
		}
	},
	methods: {
		determineLayout: function(layoutData) {
			switch(layoutData.nodeList.length) {
				case 1:
					return "one-node";
				case 2:
					return "two-nodes";
				case 3:
					if(layoutData.mst.children.length == 1) {
						return "three-nodes-linear";
					} else {
						return "three-nodes-branch";
					}
				case 4:
					if(layoutData.mst.children.length == 1) {
						if(layoutData.mst.children[0].children.length == 1) {
							return "four-nodes-linear";
						} else {
							return "one-node";
						}
					} else if(layoutData.mst.children.length == 2) {
						if(layoutData.mst.children[0].children.length == 1) {
							return "four-nodes-left-unequal-branch";
						} else {
							return "four-nodes-right-unequal-branch";
						}
					} else {
						return "four-nodes-equal-branch";
					}
				default:
					return "one-node";
			}
		},
		selectStoryPiece: function(data) {
			this.$emit('selectStoryPiece', data);
		},
		unselectStoryPiece: function() {
			this.$emit('unselectStoryPiece');
		},
		selectSwitch: function(data) {
			this.$emit('selectSwitch', data);
		},
		unselectSwitch: function() {
			this.$emit('unselectSwitch');
		}
	}
});