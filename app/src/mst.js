export default function mst(arg) {
	"use strict";

	let options = arg || {},
			arrayOfCharts = options.arrayOfCharts || [],
			matrix = options.matrix || [];

	let mst = {};
	mst.findTheRoot = function(node) {
	  if(node.parent != null) {
	    return mst.findTheRoot(node.parent);
	  } else {
	    return node;
	  }
	}
	mst.reverseTree = function(node) {
		if(node.parent !== null) {
			node.parent.children.forEach((d, i) => {
				if(d === node) {
					node.parent.children.splice(i, 1);
				}
			});
			node.children.push(node.parent);
			mst.reverseTree(node.parent);
			node.parent.parent = node;
			node.parent = null;
		}
	}

	let nodeList = [];
	let numOfNode = arrayOfCharts.length;
  for(let index = 0; index < numOfNode; index++) {
  	nodeList.push({
			name: arrayOfCharts[index].fileName,
			parent: null,
			children: [],
			groupSize: 1,
			chartInfo: arrayOfCharts[index].chartInfo
		});
  }

  let edgeArray = [];
  for(let indexI = 0; indexI < numOfNode - 1; indexI++) {
    for(let indexJ = indexI + 1; indexJ < numOfNode; indexJ++) {
      edgeArray.push({
        startNode: nodeList[indexI],
        endNode: nodeList[indexJ],
        edgeWeight: matrix[indexI][indexJ]
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
  
  let edgeList = [];
  let numOfEdge = edgeArray.length;
  for(let index = 0; index < numOfEdge; index++) {
    let startNode = edgeArray[index].startNode;
    let endNode = edgeArray[index].endNode;
    let rootOfStartNode = mst.findTheRoot(startNode, 0);
    let rootOfEndNode = mst.findTheRoot(endNode, 0);
    if(rootOfStartNode != rootOfEndNode) {
      if(rootOfStartNode.groupSize >= rootOfEndNode.groupSize) {
      	rootOfStartNode.groupSize += rootOfEndNode.groupSize;
      	mst.reverseTree(endNode);
    		endNode.parent = startNode;
      	startNode.children.push(endNode);
    		edgeList.push(edgeArray[index]);
      } else {
      	rootOfEndNode.groupSize += rootOfStartNode.groupSize;
      	mst.reverseTree(startNode);
    		startNode.parent = endNode;
      	endNode.children.push(startNode);
    		edgeList.push(edgeArray[index]);
      }
    }
  }

  mst.mst = mst.findTheRoot(nodeList[0]);
  mst.nodeList = nodeList;
  mst.edgeList = edgeList;

  return mst;
}