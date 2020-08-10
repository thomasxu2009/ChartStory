import getDataFactsCorrelation from './getDataFactsCorrelation';

export default function sortDataFacts(arg) {
	let sortedDataFacts = [];

	let options = arg || {},
			originalTargetChartDataFacts = options.targetChartDataFacts,
			originalFirstRelatedChartDataFacts = options.firstRelatedChartDataFacts || [],
			originalSecondRelatedChartDataFacts = options.secondRelatedChartDataFacts || [],
			originalThirdRelatedChartDataFacts = options.thirdRelatedChartDataFacts || [];

	let targetChartDataFacts = originalTargetChartDataFacts.slice();
	let firstRelatedChartDataFacts = originalFirstRelatedChartDataFacts.slice();
	let secondRelatedChartDataFacts = originalSecondRelatedChartDataFacts.slice();
	let thirdRelatedChartDataFacts = originalThirdRelatedChartDataFacts.slice();

	if(targetChartDataFacts.length == 0) {
		sortedDataFacts = [];
	} else if(firstRelatedChartDataFacts.length == 0) {
		let targetToFirstDataFactsCorrelation = getDataFactsCorrelation({
			firstChartDataFacts: targetChartDataFacts,
			secondChartDataFacts: []
		});
		sortedDataFacts = targetToFirstDataFactsCorrelation.sort((a,b) => 
			(a.interestingness < b.interestingness) ? 1 : ((b.interestingness < a.interestingness) ? -1 : 0));
	} else if(secondRelatedChartDataFacts.length == 0) {
		let targetToFirstDataFactsCorrelation = getDataFactsCorrelation({
			firstChartDataFacts: targetChartDataFacts,
			secondChartDataFacts: firstRelatedChartDataFacts
		});
		sortedDataFacts = targetToFirstDataFactsCorrelation.sort((a,b) => 
			(a.interestingness < b.interestingness) ? 1 : ((b.interestingness < a.interestingness) ? -1 : 0));
	} else if(thirdRelatedChartDataFacts.length == 0) {
		let targetToFirstDataFactsCorrelation = getDataFactsCorrelation({
			firstChartDataFacts: targetChartDataFacts,
			secondChartDataFacts: firstRelatedChartDataFacts
		});
		let targetToSecondDataFactsCorrelation = getDataFactsCorrelation({
			firstChartDataFacts: targetChartDataFacts,
			secondChartDataFacts: secondRelatedChartDataFacts
		});
		targetToFirstDataFactsCorrelation.forEach((dataFact, i) => {
			dataFact.interestingness += targetToSecondDataFactsCorrelation[i].interestingness;
		});
		sortedDataFacts = targetToFirstDataFactsCorrelation.sort((a,b) => 
			(a.interestingness < b.interestingness) ? 1 : ((b.interestingness < a.interestingness) ? -1 : 0));
	} else {
		let targetToFirstDataFactsCorrelation = getDataFactsCorrelation({
			firstChartDataFacts: targetChartDataFacts,
			secondChartDataFacts: firstRelatedChartDataFacts
		});
		let targetToSecondDataFactsCorrelation = getDataFactsCorrelation({
			firstChartDataFacts: targetChartDataFacts,
			secondChartDataFacts: secondRelatedChartDataFacts
		});
		let targetToThirdDataFactsCorrelation = getDataFactsCorrelation({
			firstChartDataFacts: targetChartDataFacts,
			secondChartDataFacts: thirdRelatedChartDataFacts
		});
		targetToFirstDataFactsCorrelation.forEach((dataFact, i) => {
			dataFact.interestingness += targetToSecondDataFactsCorrelation[i].interestingness;
			dataFact.interestingness += targetToThirdDataFactsCorrelation[i].interestingness;
		});
		sortedDataFacts = targetToFirstDataFactsCorrelation.sort((a,b) => 
			(a.interestingness < b.interestingness) ? 1 : ((b.interestingness < a.interestingness) ? -1 : 0));
	}

	return sortedDataFacts;
}