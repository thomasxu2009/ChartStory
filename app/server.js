//******** main variable definition ********
/*
This file is the backend server code. The backend is mainly implemented by node.js express library.
Mysql is used to store the dataset file in order to save the time for vega embedding.
*/

const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const multer  = require('multer');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../webpack.config.js');
const wkhtmltopdf = require('wkhtmltopdf');
const concat = require('concat');

const compiler = webpack(webpackConfig);
const app = express();
const server = require('http').Server(app);

let port = process.env.PORT || 8090,
    host = process.env.HOST || 'localhost';


let header = [];
let currentDataFile = "";
let count = 0;
// var parseChoice;
// var globalID; //current edit chart id
// var user = "guest"; //current user
// var userList; //the list of all the user
// var storyList = []; //list of vis title in the story board
// var word2vecModel; //word2vec model
// var keywordStoreList = [];
// var keywordMatrix = [];
// var firstAttribute = "";
// var secondAttribute = "";
// var thirdAttribute = "";

// var status;




app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));


//serve static html
app.use(webpackMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath
}));

// Static files
app.use('/npm', express.static('node_modules'));
app.use('/app', express.static('app'));
app.use('/savedFile', express.static('savedFile'));
app.use('/savedFile_college', express.static('savedFile_college'));
app.use('/savedFile_globalTerr', express.static('savedFile_globalTerr'));
app.use('/savedFile_guns', express.static('savedFile_guns'));
app.use('/savedFile_luma', express.static('savedFile_luma'));

app.post('/getDataFile', function (req, res) {
	res.send(currentDataFile);
	res.end();
});

app.post('/changeDataFile', function (req, res) {
	currentDataFile = req.body.dataFile;
	res.send("Data file is changed.");
	res.end();
});

let getSimilarityMatrixAndChartInfo = require('./server/getSimilarityMatrixAndChartInfo.js');
getSimilarityMatrixAndChartInfo(app);

//update logging data
// app.post('/updateLogging', function(req, res) {
// 	var newEvent = req.body.newEvent;
// 	fs.readFile("./logging/logging.json", "utf-8", function(err, data) {
// 		if (err) {
// 			var userEvents = {};
// 			var currentTime = new Date();
// 			userEvents[currentTime] = newEvent;
// 			fs.writeFile("./logging/logging.json", JSON.stringify(userEvents, null, 2), 'utf-8', function(err) {
// 				if (err) throw err;
// 				res.send("done");
// 				res.end();
// 			});
// 		} else {
// 			var userEvents = JSON.parse(data);
// 			var currentTime = new Date();
// 			userEvents[currentTime] = newEvent;
// 			fs.writeFile("./logging/logging.json", JSON.stringify(userEvents, null, 2), 'utf-8', function(err) {
// 				if (err) throw err;
// 				res.send("done");
// 				res.end();
// 			});
// 		}
// 	});
// });

let runPy = (originalDataFacts) => {
	return new Promise(function(resolve, reject) {
	  const { spawn } = require('child_process');
	  const pyprog = spawn('python3', ['./rewrite-python-service/code/rewrite-pipeline.py', originalDataFacts]);

	  pyprog.stdout.on('data', function(data) {
			resolve(data);
	  });

	  pyprog.stderr.on('data', (data) => {
			reject(Error(data));
	  });

	});
};


//log data facts
app.post('/intermediateDataFacts', function(req, res) {
	let dataFactDetails = req.body.dataFactDetails;
	let originalDataFacts = JSON.stringify(dataFactDetails);
	// count++;
	// if(count == 1) {
	// 	console.log(dataFactDetails[0]);
	// }
	runPy(originalDataFacts)
	.then(function(fromRunpy) {
		let rewritteDnataFacts = fromRunpy.toString();
		res.end(rewritteDnataFacts);
	})
	.catch(function(error) {
		console.error(error);
	});
	// fs.writeFile("./logging/datafact" + count + ".json",
	// 	JSON.stringify(dataFactDetails, null, 2), 'utf-8', function(err) {
	// 	if (err) throw err;
	// 	res.send("done");
	// 	res.end();
	// });
});

//translate svg to pdf
// app.post('/pdf', (req, res) => {
// 	res.set('Content-Disposition','attachment;filename=pdffile.pdf');
// 	res.set('Content-Type', 'application/pdf');

// 	let styleSheetsList = [
// 		"./app/style/style.css",
// 		"./app/style/generalThemeLight.css",
// 		"./app/style/quill.bubble.css"
// 	];
// 	let outputFile = "./app/style/combinedStyle.css";
// 	concat(styleSheetsList, outputFile);

// 	wkhtmltopdf(req.body.svg,
// 		{
// 			"margin-top": "0px",
// 			"margin-bottom": "0px",
// 			"margin-left": "0px",
// 			"margin-right": "0px",
// 			"page-width": "1600px",
// 			"page-height": "3200px",
// 			"user-style-sheet": "./app/style/combinedStyle.css",
// 			"disable-smart-shrinking": true
// 		}
// 	).pipe(res);
// });

//******** Server ********

server.listen(port, host, function(){
  console.log('server started, listening', host, port);
});


//******** Route Methods ********






































