module.exports = function(data) {
  if(data) {
    let arrayOfCharts = data;
    let numberOfCharts = arrayOfCharts.length;

    //encoding choice
    let matrix = [];
    for(let index = 0; index < numberOfCharts; index++) {
      let arr;
      (arr = []).length = numberOfCharts;
      arr.fill(0.001);
      matrix.push(arr);
    }

    for(let indexI = 0; indexI < numberOfCharts; indexI++) {
      let firstFields = arrayOfCharts[indexI].chartInfo.fields;
      let firstChart = arrayOfCharts[indexI].chartInfo.sourceCode;
      //transform part
      let firstTransEdit = getTransEdit(firstChart.encoding);
      //encoding part
      let firstX = firstFields.xAxisField;
      let firstY = firstFields.yAxisField;
      let firstColor = firstFields.colorField;
      let firstColumn = firstFields.columnField;
      let firstSize = firstFields.sizeField;

      for(let indexJ = 0; indexJ < numberOfCharts; indexJ++) {
        let secondFields = arrayOfCharts[indexJ].chartInfo.fields;
        let secondChart = arrayOfCharts[indexJ].chartInfo.sourceCode;
        //transform part
        let secondTransEdit = getTransEdit(secondChart.encoding);
        //encoding part
        let secondX = secondFields.xAxisField;
        let secondY = secondFields.yAxisField;
        let secondColor = secondFields.colorField;
        let secondColumn = secondFields.columnField;
        let secondSize = secondFields.sizeField;

        //graphscape mark edit
        let markEditType = firstChart.mark < secondChart.mark ? firstChart.mark + "_" + secondChart.mark : secondChart.mark + "_" + firstChart.mark;
        
        if(firstChart.mark != secondChart.mark) {
          switch(markEditType) {
            case "area_bar": 
              matrix[indexI][indexJ] += 0.03;
              break;
            case "area_line":
              matrix[indexI][indexJ] += 0.02;
              break;
            case "area_point":
              matrix[indexI][indexJ] += 0.04;
              break;
            case "area_text":
              matrix[indexI][indexJ] += 0.08;
              break;
            case "area_tick":
              matrix[indexI][indexJ] += 0.04;
              break;
            case "bar_line":
              matrix[indexI][indexJ] += 0.04;
              break;
            case "bar_point":
              matrix[indexI][indexJ] += 0.02;
              break;
            case "bar_text":
              matrix[indexI][indexJ] += 0.06;
              break;
            case "bar_tick":
              matrix[indexI][indexJ] += 0.02;
              break;
            case "line_point":
              matrix[indexI][indexJ] += 0.03;
              break;
            case "line_text":
              matrix[indexI][indexJ] += 0.07;
              break;
            case "line_tick":
              matrix[indexI][indexJ] += 0.03;
              break;
            case "point_text":
              matrix[indexI][indexJ] += 0.05;
              break;
            case "point_tick":
              matrix[indexI][indexJ] += 0.01;
              break;
            case "text_tick":
              matrix[indexI][indexJ] += 0.05;
              break;
            default:
              matrix[indexI][indexJ] += 0.04;
              break;
          }
        }


        //graphscape transform edit
        matrix[indexI][indexJ] += 0.6 * Math.abs(firstTransEdit.scale - secondTransEdit.scale)
        + 0.61 * Math.abs(firstTransEdit.sort - secondTransEdit.sort)
        + 0.62 * Math.abs(firstTransEdit.bin - secondTransEdit.bin)
        + 0.63 * Math.abs(firstTransEdit.aggregate - secondTransEdit.aggregate);


        //graphscape encoding edit

        //x
        if(firstX != secondX) {
          if(firstX != "" && secondX !== "" && firstX == secondY && secondX == firstY) { 
            matrix[indexI][indexJ] += 4.42; //swap x y
          } else if(firstX != "" && secondX !== "") {
            matrix[indexI][indexJ] += 4.71; //modify x
          } else if((firstX != "" && secondX == "") || (firstX == "" && secondX != "")) {
            matrix[indexI][indexJ] += 4.59; //add x
          }
        }

        //y
        if(firstY != secondY) {
          if(firstY != "" && secondY !== "" && firstX == secondY && secondX == firstY) { 
            matrix[indexI][indexJ] += 0; //swap x y
          } else if(firstY != "" && secondY != "") {
            matrix[indexI][indexJ] += 4.71; //modify y
          } else if((firstY != "" && secondY == "") || (firstY == "" && secondY != "")) {
            matrix[indexI][indexJ] += 4.59; //add y
          }
        }

        //color
        if(firstColor != secondColor) {
          if(firstColor != "" && secondColor != "") {
            matrix[indexI][indexJ] += 4.67; //modify color
          } else if((firstColor != "" && secondColor == "") || (firstColor == "" && secondColor != "")) {
            matrix[indexI][indexJ] += 4.55; //add color
          }
        }

        //column
        if(firstColumn != secondColumn) {
          if(firstColumn != "" && secondColumn != "") {
            matrix[indexI][indexJ] += 4.69; //modify column
          } else if((firstColumn != "" && secondColumn == "") || (firstColumn == "" && secondColumn != "")) {
            matrix[indexI][indexJ] += 4.57; //add column
          }
        }

        //size
        if(firstSize != secondSize) {
          if(firstSize != "" && secondSize != "") {
            matrix[indexI][indexJ] += 4.65; //modify size
          } else if((firstSize != "" && secondSize == "") || (firstSize == "" && secondSize != "")) {
            matrix[indexI][indexJ] += 4.53; //add size
          }
        }

      }
    }
    
    encodingChoiceMatrix = matrix;
    return matrix;
  }
}

//get transform edit
function getTransEdit(encoding) {
  let transEdit = { 
    scale: 0,
    sort: 0,
    bin: 0,
    aggregate: 0
  };

  if(encoding === undefined) {
    return transEdit;
  }

  Object.keys(encoding).forEach((d) => {
    if(encoding[d].scale !== undefined) {
      transEdit.scale += 1;
    }
    if(encoding[d].sort !== undefined) {
      transEdit.sort += 1;
    }
    if(encoding[d].bin !== undefined) {
      transEdit.bin += 1;
    }
    if(encoding[d].aggregate !== undefined) {
      transEdit.aggregate += 1;
    }
  });
  
  return transEdit;
}