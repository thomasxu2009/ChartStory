import './menu';
import './motif';
import './layout';
import './authoring';
import './collapseLeftControl';
import './collapseRightControl';

let template = `
<div>
	<div id="page-menu">
		<page-menu 
			v-on:changeDataFile="changeDataFile"
			v-on:zoomIn="zoomIn"
			v-on:zoomOut="zoomOut"
			v-on:motifPanel="motifPanel"
			v-on:authoringPanel="authoringPanel">
		</page-menu>
	</div>
	<div class="pusher">
		<div style="height: 96vh;">
			<motif v-bind:layoutsData="layoutsData"
				v-bind:arrayOfCharts="arrayOfCharts"
				v-bind:changeMotif="changeMotif">
			</motif>
			<collapse-left-control v-model="motifPanelCollapsed" 
				v-bind:gutterSize="11"
				v-bind:autoHide="autoHideLeft">
			</collapse-left-control>
			<layout v-bind:layoutsData="layoutsData"
				v-bind:layoutPanelInsideStyleObject="layoutPanelInsideStyleObject"
				v-bind:layoutAspectRatioBoxStyleObject="layoutAspectRatioBoxStyleObject"
				v-on:selectStoryPiece="selectStoryPiece"
				v-on:unselectStoryPiece="unselectStoryPiece"
				v-on:selectSwitch="selectSwitch"
				v-on:unselectSwitch="unselectSwitch"
				v-bind:reset="reset"
				v-bind:showStoryPieceNumber="showStoryPieceNumber"
				v-bind:chartComicStyle="chartComicStyle"
				v-bind:chartTheme="chartTheme">
			</layout>
			<collapse-right-control v-model="authoringPanelCollapsed" 
				v-bind:gutterSize="11"
				v-bind:autoHide="autoHideRight">
			</collapse-right-control>
			<authoring 
				v-on:changeStoryPieceSettings="changeStoryPieceSettings"
				v-on:changeLayoutRatio="changeLayoutRatio"
				v-on:changeGeneralTheme="changeGeneralTheme"
				v-on:changeChartComicStyle="changeChartComicStyle"
				v-bind:selectedChart="selectedChart">
			</authoring>
		</div>
	</div>
</div>
`;

