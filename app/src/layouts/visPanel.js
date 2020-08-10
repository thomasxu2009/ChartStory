import resize from 'vue-resize-directive';

let visPanelTemplate = `
<div class="vis-panel-container" v-resize:debounce="onResize">
  <div class="ui large loader" v-bind:class="{ active: isLoading }"></div>
  <div v-bind:id="visID" v-bind:ref="visID"></div>
</div>
`;

Vue.component('vis-panel', {
	template: visPanelTemplate,
	directives: {
		resize
	},
	props: {
		visSpec: Object,
		nodeName: String,
		chartComicStyle: Boolean,
		chartTheme: String
	},
	data() {
		return {
			visSize: {
				width: 600,
				height: 400
			},
			isLoading: {
				type: Boolean,
				default: true
		 	}
		};
	},
	mounted: function() {

	},
	computed: {
		visID: function() {
			return "vis-panel-" + this.uuid();
		},
		vegaOpt: function() {
			return {
				renderer: "svg",
				actions: false,
				runAsync: true,
				logLevel: vega.Warn,
				theme: this.chartTheme
			};
		}
	},
	watch: {
		visSpec: function(value) {
			this.visSize = {
				width: this.$el.offsetWidth,
				height: this.$el.offsetHeight
			};
			this.updateVisualization();
		},
		chartComicStyle: function(value) {
			this.updateVisualization();
		},
		chartTheme: function(value) {
			this.updateVisualization();
		}
	},
	methods: {
		onResize: function(el) {
			this.visSize = {
				width: el.offsetWidth,
				height: el.offsetHeight
			};
			this.updateVisualization();
		},
		makeVegaLiteSpec: function(elSize, spec) {
			spec.data.url = "../" + window.dataFile + "/" + this.nodeName + "Data.json";
			const autosize = {
				autosize: {
					type: "fit",
					resize: false,
					contains: "padding"
				}
			}
			spec.width = elSize.width;
			spec.height = elSize.height;
			if (spec.config == undefined) {
				spec.config = {};
				spec.config.legend = {};
				// spec.config.legend.titleFont = "'Gochi Hand', cursive";
				// spec.config.legend.labelFont = "'Gochi Hand', cursive";
				spec.config.legend.labelFontSize = 12;
				spec.config.legend.labelLimit = 80;
				spec.config.axis = {};
				// spec.config.axis.titleFont = "'Gochi Hand', cursive";
				// spec.config.axis.labelFont = "'Gochi Hand', cursive";
				spec.config.axis.labelFontSize = 12;
				spec.config.axis.labelLimit = 80;
				spec.config.axis.labelOverlap = true;
				spec.config.title = {};
				// spec.config.title.font = "'Gochi Hand', cursive";
				spec.config.title.fontSize = 14;
				spec.config.title.fontWeight = "bold";
				spec.config.title.orient = "bottom";
				spec.config.title.offset = 20;
			}
			return Object.assign({}, autosize, spec);
		},
		updateVisualization: function() {
			const vm = this;
			const spec = this.makeVegaLiteSpec(this.visSize, this.visSpec);
			vm.isLoading = true;
			return vegaEmbed('#' + this.visID, spec, this.vegaOpt)
				.then(result => {
					vm.isLoading = false;
					if(vm.chartComicStyle) {
						COMIC.magic(vm.$refs[vm.visID].children[0]);
					}
					return result;
				})
		},
		uuid: function() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0,
						v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		}
	}
})