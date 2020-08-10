let dataFactObject = require('./dataFactObject.js');
let pearsonCorrelation = require('./pearsoncorrelation.js');
const percentile = require("percentile");

let highExtremeKeywords = ["best","good","high","highest","increase","increasing","extreme"];
let lowExtremeKeywords = ["worst","bad","low","lowest","least","decrease","decreasing","extreme"];
let correlationKeywords = ["correlation","correlate","compare"];
let distributionKeywords = ["distribution","spread","range","compare"];
let outlierKeywords = ["outlier","outliers","anomaly","anomalies"];

module.exports = function(data) {

	let dataList = data.dataList;

	switch(data.specificChartType) {
		case "histogram":
			return getCommonDataFactsForTickPlotAndBoxPlotAndHistogram_Q(data.fields.xAxisField, dataList);
			break;
		case "simpleBarChart":
		case "simpleAreaChart":
		case "simpleLineChart":
		case "aggregateBarChart":
			return getCommonFacts_SimpleBarAndLineAndAreaChart_NxQ(data.fields.xAxisField, 
				data.fields.yAxisField, dataList);
			break;
		case "stripPlot":
			return getCommonFacts_SimpleBarAndLineAndAreaChart_NxQ(data.fields.yAxisField, 
				data.fields.xAxisField, dataList);
			break;
		case "binnedScatterPlot":
			return getDataFactsForScatterplot_QxQ(data.fields.xAxisField,
				data.fields.yAxisField, dataList);
			break;
		case "multiSeriesLineChart":
		case "stackedBarChart":
		case "stackedAreaChart":
		case "streamgraph":
			return getDataFactsForMultiSeriesLineChart_NxQxN(data.fields.xAxisField,
				data.fields.yAxisField, data.fields.colorField, dataList);
			break;
		case "horizontalStackedBarChart":
			return getDataFactsForMultiSeriesLineChart_NxQxN(data.fields.yAxisField,
				data.fields.xAxisField, data.fields.colorField, dataList);
			break;
		case "gapminderBubblePlot":
			return getDataFactsForSizedScatterplot_QxQxQ(data.fields.xAxisField,
				data.fields.yAxisField, data.fields.sizeField, dataList);
			break;
		case "coloredScatterPlot":
			return getDataFactsForColoredScatterplot_QxQxN(data.fields.xAxisField, 
				data.fields.yAxisField, data.fields.colorField, dataList);
			break;
		case "colorHeatmap":
			return getCommonDataFactsForSizeHeatmapAndColorHeatmap_NxNxQ(data.fields.xAxisField, 
				data.fields.yAxisField, data.fields.colorField, dataList);
			break;
		case "sizeHeatmap":
			return getCommonDataFactsForSizeHeatmapAndColorHeatmap_NxNxQ(data.fields.xAxisField, 
				data.fields.yAxisField, data.fields.sizeField, dataList);
			break;
		default:
			break;
	}
	return [];

}

function getCommonDataFactsForTickPlotAndBoxPlotAndHistogram_Q(xAttr, dataList) {
	let potentialDataFacts = [];
	let values = [];
	let potentialDataFact;

	let newDataList = dataList.slice();
	newDataList = newDataList.filter(dataObj => dataObj[xAttr] !== "");
	newDataList.forEach(dataObj => {
		dataObj[xAttr] = parseFloat(dataObj[xAttr]);
	});

	let listLength = newDataList.length;

	let sortedDataList = newDataList.sort((a,b) => 
		(a[xAttr] > b[xAttr]) ? 1 : ((b[xAttr] > a[xAttr]) ? -1 : 0));

	newDataList.forEach(dataObj => {
		values.push(dataObj[xAttr]);
	});

	let q25 = percentile(25, newDataList, item => item[xAttr])[xAttr];
	let q75 = percentile(75, newDataList, item => item[xAttr])[xAttr];
	let iqr = q75 - q25;

	potentialDataFact = dataFactObject.getRangeDistributionDataFactObject();
	potentialDataFact['primaryTargetObjectType'] = 'value';
	potentialDataFact['primaryTargetObject'] = [q25,q75];
	potentialDataFact['tier'] = 1;
	potentialDataFact['content'] = "Most values for " + xAttr + " are in the range " + potentialDataFact['primaryTargetObject'][0] + ' - ' + potentialDataFact['primaryTargetObject'][1];
	potentialDataFact['attributes'] = [xAttr];
	potentialDataFact['keywords'] = distributionKeywords;

	potentialDataFacts.push(potentialDataFact);

	let outlierThreshold = 1.5;
	let outliers = [];

	newDataList.forEach(dataObj => {
		if(dataObj[xAttr] < (q25 - outlierThreshold * iqr)) {
			outliers.push({
				dataObj: dataObj,
				distanceFromRangeBoundary: Math.abs((q25 - outlierThreshold * iqr) - dataObj[xAttr])
			})
		} else if(dataObj[xAttr] > (q75 + outlierThreshold * iqr)) {
			outliers.push({
				dataObj: dataObj,
				distanceFromRangeBoundary: Math.abs(dataObj[xAttr] - (q75 + outlierThreshold * iqr))
			})
		}
	});

	let sortedOutlierList = outliers.sort((a,b) => 
		(b['distanceFromRangeBoundary'] > a['distanceFromRangeBoundary']) ? 1 : ((a['distanceFromRangeBoundary'] > b['distanceFromRangeBoundary']) ? -1 : 0));

	sortedOutlierList.forEach((outlier, i) => {
		let dataObj = outlier['dataObj'];
		potentialDataFact = dataFactObject.getOutlierDataFactObject()
		potentialDataFact['primaryTargetObjectType'] = "item"
		potentialDataFact['primaryTargetObject'] = dataObj[xAttr];
		potentialDataFact['tier'] = 3
		potentialDataFact['content'] = potentialDataFact['primaryTargetObject'] + " (" + xAttr + ")" + " appears to be an outlier"
		potentialDataFact['attributes'] = [xAttr]
		potentialDataFact['keywords'] = outlierKeywords
		if(i < 2) {
			potentialDataFact['tier'] = 1;
		} else if( i >= 2 && i < 5) {
			potentialDataFact['tier'] = 2;
		}
		potentialDataFacts.push(potentialDataFact);
	})

	return potentialDataFacts;
}

