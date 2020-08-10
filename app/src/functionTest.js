let similarityMatrix = [
												[0.001, 2, 3, 4],
												[2, 0.001, 7, 5],
												[3, 7, 0.001, 6],
												[4, 5, 6, 0.001]
												];

let nodeList = [];
similarityMatrix.forEach((d, i) => {
	nodeList.push({
		elem: [i]
	});
});

let relationMatrix = similarityMatrix.map(arr => {
	return arr.slice();
});

let newMatrix = removeOldEdges(relationMatrix, 0, 1);
nodeList.splice(1, 1);
nodeList.splice(0, 1);

let newNode = {elem: [0, 1]};
newMatrix = buildNewMatrix(similarityMatrix, newMatrix, nodeList, newNode);
nodeList.push(newNode);

newMatrix = removeOldEdges(newMatrix, 0, 1);
nodeList.splice(1, 1);
nodeList.splice(0, 1);

newNode = {elem: [2, 3]};
newMatrix = buildNewMatrix(similarityMatrix, newMatrix, nodeList, newNode);
nodeList.push(newNode);

// console.log(newMatrix);
// console.log(nodeList);

// console.log(calculateSimilarity(similarityMatrix, nodeA, nodeB));

function removeOldEdges(oldMatrix, index1, index2) {
  let copyMatrix = oldMatrix.map(function(arr) {
    return arr.slice();
  });
  let firstIndex = index1 < index2 ? index1 : index2;
  let secondIndex = index2 < index1 ? index1 : index2;
  copyMatrix.forEach(d => {
    d.splice(secondIndex, 1);
    d.splice(firstIndex, 1);
  });
  copyMatrix.splice(secondIndex, 1);
  copyMatrix.splice(firstIndex, 1);
  return copyMatrix;
}

function buildNewMatrix(similarityMatrix, oldMatrix, nodeList, newNode) {
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