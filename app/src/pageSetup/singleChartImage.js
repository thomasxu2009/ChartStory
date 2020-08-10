import resize from 'vue-resize-directive';

let template = `
<div v-on:click="clicked" 
	v-bind:style="chartImageStyleObject">
	{{ layoutData.chartInfo.sourceCode.title }}
	<img v-bind:class="[{ disabled: disableChartImage }, 'ui fluid image']" draggable = "false" v-bind:src="'../../' + window.dataFile + '/' + layoutData.fileName + '.png'">
</div>
`;

Vue.component('single-chart-image', {
	template: template,
	directives: {
		resize
	},
	props: {
		index: Number,
		layoutData: {
			default: {}
		},
		changeMotif: Boolean,
		resetChartImage: Boolean,
		layoutData: {
			default: {}
		},
		addedChartImages: {
			default: []
		}
	},
	data() {
		return {
			chartImageStyleObject: {},
			disableChartImage: false
		};
	},
	watch: {
		changeMotif: function(value) {

		},
		resetChartImage: function(value) {
			if(value) {
				this.chartImageStyleObject = {};
			}
		},
		addedChartImages: function(value) {
			let addedChartImagesSet = new Set(value.map(d => d.index));
			if(addedChartImagesSet.has(this.index)) {
				this.disableChartImage = true;
			} else {
				this.disableChartImage = false;
			}
		}
	},
	methods: {
		onResize: function(el) {

		},
		clicked: function() {
			if(!this.disableChartImage) {
				if(Object.keys(this.chartImageStyleObject).length == 0) {
					this.chartImageStyleObject = {
						border: "3px solid #639fff"
					};
					this.$emit('selectChartImage', {
						chart: this.layoutData,
						index: this.index
					});
				} else {
					this.chartImageStyleObject = {};
					this.$emit('unselectChartImage', {
						chart: this.layoutData,
						index: this.index
					});
				}
			}
		}
	}
});