function getCommonFacts_SimpleBarAndLineAndAreaChart_NxQ(categoryAttr, valueAttr, dataList) {
	let potentialDataFacts = [];
	let potentialDataFact;
	let dataHash = {};

	dataList.forEach(dataObj => {
		if(dataHash[dataObj[categoryAttr]] === undefined) {
			dataHash[dataObj[categoryAttr]] = 0;
		}
		if(dataObj[valueAttr] !== "") {
			dataHash[dataObj[categoryAttr]] += parseFloat(dataObj[valueAttr]);
		}
	});
	let newDataList = [];
	Object.keys(dataHash).forEach(category => {
		let newDataItem = {};
		newDataItem[categoryAttr] = category;
		newDataItem[valueAttr] = dataHash[category];
		newDataList.push(newDataItem);
	});
	let sortedDataList = newDataList.sort((a,b) => 
		(a[valueAttr] > b[valueAttr]) ? 1 : ((b[valueAttr] > a[valueAttr]) ? -1 : 0));

	let listLength = sortedDataList.length;

	/*
	=====================
	  ExtremeValueFacts
	=====================
	*/

	// category with lowest value
	potentialDataFact = dataFactObject.getExtremeValueDataFactObject();
	potentialDataFact['extremeFunction'] = "MIN";
	potentialDataFact['primaryTargetObjectType'] = "category";
	potentialDataFact['primaryTargetObject'] = sortedDataList[0][categoryAttr];
	potentialDataFact['tier'] = 1;
	potentialDataFact['content'] = sortedDataList[0][categoryAttr] + 
		" (" + categoryAttr + ")" + " has the lowest " + valueAttr + 
		" (" + sortedDataList[0][valueAttr] + ")";
	potentialDataFact['attributes'] = [categoryAttr, valueAttr];
	potentialDataFact['keywords'] = lowExtremeKeywords;

	potentialDataFacts.push(potentialDataFact);

	// category with second lowest value
	potentialDataFact = dataFactObject.getExtremeValueDataFactObject();
	potentialDataFact['extremeFunction'] = "MIN";
	potentialDataFact['primaryTargetObjectType'] = "category";
	potentialDataFact['primaryTargetObject'] = sortedDataList[1][categoryAttr];
	potentialDataFact['tier'] = 2;
	potentialDataFact['content'] = sortedDataList[1][categoryAttr] + 
		" (" + categoryAttr + ")" + " has the second lowest " + valueAttr + 
		" (" + sortedDataList[1][valueAttr] + ")";
	potentialDataFact['attributes'] = [categoryAttr, valueAttr];
	potentialDataFact['keywords'] = lowExtremeKeywords;

	potentialDataFacts.push(potentialDataFact);

	// category with highest value
	potentialDataFact = dataFactObject.getExtremeValueDataFactObject();
	potentialDataFact['extremeFunction'] = "MAX";
	potentialDataFact['primaryTargetObjectType'] = "category";
	potentialDataFact['primaryTargetObject'] = sortedDataList[listLength - 1][categoryAttr];
	potentialDataFact['tier'] = 1;
	potentialDataFact['content'] = sortedDataList[listLength - 1][categoryAttr] + 
		" (" + categoryAttr + ")" + " has the highest " + valueAttr + 
		" (" + sortedDataList[listLength - 1][valueAttr] + ")";
	potentialDataFact['attributes'] = [categoryAttr, valueAttr];
	potentialDataFact['keywords'] = highExtremeKeywords;

	potentialDataFacts.push(potentialDataFact);

	// category with second highest value
	potentialDataFact = dataFactObject.getExtremeValueDataFactObject();
	potentialDataFact['extremeFunction'] = "MAX";
	potentialDataFact['primaryTargetObjectType'] = "category";
	potentialDataFact['primaryTargetObject'] = sortedDataList[listLength - 2][categoryAttr];
	potentialDataFact['tier'] = 2;
	potentialDataFact['content'] = sortedDataList[listLength - 2][categoryAttr] + 
		" (" + categoryAttr + ")" + " has the second highest " + valueAttr + 
		" (" + sortedDataList[listLength - 2][valueAttr] + ")";
	potentialDataFact['attributes'] = [categoryAttr, valueAttr];
	potentialDataFact['keywords'] = highExtremeKeywords;

	potentialDataFacts.push(potentialDataFact);

	/*
	=====================
    RelativeValueDistributionFacts
  =====================
	*/

	if(listLength <= 100) { // ignoring computation of facts if this length is more than 25 since this increases time and size like crazy
    let relativeValueDistributionDiffThreshold = 1.5
    let relativeValueDistributionDiffList = []

    for(let i = 0; i < listLength - 1; i ++) {
			for(let j = i + 1; j < listLength; j++) {
				let sourceDataObj = sortedDataList[i];
				let targetDataObj = sortedDataList[j];
				let sourceVal = parseFloat(sourceDataObj[valueAttr]);
				let targetVal = parseFloat(targetDataObj[valueAttr]);

				if(sourceVal > 0) { // ignoring 0 values for now TODO: change logic if necessary
					let diffFactor = (targetVal - sourceVal) / sourceVal;
					if(diffFactor > relativeValueDistributionDiffThreshold) {
						relativeValueDistributionDiffList.push({
							sourceCategory: sourceDataObj[categoryAttr],
							targetCategory: targetDataObj[categoryAttr],
							diffFactor: diffFactor
						})
					}
				}
			}
		}

		relativeValueDistributionDiffList.sort((a,b) => 
			(a.diffFactor > b.diffFactor) ? 1 : ((b.diffFactor > a.diffFactor) ? -1 : 0));

		relativeValueDistributionDiffList.forEach((distributionDiffListObj, i) => {
			potentialDataFact = dataFactObject.getRelativeValueDataFactObject();
			potentialDataFact['primaryTargetObjectType'] = 'category';
      potentialDataFact['sourceCategory'] = distributionDiffListObj.sourceCategory;
      potentialDataFact['targetCategory'] = distributionDiffListObj.targetCategory;
      potentialDataFact['diffFactor'] = Math.round((distributionDiffListObj.diffFactor + 0.00001) * 100) / 100;
      potentialDataFact['tier'] = 3;
      potentialDataFact['attributes'] = [categoryAttr, valueAttr];
      potentialDataFact['keywords'] = distributionKeywords;
      potentialDataFact['content'] = "The " + valueAttr + " for " + 
      	potentialDataFact['targetCategory'] + " is " + potentialDataFact['diffFactor'] + 
      	" times of that for " + potentialDataFact['sourceCategory'];

      if(i == relativeValueDistributionDiffList.length - 1) {
      	potentialDataFact['tier'] = 1
      }

      else if(i == relativeValueDistributionDiffList.length - 2) {
				potentialDataFact['tier'] = 2
			}

      potentialDataFacts.push(potentialDataFact);
		});
  }

	/*
	=====================
  	DerivedValueFact : Overall Average
  =====================
  */

  // overall sum
  let sumAcrossCategories = 0;
	sortedDataList.forEach(dataObj => {
  	sumAcrossCategories += parseFloat(dataObj[valueAttr]);
  });
  sumAcrossCategories = Math.round((sumAcrossCategories + 0.00001) * 100) / 100;

	potentialDataFact = dataFactObject.getDerivedValueDataFactObject()
	potentialDataFact['primaryTargetObjectType'] = 'value'
	potentialDataFact['value'] = sumAcrossCategories;
	potentialDataFact['content'] = "Total " + valueAttr + " across all " + categoryAttr + "s is " + sumAcrossCategories;
	potentialDataFact['tier'] = 1;
	potentialDataFact['attributes'] = [categoryAttr, valueAttr];

	potentialDataFacts.push(potentialDataFact);

  // average across categories
  let avgAcrossCategories = 0;
  sortedDataList.forEach(dataObj => {
  	avgAcrossCategories += parseFloat(dataObj[valueAttr]);
  });
  avgAcrossCategories = Math.round((avgAcrossCategories / listLength + 0.00001) * 100) / 100;
  potentialDataFact = dataFactObject.getDerivedValueDataFactObject();
  potentialDataFact['primaryTargetObjectType'] = 'value';
  potentialDataFact['value'] = avgAcrossCategories;
  potentialDataFact['content'] = "Average " + valueAttr + " across all " + categoryAttr + "s is " + avgAcrossCategories;
  potentialDataFact['tier'] = 1;
  potentialDataFact['attributes'] = [categoryAttr, valueAttr];

  potentialDataFacts.push(potentialDataFact);
	
	return potentialDataFacts; 
}

