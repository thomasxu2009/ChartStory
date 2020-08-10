export default function singleLinkage(arg) {
	"use strict";

	let options = arg || {},
			similarityMatrix = options.similarityMatrix || [],
			nodeList = options.nodeList || [],
			sizeThreshold = options.sizeThreshold || 1000,
			edgeWeightThreshold = options.edgeWeightThreshold || 1000;

	let numOfNode = nodeList.length;

  let edgeArray = [];
  for(let indexI = 0; indexI < numOfNode - 1; indexI++) {
    for(let indexJ = indexI + 1; indexJ < numOfNode; indexJ++) {
      edgeArray.push({
        startNode: nodeList[indexI].elem[0],
        endNode: nodeList[indexJ].elem[0],
        edgeWeight: similarityMatrix[indexI][indexJ]
      });
    }
  }

  if(edgeArray.length == 0) {
    return [[nodeList[0].elem[0]]];
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
    let startNode = edgeArray[index].startNode;
    let endNode = edgeArray[index].endNode;

    if(groupHash[startNode] == undefined) {
      groupHash[startNode] = [startNode];
      groupSet.add(groupHash[startNode]);
    }
    if(groupHash[endNode] == undefined) {
      groupHash[endNode] = [endNode];
      groupSet.add(groupHash[endNode]);
    }
  	if(edgeArray[index].edgeWeight > edgeWeightThreshold) {
  		break;
  	}
    if(groupHash[startNode] != groupHash[endNode]) {
    	if(groupHash[startNode].length + groupHash[endNode].length <= sizeThreshold) {
        groupSet.delete(groupHash[startNode]);
        groupSet.delete(groupHash[endNode]);
      	groupHash[startNode] = groupHash[startNode].concat(groupHash[endNode]);
      	groupHash[startNode].forEach(d => {
          groupHash[d] = groupHash[startNode];
        }); 
        groupSet.add(groupHash[startNode]);
    		edgeList.push(edgeArray[index]);
    	}
    }
  }

  return [...groupSet];
}