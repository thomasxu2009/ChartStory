import mst 						from '../mst';
import singleLinkage 	from './singleLinkage';
import averageLinkage from './averageLinkage';

export default function hac(arg) {
	"use strict";

	let options = arg || {},
			arrayOfCharts = options.arrayOfCharts || [],
			matrix = options.matrix || [],
			sizeThreshold = options.sizeThreshold || 1000,
			edgeWeightThreshold = options.edgeWeightThreshold || 1000,
			linkageCriteria = options.linkageCriteria || "noLinkage";

	let similarityMatrix = matrix.map(arr => {
		return arr.slice();
	});

	let nodeList = [];
	let numOfNode = arrayOfCharts.length;
	for(let index = 0; index < numOfNode; index++) {
  	nodeList.push({
			elem: [index]
		});
	}

	if(linkageCriteria == "singleLinkage") {
		let groupList = singleLinkage({
			similarityMatrix: similarityMatrix,
			nodeList: nodeList,
			sizeThreshold: sizeThreshold,
			edgeWeightThreshold: edgeWeightThreshold
		});

		groupList.sort();

		return groupList.map(arr => {
			return mst({
				arrayOfCharts: arr.map(d => { return arrayOfCharts[d]; }),
				matrix: getNewSimilarityMatrix(similarityMatrix, arr)
			});
		});

	} else if(linkageCriteria == "averageLinkage") {
		let relationMatrix = similarityMatrix.map(arr => {
			return arr.slice();
		});

		let groupList = averageLinkage({
			similarityMatrix: similarityMatrix,
			relationMatrix: relationMatrix,
			nodeList: nodeList,
			sizeThreshold: sizeThreshold,
			edgeWeightThreshold: edgeWeightThreshold
		});

		groupList.forEach(d => {
			d.sort((a, b) => {
				if (a < b)
		      return -1;
		    if (a > b)
		      return 1;
		    return 0;
			});
		});

		groupList.sort();

		return groupList.map(arr => {
			return mst({
				arrayOfCharts: arr.map(d => { return arrayOfCharts[d]; }),
				matrix: getNewSimilarityMatrix(similarityMatrix, arr)
			});
		});

	} else {
		return [mst({
			arrayOfCharts: arrayOfCharts,
			matrix: similarityMatrix
  	})];
	}
}

function getNewSimilarityMatrix(similarityMatrix, array) {
	let matrix = [];

  for(let index = 0; index < array.length; index++) {
    let arr;
    (arr = []).length = array.length;
    arr.fill(0.001);
    matrix.push(arr);
  }

  for(let indexI = 0; indexI < array.length; indexI++) {
  	for(let indexJ = 0; indexJ < array.length; indexJ++) {
  		matrix[indexI][indexJ] = similarityMatrix[array[indexI]][array[indexJ]];
  	}
  }

  return matrix;
}