function getDataFactsForScatterplot_QxQ(xAttr, yAttr, dataList) {
	let potentialDataFacts = [];
	let xValues = [];
	let yValues = [];
	let potentialDataFact;

	let newDataList = dataList.slice();
	newDataList = newDataList.filter(dataObj => dataObj[xAttr] !== "");
	newDataList = newDataList.filter(dataObj => dataObj[yAttr] !== "");
	newDataList.forEach(dataObj => {
		dataObj[xAttr] = parseFloat(dataObj[xAttr]);
		dataObj[yAttr] = parseFloat(dataObj[yAttr]);
	});

	let listLength = newDataList.length;

	let sortedDataList = newDataList.sort((a,b) => 
		(a[xAttr] > b[xAttr]) ? 1 : ((b[xAttr] > a[xAttr]) ? -1 : 0));
	let midXVal = (sortedDataList[listLength - 1][xAttr] + sortedDataList[0][xAttr]) / 2;

	sortedDataList = newDataList.sort((a,b) => 
		(a[yAttr] > b[yAttr]) ? 1 : ((b[yAttr] > a[yAttr]) ? -1 : 0));
	let midYVal = (sortedDataList[listLength - 1][yAttr] + sortedDataList[0][yAttr]) / 2;

	let groupMap = {
		Q1: 0,
		Q2: 0,
		Q3: 0,
		Q4: 0
	}

	newDataList.forEach(dataObj => {
		xValues.push(dataObj[xAttr]);
		yValues.push(dataObj[yAttr]);
	});

	let correlationCoef = Math.round((pearsonCorrelation(xValues, yValues) + 0.00001) * 100) / 100;

	if(correlationCoef <= -0.7) {
		potentialDataFact = dataFactObject.getCorrelationDataFactObject();
		potentialDataFact['primaryTargetObjectType'] = 'value';
		potentialDataFact['value'] = correlationCoef;
		potentialDataFact['tier'] = 1;
		potentialDataFact['content'] = "Overall, " + xAttr + " and " + yAttr + " have a strong inverse correlation";
		potentialDataFact['attributes'] = [xAttr, yAttr];
		potentialDataFact['keywords'] = correlationKeywords;

		potentialDataFacts.push(potentialDataFact);
	}
	else if(correlationCoef <= -0.5 && correlationCoef > -0.7) {
		potentialDataFact = dataFactObject.getCorrelationDataFactObject();
		potentialDataFact['primaryTargetObjectType'] = 'value';
		potentialDataFact['value'] = correlationCoef;
		potentialDataFact['tier'] = 2;
		potentialDataFact['content'] = "Overall, " + xAttr + " and " + yAttr + " have a moderate inverse correlation";
		potentialDataFact['attributes'] = [xAttr, yAttr];
		potentialDataFact['keywords'] = correlationKeywords;

		potentialDataFacts.push(potentialDataFact);
	}
	else if(correlationCoef >= 0.5 && correlationCoef < 0.7) {
		potentialDataFact = dataFactObject.getCorrelationDataFactObject();
		potentialDataFact['primaryTargetObjectType'] = 'value';
		potentialDataFact['value'] = correlationCoef;
		potentialDataFact['tier'] = 2;
		potentialDataFact['content'] = "Overall, " + xAttr + " and " + yAttr + " have a moderate correlation";
		potentialDataFact['attributes'] = [xAttr, yAttr];
		potentialDataFact['keywords'] = correlationKeywords;

		potentialDataFacts.push(potentialDataFact);
	}
	else if(correlationCoef >= 0.7) {
		potentialDataFact = dataFactObject.getCorrelationDataFactObject();
		potentialDataFact['primaryTargetObjectType'] = 'value';
		potentialDataFact['value'] = correlationCoef;
		potentialDataFact['tier'] = 1;
		potentialDataFact['content'] = "Overall, " + xAttr + " and " + yAttr + " have a strong correlation";
		potentialDataFact['attributes'] = [xAttr, yAttr];
		potentialDataFact['keywords'] = correlationKeywords;

		potentialDataFacts.push(potentialDataFact);
	}
	else {
		potentialDataFact = dataFactObject.getCorrelationDataFactObject();
		potentialDataFact['primaryTargetObjectType'] = 'value';
		potentialDataFact['value'] = correlationCoef;
		potentialDataFact['tier'] = 2;
		potentialDataFact['content'] = "Overall, " + xAttr + " and " + yAttr + " have no correlation";
		potentialDataFact['attributes'] = [xAttr, yAttr];
		potentialDataFact['keywords'] = correlationKeywords;

		potentialDataFacts.push(potentialDataFact);
	}

	return potentialDataFacts;
}