Vue.component('main-body', {
	template: template,
	props: {
		layoutsData: {
			default: []
		},
		arrayOfCharts: {
			default: []
		},
		reset: Boolean,
		changeMotif: Boolean,
		editChart: Boolean,
		selectedChart: {
			default: {}
		}
  },
	data() {
		return {
			autoHideLeft: true,
			autoHideRight: true,
			motifPanelCollapsed: false,
			authoringPanelCollapsed: false,
			pageSizeCoefficient: 1,
			layoutPanelInsideWidth: 1600,
			showStoryPieceNumber: false,
			layoutRatio: "2:1",
			chartComicStyle: false,
			chartTheme: 'latimes'
		};
	},
	mounted: function() {
		this.pusherSplit = Split(["#motif-panel", "#layout-panel", "#authoring-panel"], {
			direction: 'horizontal',
			sizes: [0, 100, 0],
			minSize: [0, 0, 0],
			gutterSize: 12,
			gutterStyle: (dimension, gutterSize, index) => ({
        'width': gutterSize + 'px',
        'background-color': '#fff',
        'border-left': '1px solid #aaa',
        'border-right': '1px solid #aaa',
    	}),
		});
		this.motifPanelCollapsed = true;
		this.authoringPanelCollapsed = true;
		// this.pusherSplit = Split(["#layout-panel", "#authoring-panel"], {
		// 	direction: 'horizontal',
		// 	sizes: [100, 0],
		// 	minSize: [0, 0],
		// 	gutterSize: 12,
		// 	gutterStyle: (dimension, gutterSize, index) => ({
  //       'width': gutterSize + 'px',
  //       'background-color': '#fff',
  //       'border-left': '1px solid #aaa',
  //       'border-right': '1px solid #aaa',
  //   	}),
		// });
		// this.authoringPanelCollapsed = true;
	},
	watch: {
		motifPanelCollapsed: function(curr, prev) {
      if(curr) {
        this.pusherSplit.collapse(0);
      } else {
      	if(this.authoringPanelCollapsed) {
      		this.pusherSplit.setSizes([20, 80, 0]);
      	} else {
      		this.pusherSplit.setSizes([20, 60, 20]);
      	}
      }
    },
    authoringPanelCollapsed: function(curr, prev) {
      if(curr) {
        this.pusherSplit.collapse(2);
      } else {
        if(this.motifPanelCollapsed) {
      		this.pusherSplit.setSizes([0, 80, 20]);
      	} else {
      		this.pusherSplit.setSizes([20, 60, 20]);
      	}
      }
    },
    editChart: function(value) {
    	if(value) {
				if(this.authoringPanelCollapsed) {
	      	if(this.motifPanelCollapsed) {
	      		this.pusherSplit.setSizes([0, 80, 20]);
	      	} else {
	      		this.pusherSplit.setSizes([20, 60, 20]);
	      	}
	      	this.authoringPanelCollapsed = false;
	      }
	      $('.ui.menu').find('.item').tab('change tab', 'authoring');
    	} else {
				if(!this.authoringPanelCollapsed) {
	        this.pusherSplit.collapse(2);
	        this.authoringPanelCollapsed = true;
	      }
	      $('.ui.menu').find('.item').tab('change tab', 'ratio');
    	}
    }
 //    authoringPanelCollapsed: function(curr, prev) {
 //      if(curr) {
 //        this.pusherSplit.collapse(1);
 //      } else {
 //    		this.pusherSplit.setSizes([80, 20]);
 //      }
 //    },
 //    editChart: function(value) {
 //    	if(value) {
	// 			if(this.authoringPanelCollapsed) {
	//       	this.pusherSplit.setSizes([80, 20]);
	//       	this.authoringPanelCollapsed = false;
	//       }
	//       $('.ui.menu').find('.item').tab('change tab', 'authoring');
 //    	} else {
	// 			if(!this.authoringPanelCollapsed) {
	//         this.pusherSplit.collapse(1);
	//         this.authoringPanelCollapsed = true;
	//       }
	//       $('.ui.menu').find('.item').tab('change tab', 'ratio');
 //    	}
 //    }
	},
	computed: {
		layoutPanelInsideHeight: function() {
			switch(this.layoutRatio) {
				case "2:1":
					return this.layoutsData.length * this.layoutPanelInsideWidth / 2;
					break;
				case "golden":
					return this.layoutsData.length * this.layoutPanelInsideWidth / 1.618;
					break;
				case "square":
					return this.layoutsData.length * this.layoutPanelInsideWidth;
					break;
				default:
					return this.layoutsData.length * this.layoutPanelInsideWidth / 2;
					break;
			}
		},
		layoutAspectRatioBoxPaddingTop: function() {
			return (this.layoutPanelInsideHeight / this.layoutPanelInsideWidth * 100);
		},
		layoutPanelInsideStyleObject: function() {
			let height = this.layoutPanelInsideHeight * this.pageSizeCoefficient;
			let pusherHeight = window.innerHeight * 0.96;
			let margin = height > pusherHeight ? 0 : (pusherHeight - height) / 2;
			return {
				height: this.layoutPanelInsideHeight * this.pageSizeCoefficient + "px",
				width: this.layoutPanelInsideWidth * this.pageSizeCoefficient + "px",
				margin: margin + "px auto"
			};
		},
		layoutAspectRatioBoxStyleObject: function() {
			return {
				paddingTop: this.layoutAspectRatioBoxPaddingTop + "%"
			};
		}
	},
	methods: {
		changeDataFile: function(data) {
			this.$emit('change-data-file', data);
		},
		zoomIn: function() {
			this.pageSizeCoefficient += 0.1;
		},
		zoomOut: function() {
			this.pageSizeCoefficient -= 0.1;
		},
    motifPanel: function() {
    	if(!this.motifPanelCollapsed) {
        this.pusherSplit.collapse(0);
        this.motifPanelCollapsed = true;
      } else {
      	if(this.authoringPanelCollapsed) {
      		this.pusherSplit.setSizes([20, 80, 0]);
      	} else {
      		this.pusherSplit.setSizes([20, 60, 20]);
      	}
      	this.motifPanelCollapsed = false;
      }
    },
    authoringPanel: function() {
    	if(!this.authoringPanelCollapsed) {
        this.pusherSplit.collapse(2);
        this.authoringPanelCollapsed = true;
      } else {
      	if(this.motifPanelCollapsed) {
      		this.pusherSplit.setSizes([0, 80, 20]);
      	} else {
      		this.pusherSplit.setSizes([20, 60, 20]);
      	}
      	this.authoringPanelCollapsed = false;
      }
    },
    // authoringPanel: function() {
    // 	if(!this.authoringPanelCollapsed) {
    //     this.pusherSplit.collapse(1);
    //     this.authoringPanelCollapsed = true;
    //   } else {
    //   	this.pusherSplit.setSizes([80, 20]);
    //   	this.authoringPanelCollapsed = false;
    //   }
    // },
    changeStoryPieceSettings: function(data) {
    	this.showStoryPieceNumber = data.showStoryPieceNumber;
    },
    changeLayoutRatio: function(data) {
    	this.layoutRatio = data.layoutRatio;
    },
		changeGeneralTheme: function(data) {
			switch(data.generalTheme) {
				case "latimes":
					document.getElementById('generalTheme')
						.setAttribute("href", "/app/style/generalThemeLight.css");
					this.chartTheme = "latimes";
					break;
				case "excel":
					document.getElementById('generalTheme')
						.setAttribute("href", "/app/style/generalThemeExcel.css");
					this.chartTheme = "excel";
					break;
				case "ggplot2":
					document.getElementById('generalTheme')
						.setAttribute("href", "/app/style/generalThemeGgplot2.css");
					this.chartTheme = "ggplot2";
					break;
				case "quartz":
					document.getElementById('generalTheme')
						.setAttribute("href", "/app/style/generalThemeQuartz.css");
					this.chartTheme = "quartz";
					break;
				case "vox":
					document.getElementById('generalTheme')
						.setAttribute("href", "/app/style/generalThemeVox.css");
					this.chartTheme = "vox";
					break;
				case "fivethirtyeight":
					document.getElementById('generalTheme')
						.setAttribute("href", "/app/style/generalThemeFivethirtyeight.css");
					this.chartTheme = "fivethirtyeight";
					break;
				case "dark":
					document.getElementById('generalTheme')
						.setAttribute("href", "/app/style/generalThemeDark.css");
					this.chartTheme = "dark";
					break;
				default:
					break;
			}
		},
		changeChartComicStyle: function(data) {
			this.chartComicStyle = data.chartComicStyle;
		},
		selectStoryPiece: function(data) {
			this.$emit('select-story-piece', data);
		},
		unselectStoryPiece: function() {
			this.$emit('unselect-story-piece');
		},
		selectSwitch: function(data) {
			this.$emit('select-switch', data);
		},
		unselectSwitch: function() {
			this.$emit('unselect-switch');
		}
	}
});