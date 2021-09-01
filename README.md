# ChartStory
ChartStory is a visual analysis tool for automated partitioning, layout, and captioning of charts into comic-style narratives. ChartStory is contributed by Jian Zhao, Shenyu Xu, Senthil Chandrasegaran, Chris Bryan, Fan Du, Aditi Mishra, Xin Qian, Yiran Li, and Kwan-Liu Ma. 

ChartStory takes an ensemble of user-created charts (a) and automatically generates a data comic (b-d). This is achieved through a back- end pipeline with operations to identify story pieces (b), organize & order story pieces (c), and generate & integrate explanations (d). The user can also interactively edit the captions and layout of the charts, and change the style or appearance of the data comic (e).

![](teaser.png)

## Demo Video

[![Watch the video](http://i3.ytimg.com/vi/PC4kmXKE4NQ/hqdefault.jpg)](https://youtu.be/PC4kmXKE4NQ)

(click the image to watch)

## Generated Datacomics Examples

#### With NLP generated captions
<table>
 <tr>
  <td>
   college data <br/>
   <img src='https://github.com/thomasxu2009/ChartStory/blob/master/generated%20datacomics/college%20NLP.png' height='400px'></img>
  </td>
  <td>
   gun data<br/>
   <img src='https://github.com/thomasxu2009/ChartStory/blob/master/generated%20datacomics/guns%20NLP.png' height='400px'></img>
  </td>
  <td>
   luma data (used in the scenario)<br/>
   <img src='https://github.com/thomasxu2009/ChartStory/blob/master/generated%20datacomics/scenario.png' height='400px'></img>
  </td>
 </tr>
</table>
 
#### With bullet-point-style captions
<table>
 <tr>
  <td>
   college data <br/>
   <img src='https://github.com/thomasxu2009/ChartStory/blob/master/generated%20datacomics/college%20bullets.png' height='400px'></img>
  </td>
  <td>
   gun data<br/>
   <img src='https://github.com/thomasxu2009/ChartStory/blob/master/generated%20datacomics/guns%20bullets.png' height='400px'></img>
  </td>
 </tr>
</table>



#### Theme Examples

<table>
	<tr>
		<td>
			dark theme with comic-style charts
			<br/>
			<img
				src='https://github.com/thomasxu2009/ChartStory/blob/master/generated%20datacomics/theme%20examples/dark%20comic%20fonts.png'
				height='400px'
			></img>
		</td>
		<td>
			dark theme example 1
			<br/>
			<img
				src='https://github.com/thomasxu2009/ChartStory/blob/master/generated%20datacomics/theme%20examples/dark.png'
				height='400px'
			></img>
		</td>
		<td>
			dark theme example 2
			<br/>
			<img
				src='https://github.com/thomasxu2009/ChartStory/blob/master/generated%20datacomics/theme%20examples/dark2.png'
				height='400px'
			></img>
		</td>
	</tr>
	<tr>
		<td>
			excel theme example 1
			<br/>
			<img
				src='https://github.com/thomasxu2009/ChartStory/blob/master/generated%20datacomics/theme%20examples/excel.png'
				height='400px'
			></img>
		</td>
		<td>
			excel theme example 2
			<br/>
			<img
				src='https://github.com/thomasxu2009/ChartStory/blob/master/generated%20datacomics/theme%20examples/excel-2.png'
				height='400px'
			></img>
		</td>
		<td>
			five thirty eight theme example
			<br/>
			<img
				src='https://github.com/thomasxu2009/ChartStory/blob/master/generated%20datacomics/theme%20examples/five%20thirty%20eight.png'
				height='400px'
			></img>
		</td>
	</tr>
	<tr>
		<td>
			ggplot2 theme example
			<br/>
			<img
				src='https://github.com/thomasxu2009/ChartStory/blob/master/generated%20datacomics/theme%20examples/ggplot2.png'
				height='400px'
			></img>
		</td>
		<td>
			latimes theme example
			<br/>
			<img
				src='https://github.com/thomasxu2009/ChartStory/blob/master/generated%20datacomics/theme%20examples/latimes.png'
				height='400px'
			></img>
		</td>
		<td>
			quartz3 theme example 1
			<br/>
			<img
				src='https://github.com/thomasxu2009/ChartStory/blob/master/generated%20datacomics/theme%20examples/quartz3.png'
				height='400px'
			></img>
		</td>
	</tr>
	<tr>
		<td>
			quartz3 theme example 2
			<br/>
			<img
				src='https://github.com/thomasxu2009/ChartStory/blob/master/generated%20datacomics/theme%20examples/quartz3-2.png'
				height='400px'
			></img>
		</td>
		<td>
			vox theme example
			<br/>
			<img
				src='https://github.com/thomasxu2009/ChartStory/blob/master/generated%20datacomics/theme%20examples/vox.png'
				height='400px'
			></img>
		</td>
	</tr>
</table>

## User Study Results

 - [study #1 results (.xlsx)](https://github.com/thomasxu2009/ChartStory/blob/master/user%20study%20results/study1%20results.xlsx)
 - [study #2 results (.xlsx)](https://github.com/thomasxu2009/ChartStory/blob/master/user%20study%20results/study2%20results.xlsx)
 - [study #3 resulting datacomic (.png)](https://github.com/thomasxu2009/ChartStory/blob/master/user%20study%20results/study3%20datacomic.png)

## High-Resolution Paper Figures

 - [Fig. 4 (.pdf)](https://github.com/WatVis/ChartStory/blob/master/paper_figures/Fig%206.pdf)
 - [Fig. 9 (.pdf)](https://github.com/WatVis/ChartStory/blob/master/paper_figures/Fig%209.pdf)

## System Setup and Running

### Prerequisite:

[Node](https://nodejs.org/) and [Python](https://www.python.org/)

### Install: 

    npm install

(Also install the required Python packages by following the README in the folder "rewrite-python-service")

### Start server: 

    npm start

Open the explorer with "http://localhost:8090/"