function getDataFactsForSizedScatterplot_QxQxQ(xAttr, yAttr, sizeAttr, dataList) {
	let potentialDataFacts = [];
	let potentialDataFact;

	let newDataList = dataList.slice();
	newDataList = newDataList.filter(dataObj => dataObj[xAttr] !== "");
	newDataList = newDataList.filter(dataObj => dataObj[yAttr] !== "");
	newDataList = newDataList.filter(dataObj => dataObj[sizeAttr] !== "");

	let listLength = newDataList.length;

	let groupMap = {
		Q1:{
			points:[],
			largeSizePoints:[],
			smallSizePoints:[]
		},
		Q2:{
			points:[],
			largeSizePoints:[],
			smallSizePoints:[]
		},
		Q3:{
			points:[],
			largeSizePoints:[],
			smallSizePoints:[]
		},
		Q4:{
			points:[],
			largeSizePoints:[],
			smallSizePoints:[]
		}
	}

	let sortedDataList = newDataList.sort((a,b) => 
		(a[xAttr] > b[xAttr]) ? 1 : ((b[xAttr] > a[xAttr]) ? -1 : 0));
	let midXVal = (parseFloat(sortedDataList[listLength - 1][xAttr]) + parseFloat(sortedDataList[0][xAttr])) / 2;

	sortedDataList = newDataList.sort((a,b) => 
		(a[yAttr] > b[yAttr]) ? 1 : ((b[yAttr] > a[yAttr]) ? -1 : 0));
	let midYVal = (parseFloat(sortedDataList[listLength - 1][yAttr]) + parseFloat(sortedDataList[0][yAttr])) / 2;

	sortedDataList = newDataList.sort((a,b) => 
		(a[sizeAttr] > b[sizeAttr]) ? 1 : ((b[sizeAttr] > a[sizeAttr]) ? -1 : 0));
	let midSizeVal = (parseFloat(sortedDataList[listLength - 1][sizeAttr]) + parseFloat(sortedDataList[0][sizeAttr])) / 2;

	newDataList.forEach(dataObj => {
		let xVal = dataObj[xAttr];
		let yVal = dataObj[yAttr];

		if(xVal <= midXVal && yVal <= midYVal) { // Q3
			groupMap.Q3.points.push(dataObj);
			if(dataObj[sizeAttr] >= midSizeVal) {
				groupMap.Q3.largeSizePoints.push(dataObj);
			}
			else if(dataObj[sizeAttr] <= midSizeVal) {
				groupMap.Q3.smallSizePoints.push(dataObj);
			}
		}
		else if(xVal <= midXVal && yVal > midYVal) { // Q2
			groupMap.Q2.points.push(dataObj);
			if(dataObj[sizeAttr] >= midSizeVal) {
				groupMap.Q2.largeSizePoints.push(dataObj);
			}
			else if(dataObj[sizeAttr] <= midSizeVal) {
				groupMap.Q2.smallSizePoints.push(dataObj);
			}
		}
		else if(xVal > midXVal && yVal > midYVal) { // Q1
			groupMap.Q1.points.push(dataObj);
			if(dataObj[sizeAttr] >= midSizeVal) {
				groupMap.Q1.largeSizePoints.push(dataObj);
			}
			else if(dataObj[sizeAttr] <= midSizeVal) {
				groupMap.Q1.smallSizePoints.push(dataObj);
			}
		}
		else if(xVal > midXVal && yVal <= midYVal) { // Q4
			groupMap.Q4.points.push(dataObj);
			if(dataObj[sizeAttr] >= midSizeVal) {
				groupMap.Q4.largeSizePoints.push(dataObj);
			}
			else if(dataObj[sizeAttr] <= midSizeVal) {
				groupMap.Q4.smallSizePoints.push(dataObj);
			}
		}
	});

	let groupCountThreshold = 0.7;
	if(groupMap.Q1.largeSizePoints.length / groupMap.Q1.points.length >= groupCountThreshold) {
		potentialDataFact = dataFactObject.getQuadrantDistributionDataFactObject();
		potentialDataFact['type'] = "QxQxQ_QuadrantDistributionFact";
		potentialDataFact['sizeFocus'] = 'large';
		potentialDataFact['primaryTargetObjectType'] = "valueList";
		potentialDataFact['primaryTargetObject'] = [midXVal, midYVal, midSizeVal];
		potentialDataFact['tier'] = 1;
		potentialDataFact['quadrant'] = 1;
		potentialDataFact['content'] = 'Most items with large ' + xAttr + ' and large ' + yAttr + ' also have large ' + sizeAttr;
		potentialDataFact['attributes'] = [xAttr, yAttr, sizeAttr];
		potentialDataFact['keywords'] = distributionKeywords;

		potentialDataFacts.push(potentialDataFact);
	}
	if(groupMap.Q2.largeSizePoints.length / groupMap.Q2.points.length >= groupCountThreshold) {
		potentialDataFact = dataFactObject.getQuadrantDistributionDataFactObject();
		potentialDataFact['type'] = "QxQxQ_QuadrantDistributionFact";
		potentialDataFact['sizeFocus'] = 'large';
		potentialDataFact['primaryTargetObjectType'] = "valueList";
		potentialDataFact['primaryTargetObject'] = [midXVal, midYVal, midSizeVal];
		potentialDataFact['tier'] = 1;
		potentialDataFact['quadrant'] = 2;
		potentialDataFact['content'] = 'Most items with small ' + xAttr + ' and large ' + yAttr + ' also have large ' + sizeAttr;
		potentialDataFact['attributes'] = [xAttr, yAttr, sizeAttr];
		potentialDataFact['keywords'] = distributionKeywords;

		potentialDataFacts.push(potentialDataFact);
	}
	if(groupMap.Q3.largeSizePoints.length / groupMap.Q3.points.length >= groupCountThreshold) {
		potentialDataFact = dataFactObject.getQuadrantDistributionDataFactObject();
		potentialDataFact['type'] = "QxQxQ_QuadrantDistributionFact";
		potentialDataFact['sizeFocus'] = 'large';
		potentialDataFact['primaryTargetObjectType'] = "valueList";
		potentialDataFact['primaryTargetObject'] = [midXVal, midYVal, midSizeVal];
		potentialDataFact['tier'] = 1;
		potentialDataFact['quadrant'] = 3;
		potentialDataFact['content'] = 'Most items with small ' + xAttr + ' and small ' + yAttr + ' also have large ' + sizeAttr;
		potentialDataFact['attributes'] = [xAttr, yAttr, sizeAttr];
		potentialDataFact['keywords'] = distributionKeywords;

		potentialDataFacts.push(potentialDataFact);
	}
	if(groupMap.Q4.largeSizePoints.length / groupMap.Q4.points.length >= groupCountThreshold) {
		potentialDataFact = dataFactObject.getQuadrantDistributionDataFactObject();
		potentialDataFact['type'] = "QxQxQ_QuadrantDistributionFact";
		potentialDataFact['sizeFocus'] = 'large';
		potentialDataFact['primaryTargetObjectType'] = "valueList";
		potentialDataFact['primaryTargetObject'] = [midXVal, midYVal, midSizeVal];
		potentialDataFact['tier'] = 1;
		potentialDataFact['quadrant'] = 4;
		potentialDataFact['content'] = 'Most items with large ' + xAttr + ' and small ' + yAttr + ' also have large ' + sizeAttr;
		potentialDataFact['attributes'] = [xAttr, yAttr, sizeAttr];
		potentialDataFact['keywords'] = distributionKeywords;

		potentialDataFacts.push(potentialDataFact);
	}
	if(groupMap.Q1.smallSizePoints.length / groupMap.Q1.points.length >= groupCountThreshold) {
		potentialDataFact = dataFactObject.getQuadrantDistributionDataFactObject();
		potentialDataFact['type'] = "QxQxQ_QuadrantDistributionFact";
		potentialDataFact['sizeFocus'] = 'small';
		potentialDataFact['primaryTargetObjectType'] = "valueList";
		potentialDataFact['primaryTargetObject'] = [midXVal, midYVal, midSizeVal];
		potentialDataFact['tier'] = 1;
		potentialDataFact['quadrant'] = 1;
		potentialDataFact['content'] = 'Most items with large ' + xAttr + ' and large ' + yAttr + ' also have small ' + sizeAttr;
		potentialDataFact['attributes'] = [xAttr, yAttr, sizeAttr];
		potentialDataFact['keywords'] = distributionKeywords;

		potentialDataFacts.push(potentialDataFact);
	}
	if(groupMap.Q2.smallSizePoints.length / groupMap.Q2.points.length >= groupCountThreshold) {
		potentialDataFact = dataFactObject.getQuadrantDistributionDataFactObject();
		potentialDataFact['type'] = "QxQxQ_QuadrantDistributionFact";
		potentialDataFact['sizeFocus'] = 'small';
		potentialDataFact['primaryTargetObjectType'] = "valueList";
		potentialDataFact['primaryTargetObject'] = [midXVal, midYVal, midSizeVal];
		potentialDataFact['tier'] = 1;
		potentialDataFact['quadrant'] = 2;
		potentialDataFact['content'] = 'Most items with small ' + xAttr + ' and large ' + yAttr + ' also have small ' + sizeAttr;
		potentialDataFact['attributes'] = [xAttr, yAttr, sizeAttr];
		potentialDataFact['keywords'] = distributionKeywords;

		potentialDataFacts.push(potentialDataFact);
	}
	if(groupMap.Q3.smallSizePoints.length / groupMap.Q3.points.length >= groupCountThreshold) {
		potentialDataFact = dataFactObject.getQuadrantDistributionDataFactObject();
		potentialDataFact['type'] = "QxQxQ_QuadrantDistributionFact";
		potentialDataFact['sizeFocus'] = 'small';
		potentialDataFact['primaryTargetObjectType'] = "valueList";
		potentialDataFact['primaryTargetObject'] = [midXVal, midYVal, midSizeVal];
		potentialDataFact['tier'] = 1;
		potentialDataFact['quadrant'] = 3;
		potentialDataFact['content'] = 'Most items with small ' + xAttr + ' and small ' + yAttr + ' also have small ' + sizeAttr;
		potentialDataFact['attributes'] = [xAttr, yAttr, sizeAttr];
		potentialDataFact['keywords'] = distributionKeywords;

		potentialDataFacts.push(potentialDataFact);
	}
	if(groupMap.Q4.smallSizePoints.length / groupMap.Q4.points.length >= groupCountThreshold) {
		potentialDataFact = dataFactObject.getQuadrantDistributionDataFactObject();
		potentialDataFact['type'] = "QxQxQ_QuadrantDistributionFact";
		potentialDataFact['sizeFocus'] = 'small';
		potentialDataFact['primaryTargetObjectType'] = "valueList";
		potentialDataFact['primaryTargetObject'] = [midXVal, midYVal, midSizeVal];
		potentialDataFact['tier'] = 1;
		potentialDataFact['quadrant'] = 4;
		potentialDataFact['content'] = 'Most items with large ' + xAttr + ' and small ' + yAttr + ' also have small ' + sizeAttr;
		potentialDataFact['attributes'] = [xAttr, yAttr, sizeAttr];
		potentialDataFact['keywords'] = distributionKeywords;

		potentialDataFacts.push(potentialDataFact);
	}

	return potentialDataFacts;
}

