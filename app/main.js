import hac from './src/cluster/hac';
import './src/pageSetup/body';

export default function comics() {
	"use strict";
	let mainBody = new Vue({
		el: '#main-body',
		data: {
			layoutsData: [],
			arrayOfCharts: [],
			reset: false,
			switchOne: null,
			storyPieceOne: null,
			changeMotif: false,
			editChart: false,
			selectedChart: {}
		},
		methods: {
			changeDataFile: function(data) {
				$.post("./changeDataFile", { dataFile: data.dataFile })
				.then(function(data) {
					console.log(data);
					window.location = "/";
				});
			},
			selectStoryPiece: function(data) {
				if(this.storyPieceOne == null) {
					this.storyPieceOne = data;
					this.reset = false;
					this.changeMotif = false;
				} else {
					this.switchMotifs(this.storyPieceOne, data);
					this.storyPieceOne = null;
					this.switchOne = null;
					this.reset = true;
					this.changeMotif = true;
					this.editChart = false;
      		this.selectedChart = {};
      		// $.post('./updateLogging', { newEvent: "Switch motifs" });
				}
			},
			unselectStoryPiece: function() {
				this.storyPieceOne = null;
			},
			selectSwitch: function(data) {
				if(this.switchOne == null) {
					this.switchOne = data;
					this.reset = false;
					this.changeMotif = false;
					this.editChart = true;
	      	this.selectedChart = data.node;
				} else {
					if(this.switchOne.index != data.index) {
						this.switchOne = null;
						this.reset = true;
						this.changeMotif = false;
						this.editChart = false;
	      		this.selectedChart = {};
					} else {
						this.switchNodes(this.switchOne, data);
						this.switchOne = null;
						this.reset = true;
						this.changeMotif = true;
						this.editChart = false;
	      		this.selectedChart = {};
	      		// $.post('./updateLogging', { newEvent: "Switch charts" });
					}
				}
			},
			unselectSwitch: function() {
				this.switchOne = null;
				this.editChart = false;
	      this.selectedChart = {};
			},
			switchMotifs: function(storyPieceOne, storyPieceTwo) {
				let vm = this;
				let newLayoutsData = [];
				this.layoutsData.forEach((motif, i) => {
					if(i == storyPieceOne.index) {
						newLayoutsData.push(Object.assign({}, this.layoutsData[storyPieceTwo.index]));
					} else if(i == storyPieceTwo.index) {
						newLayoutsData.push(Object.assign({}, this.layoutsData[storyPieceOne.index]));
					} else {
						newLayoutsData.push(Object.assign({}, this.layoutsData[i]));
					}
				});
				this.layoutsData = [];
				let uselessGutters = document.getElementsByClassName("aspect-ratio-box-inside")[0].getElementsByClassName("gutter");
				while (uselessGutters.length > 0) uselessGutters[0].remove();
				Vue.nextTick(function () {
					vm.layoutsData = newLayoutsData;
				});
			},
			switchNodes: function(switchOne, switchTwo) {
				let index = switchOne.index;
				let mst = this.layoutsData[index];
				let nodeOne = switchOne.node;
				let nodeTwo = switchTwo.node;
				let temp = Object.assign({}, nodeOne);
				nodeOne.name = nodeTwo.name;
				nodeOne.chartInfo = nodeTwo.chartInfo;
				nodeTwo.name = temp.name;
				nodeTwo.chartInfo = temp.chartInfo;
			}
		}
  });

  $.post("./getDataFile")
	.then(function(dataFile) {
		if(dataFile != "") {
			window.dataFile = dataFile;
			$.post("./matrix", { dataFile: dataFile })
			.then(function(data) {
				mainBody.arrayOfCharts = data.arrayOfCharts;
				return {
					singleLinkage: hac(Object.assign({}, data, {
						sizeThreshold: 4,
						edgeWeightThreshold: 14,
						linkageCriteria: "singleLinkage"
					})),
					averageLinkage: hac(Object.assign({}, data, {
						sizeThreshold: 4,
						edgeWeightThreshold: 14,
						linkageCriteria: "averageLinkage"
					})),
					noThreshold: hac(data)
				};
			})
			.then(function(data) {
				mainBody.layoutsData = data.averageLinkage;
			});
		}
	});
}