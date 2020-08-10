export default function averageLinkage(arg) {
	"use strict";

	let options = arg || {},
			similarityMatrix = options.similarityMatrix || [],
			relationMatrix = options.relationMatrix || [],
			nodeList = options.nodeList || [],
			sizeThreshold = options.sizeThreshold || 1000,
			edgeWeightThreshold = options.edgeWeightThreshold || 1000;

	let numOfNode = nodeList.length;

	let edgeArray = [];
	for(let indexI = 0; indexI < numOfNode - 1; indexI++) {
		for(let indexJ = indexI + 1; indexJ < numOfNode; indexJ++) {
			edgeArray.push({
				startNode: indexI,
				endNode: indexJ,
				edgeWeight: relationMatrix[indexI][indexJ]
			});
		}
	}

	edgeArray.sort((a, b) => {
		if (a.edgeWeight < b.edgeWeight)
			return -1;
		if (a.edgeWeight > b.edgeWeight)
			return 1;
		return 0;
	});

	let groupHash = {};
  let groupSet = new Set();
  let edgeList = [];
  let numOfEdge = edgeArray.length;
  for(let index = 0; index < numOfEdge; index++) {
  	if(edgeArray[index].edgeWeight > edgeWeightThreshold) {
  		break;
  	}
  	let startNodeIndex = edgeArray[index].startNode;
  	let endNodeIndex = edgeArray[index].endNode;
  	let startNodeElem = nodeList[startNodeIndex].elem.slice();
    let endNodeElem = nodeList[endNodeIndex].elem.slice();
    if(startNodeElem.length + endNodeElem.length <= sizeThreshold) {
    	let newMatrix = removeOldEdges(relationMatrix, startNodeIndex, endNodeIndex);
			nodeList.splice(endNodeIndex, 1);
			nodeList.splice(startNodeIndex, 1);

			let newNode = {elem: startNodeElem.concat(endNodeElem)};
			newMatrix = buildNewMatrix(similarityMatrix, newMatrix, nodeList, newNode);
			nodeList.push(newNode);
			return averageLinkage({
				similarityMatrix: similarityMatrix,
				relationMatrix: newMatrix,
				nodeList: nodeList,
				sizeThreshold: sizeThreshold,
				edgeWeightThreshold: edgeWeightThreshold
			});
    }
  }
  return nodeList.map(arr => arr.elem);
}

function removeOldEdges(oldMatrix, index1, index2) {
	let copyMatrix = oldMatrix.map(function(arr) {
		return arr.slice();
	});
	copyMatrix.forEach(d => {
		d.splice(index2, 1);
		d.splice(index1, 1);
	});
	copyMatrix.splice(index2, 1);
	copyMatrix.splice(index1, 1);
	return copyMatrix;
}

function buildNewMatrix(similarityMatrix, oldMatrix, nodeList, newNode) {
	if(oldMatrix.length == 0) {
		return [[0.001]];
	}
	let copyMatrix = oldMatrix.map(function(arr) {
		return arr.slice();
	});
	copyMatrix.forEach(d => {
		d.push(0.001);
	});
	copyMatrix.push(copyMatrix[0].slice());
	let lastIndex = copyMatrix.length - 1;
	for(let index = 0; index < lastIndex; index++) {
		copyMatrix[index][lastIndex] = calculateSimilarity(similarityMatrix, nodeList[index], newNode);
	}
	for(let index = 0; index < lastIndex; index++) {
		copyMatrix[lastIndex][index] = copyMatrix[index][lastIndex];
	}
	return copyMatrix;
}

function calculateSimilarity(similarityMatrix, nodeA, nodeB) {
	let similaritySum = 0;
	nodeA.elem.forEach(index1 => {
		nodeB.elem.forEach(index2 => {
			similaritySum += similarityMatrix[index1][index2];
		});
	});
	return similaritySum / (nodeA.elem.length * nodeB.elem.length);
}