function getDataFactsForColoredScatterplot_QxQxN(xAttr, yAttr, colorAttr, dataList) {
	let potentialDataFacts = [];
	let potentialDataFact;

	let newDataList = dataList.slice();
	newDataList = newDataList.filter(dataObj => dataObj[xAttr] !== "");
	newDataList = newDataList.filter(dataObj => dataObj[yAttr] !== "");
	newDataList = newDataList.filter(dataObj => dataObj[colorAttr] !== "");
	newDataList.forEach(dataObj => {
		dataObj[xAttr] = parseFloat(dataObj[xAttr]);
		dataObj[yAttr] = parseFloat(dataObj[yAttr]);
	});

	let listLength = newDataList.length;

	let sortedDataList = newDataList.sort((a,b) => 
		(a[xAttr] > b[xAttr]) ? 1 : ((b[xAttr] > a[xAttr]) ? -1 : 0));
	let midXVal = (sortedDataList[listLength - 1][xAttr] + sortedDataList[0][xAttr]) / 2;

	sortedDataList = newDataList.sort((a,b) => 
		(a[yAttr] > b[yAttr]) ? 1 : ((b[yAttr] > a[yAttr]) ? -1 : 0));
	let midYVal = (sortedDataList[listLength - 1][yAttr] + sortedDataList[0][yAttr]) / 2;
	
	let xValues = [];
	let yValues = [];

	newDataList.forEach(dataObj => {
		xValues.push(dataObj[xAttr]);
		yValues.push(dataObj[yAttr]);
	});

	let correlationCoef = Math.round((pearsonCorrelation(xValues, yValues) + 0.00001) * 100) / 100;

	if(correlationCoef <= -0.7) {
		potentialDataFact = dataFactObject.getCorrelationDataFactObject();
		potentialDataFact['primaryTargetObjectType'] = 'value';
		potentialDataFact['value'] = correlationCoef;
		potentialDataFact['tier'] = 1;
		potentialDataFact['content'] = "Overall, " + xAttr + " and " + yAttr + " have a strong inverse correlation";
		potentialDataFact['attributes'] = [xAttr, yAttr, colorAttr];
		potentialDataFact['keywords'] = correlationKeywords;

		potentialDataFacts.push(potentialDataFact);
	}
	else if(correlationCoef <= -0.5 && correlationCoef > -0.7) {
		potentialDataFact = dataFactObject.getCorrelationDataFactObject();
		potentialDataFact['primaryTargetObjectType'] = 'value';
		potentialDataFact['value'] = correlationCoef;
		potentialDataFact['tier'] = 2;
		potentialDataFact['content'] = "Overall, " + xAttr + " and " + yAttr + " have a moderate inverse correlation";
		potentialDataFact['attributes'] = [xAttr, yAttr, colorAttr];
		potentialDataFact['keywords'] = correlationKeywords;

		potentialDataFacts.push(potentialDataFact);
	}
	else if(correlationCoef >= 0.5 && correlationCoef < 0.7) {
		potentialDataFact = dataFactObject.getCorrelationDataFactObject();
		potentialDataFact['primaryTargetObjectType'] = 'value';
		potentialDataFact['value'] = correlationCoef;
		potentialDataFact['tier'] = 2;
		potentialDataFact['content'] = "Overall, " + xAttr + " and " + yAttr + " have a moderate correlation";
		potentialDataFact['attributes'] = [xAttr, yAttr, colorAttr];
		potentialDataFact['keywords'] = correlationKeywords;

		potentialDataFacts.push(potentialDataFact);
	}
	else if(correlationCoef >= 0.7) {
		potentialDataFact = dataFactObject.getCorrelationDataFactObject();
		potentialDataFact['primaryTargetObjectType'] = 'value';
		potentialDataFact['value'] = correlationCoef;
		potentialDataFact['tier'] = 1;
		potentialDataFact['content'] = "Overall, " + xAttr + " and " + yAttr + " have a strong correlation";
		potentialDataFact['attributes'] = [xAttr, yAttr, colorAttr];
		potentialDataFact['keywords'] = correlationKeywords;

		potentialDataFacts.push(potentialDataFact);
	}
	else {
		potentialDataFact = dataFactObject.getCorrelationDataFactObject();
		potentialDataFact['primaryTargetObjectType'] = 'value';
		potentialDataFact['value'] = correlationCoef;
		potentialDataFact['tier'] = 2;
		potentialDataFact['content'] = "Overall, " + xAttr + " and " + yAttr + " have no correlation";
		potentialDataFact['attributes'] = [xAttr, yAttr, colorAttr];
		potentialDataFact['keywords'] = correlationKeywords;

		potentialDataFacts.push(potentialDataFact);
	}

	return potentialDataFacts;
}

