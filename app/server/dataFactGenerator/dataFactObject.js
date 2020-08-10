module.exports = {
	getOutlierDataFactObject: function() {
    let dfObject = {};
    dfObject['id'] = "";
    dfObject['type'] = "OutlierFact";
    dfObject['tier'] = ""; // 1, 2
    dfObject['interestingness'] = 0.0;
    dfObject['taskCategory'] = "Anomaly";

    dfObject['primaryTargetObjectType'] = ""; // category, item, value
    dfObject['secondaryTargetObjectType'] = ""; // category, item, value
    dfObject['primaryTargetObject'] = "";
    dfObject['secondaryTargetObject'] = "";

    return dfObject;
  },

  getExtremeValueDataFactObject: function() {
    let dfObject = {};
    dfObject['id'] = "";
    dfObject['type'] = "ExtremeValueFact";
    dfObject['tier'] = ""; // 1, 2
    dfObject['interestingness'] = 0.0;
    dfObject['taskCategory'] = "Extremum";

    dfObject['extremeFunction'] = "" // MIN, MAX
    dfObject['primaryTargetObjectType'] = ""; // category, item, value
    dfObject['secondaryTargetObjectType'] = ""; // category, item, value
    dfObject['primaryTargetObject'] = "";
    dfObject['secondaryTargetObject'] = "";

    return dfObject;
  },

  getRelativeValueDataFactObject: function() {
    let dfObject = {};
    dfObject['id'] = "";
    dfObject['type'] = "RelativeValueFact";
    dfObject['tier'] = ""; // 1, 2
    dfObject['interestingness'] = 0.0;
    dfObject['taskCategory'] = "Distribution";

    dfObject['primaryTargetObjectType'] = ""; // category, item, value
    dfObject['secondaryTargetObjectType'] = ""; // category, item, value
    dfObject['primaryTargetObject'] = "";
    dfObject['secondaryTargetObject'] = "";
    dfObject['diffFactor'] = "empty";

    return dfObject;
  },

  getDerivedValueDataFactObject: function() {
    let dfObject = {};
    dfObject['id'] = "";
    dfObject['type'] = "DerivedValueFact";
    dfObject['tier'] = ""; // 1
    dfObject['interestingness'] = 0.0;
    dfObject['taskCategory'] = "DerivedValue";

    dfObject['primaryTargetObjectType'] = ""; // category, item, value
    dfObject['secondaryTargetObjectType'] = ""; // category, item, value
    dfObject['value'] = "empty";

    return dfObject;
  },

  getCorrelationDataFactObject: function() {
    let dfObject = {};
    dfObject['id'] = "";
    dfObject['type'] = "CorrelationFact";
    dfObject['tier'] = ""; // 1
    dfObject['interestingness'] = 0.0;
    dfObject['taskCategory'] = "Correlation";

    dfObject['primaryTargetObjectType'] = ""; // category, item, value
    dfObject['secondaryTargetObjectType'] = ""; // category, item, value
    dfObject['value'] = "empty";

    return dfObject;
  },

  getCategoryCorrelationDataFactObject: function() {
    let dfObject = {};
    dfObject['id'] = "";
    dfObject['type'] = "CategoryCorrelationFact";
    dfObject['tier'] = ""; // 1
    dfObject['interestingness'] = 0.0;
    dfObject['taskCategory'] = "Correlation";

    dfObject['primaryTargetObjectType'] = ""; // category, item, value
    dfObject['secondaryTargetObjectType'] = ""; // category, item, value
    dfObject['value'] = "empty";

    return dfObject;
  },

  getQuadrantDistributionDataFactObject: function() {
    let dfObject = {};
    dfObject['id'] = "";
    dfObject['type'] = "QuadrantDistributionFact";
    dfObject['tier'] = ""; // 1
    dfObject['interestingness'] = 0.0;
    dfObject['taskCategory'] = "Distribution";

    dfObject['primaryTargetObjectType'] = ""; // category, item, value
    dfObject['secondaryTargetObjectType'] = ""; // category, item, value
    dfObject['quadrant'] = "empty";

    return dfObject;
  },

  getRangeDistributionDataFactObject: function() {
    let dfObject = {};
    dfObject['id'] = "";
    dfObject['type'] = "RangeDistributionFact";
    dfObject['tier'] = ""; // 1
    dfObject['interestingness'] = 0.0;
    dfObject['taskCategory'] = "Distribution";

    dfObject['primaryTargetObjectType'] = ""; // category, item, value
    dfObject['secondaryTargetObjectType'] = ""; // category, item, value
    dfObject['value'] = "empty";

    return dfObject;
  }
}