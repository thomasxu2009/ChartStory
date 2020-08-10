import treeDiag from '../treeDiag';
import resize from 'vue-resize-directive';
import './singleChartImage';

let template = `
<div id="motif-panel" class="split" v-resize:debounce="onResize">
	<div class="ui segment" style="height: 100%; margin: 0px; border: none; border-radius: 0px; box-shadow: none;">
		<div class="ui pointing secondary menu">
			<a class="active item special-comic-text" data-tab="overview">
		    Structure Overview
		  </a>
		  <a class="item special-comic-text" data-tab="settings">
		    Parameter Setting
		  </a>
		</div>
		<div class="ui tab segment active" data-tab="overview" style="max-height: calc(100% - 70px); overflow: auto; border-color: #aaa;">
		  <div class="ui raised segment" 
				v-bind:id="'treeDiag-id-' + index" 
		  	v-for="(layoutData, index) in layoutsData">
		  </div>
		</div>
		<div class="ui tab segment" data-tab="settings" style="max-height: calc(100% - 70px); overflow: auto; border-color: #aaa;">
		  <div id="motif-setting-accordion" class="ui accordion">
		  	<div class="active title special-comic-text">
			    <i class="dropdown icon"></i>
			    Parameters
			  </div>
			  <div class="active content">
			    <div class="ui form">
			    	<div class="inline field">
			    		<div id="linkage-criteria-selection" class="ui floating dropdown labeled basic icon button" title="linkage criteria selection">
							  <i class="paint brush icon"></i>
							  <span class="text">Select Linkage Criteria</span>
							  <div class="menu">
							    <div class="item">averageLinkage</div>
							    <div class="item">singleLinkage</div>
							  </div>
							</div>
			    	</div>
						<div class="inline field">
							<label>The maximum number of charts per motif</label>
							<input type="text" name="sizeThreshold" placeholder="4">
						</div>
					  <div class="inline field">
							<label>The maximum distance between charts</label>
							<input type="text" name="edgeWeightThreshold" placeholder="14">
						</div>
					</div>
			  </div>
		  	<div class="title special-comic-text">
			    <i class="dropdown icon"></i>
			    Chart Selection
			  </div>
			  <div class="content">
				  <single-chart-image class="ui raised segment" 
						v-bind:id="'treeDiag-id-' + index" 
				  	v-for="(layoutData, index) in arrayOfCharts"
				  	v-bind:index="index" 
						v-bind:layoutData="layoutData" 
						v-on:selectChartImage="selectChartImage" 
						v-on:unselectChartImage="unselectChartImage" 
						v-bind:changeMotif="changeMotif"
						v-bind:resetChartImage="resetChartImage"
						v-bind:addedChartImages="addedChartImages">
				  </single-chart-image>
				</div>
			</div>
		</div>
	</div>
</div>
`;

Vue.component('motif', {
	template: template,
	directives: {
		resize
	},
	props: {
		layoutsData: {
			default: []
		},
		arrayOfCharts: {
			default: []
		},
		changeMotif: Boolean,
		resetChartImage: Boolean,
		addedChartImages: {
			default: []
		}
	},
	data() {
		return {};
	},
	mounted: function() {
		let vm = this;
		$('#motif-setting-accordion')
		  .accordion({
		  	exclusive: false
		  });
		;

		$('#linkage-criteria-selection')
			.dropdown({
				onChange: function(value, text, $choice) {
					// vm.$emit('changeDataFile', {
					// 	dataFile: value
					// });
				}
			});
	},
	watch: {
		changeMotif: function(value) {
			if(value) {
				let vm = this;
				Vue.nextTick(function () {
					vm.layoutsData.forEach((d,i) => {
						treeDiag({
							container: "#treeDiag-id-" + i,
							graphIndex: i,
							mstTree: d.mst
						});
					});
				});
			}
		}
	},
	methods: {
		onResize: function(el) {
			let vm = this;
			Vue.nextTick(function () {
				vm.layoutsData.forEach((d,i) => {
					treeDiag({
						container: "#treeDiag-id-" + i,
						graphIndex: i,
						mstTree: d.mst
					});
				});
			});
		},
		selectChartImage: function(data) {
			this.$emit('selectChartImage', data);
		},
		unselectChartImage: function(data) {
			this.$emit('unselectChartImage', data);
		}
	}
});