function getDataFactsForMultiSeriesLineChart_NxQxN(xAttr, yAttr, colorAttr, dataList) {
	let potentialDataFacts = [];
	let potentialDataFact;
	let dataHash = {};

	dataList.forEach(dataObj => {
		if(dataHash[dataObj[xAttr]] === undefined) {
			dataHash[dataObj[xAttr]] = {};
		}
		if(dataHash[dataObj[xAttr]][dataObj[colorAttr]] === undefined) {
			dataHash[dataObj[xAttr]][dataObj[colorAttr]] = 0;
		}
		dataObj[yAttr] = parseFloat(dataObj[yAttr]);
		dataHash[dataObj[xAttr]][dataObj[colorAttr]] += dataObj[yAttr];
	});

	let newDataList = [];
	Object.keys(dataHash).forEach(x => {
		Object.keys(dataHash[x]).forEach(color => {
			let newDataItem = {};
			newDataItem[xAttr] = x;
			newDataItem[colorAttr] = color;
			newDataItem[yAttr] = dataHash[x][color];
			newDataList.push(newDataItem);
		});
	});

	newDataList = newDataList.filter(dataObj => dataObj[xAttr] !== "");
	newDataList = newDataList.filter(dataObj => dataObj[yAttr] !== "");
	newDataList = newDataList.filter(dataObj => dataObj[colorAttr] !== "");


	let sortedDataList = newDataList.sort((a,b) => 
		(a[yAttr] > b[yAttr]) ? 1 : ((b[yAttr] > a[yAttr]) ? -1 : 0));

	let listLength = newDataList.length;

	// category with lowest value
	potentialDataFact = dataFactObject.getExtremeValueDataFactObject();
	potentialDataFact['extremeFunction'] = "MIN";
	potentialDataFact['primaryTargetObjectType'] = "item";
	potentialDataFact['secondaryTargetObjectType'] = "category";
	potentialDataFact['primaryTargetObject'] = sortedDataList[0][colorAttr];
	potentialDataFact['secondaryTargetObject'] = sortedDataList[0][xAttr];
	potentialDataFact['tier'] = 1;
	potentialDataFact['content'] = sortedDataList[0][colorAttr] + 
		" (" + colorAttr + ")" + " has the lowest " + yAttr + 
		" (" + sortedDataList[0][yAttr] + ") for " + 
		sortedDataList[0][xAttr] + " (" + xAttr + ")";
	potentialDataFact['attributes'] = [xAttr, yAttr, colorAttr];
	potentialDataFact['keywords'] = lowExtremeKeywords;
	potentialDataFact['legendAttribute'] = colorAttr;
	potentialDataFact['legendAttributeObject'] = sortedDataList[0][colorAttr];

	potentialDataFacts.push(potentialDataFact);

	// category with second lowest value
	potentialDataFact = dataFactObject.getExtremeValueDataFactObject();
	potentialDataFact['extremeFunction'] = "MIN";
	potentialDataFact['primaryTargetObjectType'] = "item";
	potentialDataFact['secondaryTargetObjectType'] = "category";
	potentialDataFact['primaryTargetObject'] = sortedDataList[1][colorAttr];
	potentialDataFact['secondaryTargetObject'] = sortedDataList[1][xAttr];
	potentialDataFact['tier'] = 2;
	potentialDataFact['content'] = sortedDataList[1][colorAttr] + 
		" (" + colorAttr + ")" + " has the second lowest " + yAttr + 
		" (" + sortedDataList[1][yAttr] + ") for " + 
		sortedDataList[1][xAttr] + " (" + xAttr + ")";
	potentialDataFact['attributes'] = [xAttr, yAttr, colorAttr];
	potentialDataFact['keywords'] = lowExtremeKeywords;
	potentialDataFact['legendAttribute'] = colorAttr;
	potentialDataFact['legendAttributeObject'] = sortedDataList[1][colorAttr];

	potentialDataFacts.push(potentialDataFact);

	// category with highest value
	potentialDataFact = dataFactObject.getExtremeValueDataFactObject();
	potentialDataFact['extremeFunction'] = "MAX";
	potentialDataFact['primaryTargetObjectType'] = "item";
	potentialDataFact['secondaryTargetObjectType'] = "category";
	potentialDataFact['primaryTargetObject'] = sortedDataList[listLength - 1][colorAttr];
	potentialDataFact['secondaryTargetObject'] = sortedDataList[listLength - 1][xAttr];
	potentialDataFact['tier'] = 1;
	potentialDataFact['content'] = sortedDataList[listLength - 1][colorAttr] + 
		" (" + colorAttr + ")" + " has the highest " + yAttr + 
		" (" + sortedDataList[listLength - 1][yAttr] + ") for " + 
		sortedDataList[listLength - 1][xAttr] + " (" + xAttr + ")";
	potentialDataFact['attributes'] = [xAttr, yAttr, colorAttr];
	potentialDataFact['keywords'] = highExtremeKeywords;
	potentialDataFact['legendAttribute'] = colorAttr;
	potentialDataFact['legendAttributeObject'] = sortedDataList[listLength - 1][colorAttr];

	potentialDataFacts.push(potentialDataFact);

	// category with second highest value
	potentialDataFact = dataFactObject.getExtremeValueDataFactObject();
	potentialDataFact['extremeFunction'] = "MAX";
	potentialDataFact['primaryTargetObjectType'] = "item";
	potentialDataFact['secondaryTargetObjectType'] = "category";
	potentialDataFact['primaryTargetObject'] = sortedDataList[listLength - 2][colorAttr];
	potentialDataFact['secondaryTargetObject'] = sortedDataList[listLength - 2][xAttr];
	potentialDataFact['tier'] = 2;
	potentialDataFact['content'] = sortedDataList[listLength - 2][colorAttr] + 
		" (" + colorAttr + ")" + " has the second highest " + yAttr + 
		" (" + sortedDataList[listLength - 2][yAttr] + ") for " + 
		sortedDataList[listLength - 2][xAttr] + " (" + xAttr + ")";
	potentialDataFact['attributes'] = [xAttr, yAttr, colorAttr];
	potentialDataFact['keywords'] = highExtremeKeywords;
	potentialDataFact['legendAttribute'] = colorAttr;
	potentialDataFact['legendAttributeObject'] = sortedDataList[listLength - 2][colorAttr];

	potentialDataFacts.push(potentialDataFact);

	return potentialDataFacts;
}

