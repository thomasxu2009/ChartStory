export default function getDataFactsCorrelation(arg) {
	let dataFactsCorrelation = [];

	let options = arg || {},
			firstChartDataFacts = options.firstChartDataFacts.slice(),
			secondChartDataFacts = options.secondChartDataFacts.slice();

	if(firstChartDataFacts.length == 0) {
		return [];
	} else if(secondChartDataFacts.length == 0) {
		//sum
    let tierCoefficient = 4;
    
    firstChartDataFacts.forEach(dataFact => {
    	dataFact.interestingness = tierCoefficient * (1 / dataFact.tier);
    });

		dataFactsCorrelation = firstChartDataFacts;
		return dataFactsCorrelation;
	} else {
		let firstLength = firstChartDataFacts.length;
		let secondLength = secondChartDataFacts.length;

		//type
    let typeMatrix = [];
    for(let index = 0; index < firstLength; index++) {
      let arr;
      (arr = []).length = secondLength;
      arr.fill(0.0);
      typeMatrix.push(arr);
    }
    for(let indexI = 0; indexI < firstLength; indexI++) {
    	for(let indexJ = 0; indexJ < secondLength; indexJ++) {
    		typeMatrix[indexI][indexJ] = compareDataFactsType(firstChartDataFacts[indexI], secondChartDataFacts[indexJ]);
    	}
    }
    for(let indexI = 0; indexI < firstLength; indexI++) {
    	let sum = 0;
    	for(let indexJ = 0; indexJ < secondLength; indexJ++) {
    		sum += typeMatrix[indexI][indexJ];
    	}
    	firstChartDataFacts[indexI].typeInterestingness = sum / secondLength;
    }
    for(let indexJ = 0; indexJ < secondLength; indexJ++) {
    	let sum = 0;
    	for(let indexI = 0; indexI < firstLength; indexI++) {
    		sum += typeMatrix[indexI][indexJ];
    	}
    	secondChartDataFacts[indexJ].typeInterestingness = sum / firstLength;
    }

    //attribute
    let attributeMatrix = [];
    for(let index = 0; index < firstLength; index++) {
      let arr;
      (arr = []).length = secondLength;
      arr.fill(0.0);
      attributeMatrix.push(arr);
    }
    for(let indexI = 0; indexI < firstLength; indexI++) {
    	for(let indexJ = 0; indexJ < secondLength; indexJ++) {
    		attributeMatrix[indexI][indexJ] = compareDataFactsAttribute(firstChartDataFacts[indexI], secondChartDataFacts[indexJ]);
    	}
    }
    for(let indexI = 0; indexI < firstLength; indexI++) {
    	let sum = 0;
    	for(let indexJ = 0; indexJ < secondLength; indexJ++) {
    		sum += attributeMatrix[indexI][indexJ];
    	}
    	firstChartDataFacts[indexI].attributeInterestingness = sum / secondLength;
    }
    for(let indexJ = 0; indexJ < secondLength; indexJ++) {
    	let sum = 0;
    	for(let indexI = 0; indexI < firstLength; indexI++) {
    		sum += attributeMatrix[indexI][indexJ];
    	}
    	secondChartDataFacts[indexJ].attributeInterestingness = sum / firstLength;
    }

    //sum
    let typeCoefficient = 1;
    let attributeCoefficient = 1;
    let tierCoefficient = 2;
    
    firstChartDataFacts.forEach(dataFact => {
    	dataFact.interestingness = typeCoefficient * dataFact.typeInterestingness 
    														+ attributeCoefficient * dataFact.attributeInterestingness 
    														+ tierCoefficient * (1 / dataFact.tier);
    });

		dataFactsCorrelation = firstChartDataFacts;
		return dataFactsCorrelation;
	}
}

function compareDataFactsType(dataFactOne, dataFactTwo) {
	return dataFactOne.type == dataFactTwo.type;
}

function compareDataFactsAttribute(dataFactOne, dataFactTwo) {
	let attributeSetOne = new Set(dataFactOne.attributes);
	let attributeSetTwo = new Set(dataFactTwo.attributes);
	let union = new Set([...attributeSetOne, ...attributeSetTwo]);
	let intersection = new Set(
    [...attributeSetOne].filter(x => attributeSetTwo.has(x)));
	return intersection.size / union.size;
}