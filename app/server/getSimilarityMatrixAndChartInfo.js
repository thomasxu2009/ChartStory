const fs = require('fs');
let getSimilarityMatrix = require('./getSimilarityMatrix.js');
let getDataFact = require('./dataFactGenerator/getDataFact.js');
let dataFile = "";

module.exports = function(app) {
	//update matrix
	app.post('/matrix', function (req, res) {
		dataFile = req.body.dataFile;
		var arrayOfFiles = [];

		fs.readdir("./" + dataFile + "/", (err, files) => {
			files.forEach(file => {
				if(file.substring(file.length - 5, file.length) == ".json" && file.length > 9 && file.substring(file.length - 9, file.length - 5) != "Data") {
					arrayOfFiles.push(file.substring(0, file.length - 5));
				}
			});
			var chartInfos = [];
			getChartInfos(arrayOfFiles, chartInfos, 0, res);
		});
	});
}

function getChartInfos(arrayOfFiles, chartInfos, i, res) {
	fs.readFile("./" + dataFile + "/" + arrayOfFiles[i] + '.json', 'utf-8', function(err, data) {
		try{
			if (err) throw err;
		} catch(err) {
			res.send(false);
			res.end();
			return;
		}

		var chartObjects = JSON.parse(data);

		fs.readFile("./" + dataFile + "/" + arrayOfFiles[i] + 'Data.json', 'utf-8', function(err, dataset) {
			try{
				if (err) throw err;
			} catch(err) {
				res.send(false);
				res.end();
				return;
			}

			let partOfChartInfo = {
				chartType: chartObjects.chartType,
				specificChartType: chartObjects.specific,
				fields: {
					xAxisField: chartObjects.xAxisField,
					yAxisField: chartObjects.yAxisField,
					colorField: chartObjects.colorField,
					columnField: chartObjects.columnField,
					sizeField: chartObjects.sizeField
				},
				dataList: JSON.parse(dataset)
			}
			chartInfos.push({
				fileName: arrayOfFiles[i],
				chartInfo: Object.assign(
					{},
					partOfChartInfo,
					{
						user: chartObjects.user,
						dateTime: chartObjects.dateTime,
						sourceCode: chartObjects.sourceCode,
						keywords: chartObjects.keywords,
						captions: chartObjects.captions,
						title: chartObjects.visTitleText,
						dataFacts: getDataFact(partOfChartInfo),
						selectedDataFactsIndex: Array.from({length: 4}, (v, i) => i),
						dataFactsContents: []
					}
				)
			});

			if(i < arrayOfFiles.length - 1) {
				getChartInfos(arrayOfFiles, chartInfos, i + 1, res);
			} else {
				let similarityMatrix = getSimilarityMatrix(chartInfos);
				let returnData = {
					matrix: similarityMatrix,
					arrayOfCharts: chartInfos
				};
				res.send(returnData);
				res.end();
			}
		});
	});
}