function getCommonDataFactsForSizeHeatmapAndColorHeatmap_NxNxQ(xAttr, yAttr, colorAttr, dataList) {
	let potentialDataFacts = [];
	let potentialDataFact;
	let dataHash = {};

	dataList.forEach(dataObj => {
		if(dataHash[dataObj[xAttr]] === undefined) {
			dataHash[dataObj[xAttr]] = {};
		}
		if(dataHash[dataObj[xAttr]][dataObj[yAttr]] === undefined) {
			dataHash[dataObj[xAttr]][dataObj[yAttr]] = 0;
		}
		dataObj[colorAttr] = parseFloat(dataObj[colorAttr]);
		dataHash[dataObj[xAttr]][dataObj[yAttr]] += dataObj[colorAttr];
	});

	let newDataList = [];
	Object.keys(dataHash).forEach(x => {
		Object.keys(dataHash[x]).forEach(y => {
			let newDataItem = {};
			newDataItem[xAttr] = x;
			newDataItem[yAttr] = y;
			newDataItem[colorAttr] = dataHash[x][y];
			newDataList.push(newDataItem);
		});
	});

	newDataList = newDataList.filter(dataObj => dataObj[xAttr] !== "");
	newDataList = newDataList.filter(dataObj => dataObj[yAttr] !== "");
	newDataList = newDataList.filter(dataObj => dataObj[colorAttr] !== "");


	let sortedDataList = newDataList.sort((a,b) => 
		(a[colorAttr] > b[colorAttr]) ? 1 : ((b[colorAttr] > a[colorAttr]) ? -1 : 0));

	let listLength = newDataList.length;

	// category with lowest value
	potentialDataFact = dataFactObject.getExtremeValueDataFactObject();
	potentialDataFact['extremeFunction'] = "MIN";
	potentialDataFact['primaryTargetObjectType'] = "category";
	potentialDataFact['secondaryTargetObjectType'] = "category";
	potentialDataFact['primaryTargetObject'] = sortedDataList[0][xAttr];
	potentialDataFact['secondaryTargetObject'] = sortedDataList[0][yAttr];
	potentialDataFact['tier'] = 1;
	potentialDataFact['content'] = "Itmes with " + sortedDataList[0][xAttr] + 
		" (" + xAttr + ") and " + sortedDataList[0][yAttr] + " (" + yAttr + ")" +
		" has the lowest " + colorAttr + " (" + sortedDataList[0][colorAttr] + ")";
	potentialDataFact['attributes'] = [xAttr, yAttr, colorAttr];
	potentialDataFact['keywords'] = lowExtremeKeywords;

	potentialDataFacts.push(potentialDataFact);

	// category with second lowest value
	potentialDataFact = dataFactObject.getExtremeValueDataFactObject();
	potentialDataFact['extremeFunction'] = "MIN";
	potentialDataFact['primaryTargetObjectType'] = "category";
	potentialDataFact['secondaryTargetObjectType'] = "category";
	potentialDataFact['primaryTargetObject'] = sortedDataList[1][xAttr];
	potentialDataFact['secondaryTargetObject'] = sortedDataList[1][yAttr];
	potentialDataFact['tier'] = 2;
	potentialDataFact['content'] = "Itmes with " + sortedDataList[1][xAttr] + 
		" (" + xAttr + ") and " + sortedDataList[1][yAttr] + " (" + yAttr + ")" +
		" has the second lowest " + colorAttr + " (" + sortedDataList[1][colorAttr] + ")";
	potentialDataFact['attributes'] = [xAttr, yAttr, colorAttr];
	potentialDataFact['keywords'] = lowExtremeKeywords;

	potentialDataFacts.push(potentialDataFact);

	// category with highest value
	potentialDataFact = dataFactObject.getExtremeValueDataFactObject();
	potentialDataFact['extremeFunction'] = "MAX";
	potentialDataFact['primaryTargetObjectType'] = "category";
	potentialDataFact['secondaryTargetObjectType'] = "category";
	potentialDataFact['primaryTargetObject'] = sortedDataList[listLength - 1][xAttr];
	potentialDataFact['secondaryTargetObject'] = sortedDataList[listLength - 1][yAttr];
	potentialDataFact['tier'] = 1;
	potentialDataFact['content'] = "Itmes with " + sortedDataList[listLength - 1][xAttr] + 
		" (" + xAttr + ") and " + sortedDataList[listLength - 1][yAttr] + " (" + yAttr + ")" +
		" has the highest " + colorAttr + " (" + sortedDataList[listLength - 1][colorAttr] + ")";
	potentialDataFact['attributes'] = [xAttr, yAttr, colorAttr];
	potentialDataFact['keywords'] = highExtremeKeywords;

	potentialDataFacts.push(potentialDataFact);

	// category with second highest value
	potentialDataFact = dataFactObject.getExtremeValueDataFactObject();
	potentialDataFact['extremeFunction'] = "MAX";
	potentialDataFact['primaryTargetObjectType'] = "category";
	potentialDataFact['secondaryTargetObjectType'] = "category";
	potentialDataFact['primaryTargetObject'] = sortedDataList[listLength - 2][xAttr];
	potentialDataFact['secondaryTargetObject'] = sortedDataList[listLength - 2][yAttr];
	potentialDataFact['tier'] = 2;
	potentialDataFact['content'] = "Itmes with " + sortedDataList[listLength - 2][xAttr] + 
		" (" + xAttr + ") and " + sortedDataList[listLength - 2][yAttr] + " (" + yAttr + ")" +
		" has the second highest " + colorAttr + " (" + sortedDataList[listLength - 2][colorAttr] + ")";
	potentialDataFact['attributes'] = [xAttr, yAttr, colorAttr];
	potentialDataFact['keywords'] = highExtremeKeywords;

	potentialDataFacts.push(potentialDataFact);

	return potentialDataFacts;
}