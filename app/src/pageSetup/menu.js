import html2canvas from 'html2canvas';

let template = `
<div class="ui borderless small top menu page-menu" 
  style="z-index: 1; margin: 0px; border: none; border-bottom: 1px solid #888; border-radius: 0px; height: 4vh;">
  <div class="item" style="height: 100%; display: flex; align-items: center; justify-content: center; color: rgba(0,0,0,.6);">
    <h2 class="special-comic-text">Chart Story</h2>
  </div>
  <div class="right mini menu">
    <div class="item">
      <div id="dataFileSelection" class="ui floating dropdown labeled basic icon button" title="data selection">
        <i class="database icon"></i>
        <span class="text">Select Dataset</span>
        <div class="menu">
          <div class="item">Global Terrorism Dataset</div>` + 
          // <div class="item">College Dataset</div>
          // <div class="item">Guns Dataset</div>
          `<div class="item">Luma Dataset</div>
        </div>
      </div>
    </div>` +
    // <div class="item">
    //  <div id="subtaskSelection" class="ui floating dropdown labeled basic icon button" title="subtask selection">
    //    <i class="tasks icon"></i>
    //    <span class="text">Select Subtask</span>
    //    <div class="menu">
    //      <div class="item">S1: Grouping Charts</div>
    //      <div class="item">S2: Layout and arrangement</div>
    //      <div class="item">S3: Text explanations</div>
    //      <div class="item">S4: Story piece ordering</div>
    //      <div class="item">S5: Styling</div>
    //    </div>
    //  </div>
    // </div>
    // <div class="item">
    //  <button class="ui basic button" v-on:click="startTheSubtask" title="start the subtask">
    //    Start
    //  </button>
    // </div>
    // <div class="item">
    //  <button class="ui basic button" v-on:click="endTheSubtask" title="end the subtask">
    //    End
    //  </button>
    // </div>
    `<div class="item">
      <button class="ui basic icon button" v-on:click="" title="open">
        <i class="folder open icon"></i>
      </button>
    </div>
    <div class="item">
      <button class="ui basic icon button" v-on:click="outputCanvas" title="save">
        <i class="save icon"></i>
      </button>
    </div>
    <div class="item">
      <button class="ui basic icon button" v-on:click="$emit('zoomIn')" title="zoom in">
        <i class="zoom-in icon"></i>
      </button>
    </div>
    <div class="item">
      <button class="ui basic icon button" v-on:click="$emit('zoomOut')" title="zoom out">
        <i class="zoom-out icon"></i>
      </button>
    </div>
    <div class="item">
      <button class="ui basic icon button special-comic-text" v-on:click="$emit('motifPanel')" title="expand/collapse motif panel">
        <i class="sitemap icon"></i>
      </button>
    </div>
    <div class="item">
      <button class="ui basic icon button special-comic-text" v-on:click="$emit('authoringPanel')" title="expand/collapse authoring panel">
        <i class="edit icon"></i>
      </button>
    </div>
  </div>
</div>
`;

Vue.component('page-menu', {
  template: template,
  data() {
    return {
      subtask: ""
    };
  },
  mounted: function() {
    let vm = this;
    $.post("./getDataFile")
    .then(function(dataFile) {
      window.dataFile = dataFile;
      if(window.dataFile != "") {
        $('#dataFileSelection')
          .dropdown('set selected', vm.dataPathToDropdownDataFile(window.dataFile));
      }
      $('#dataFileSelection')
        .dropdown({
          onChange: function(value, text, $choice) {
            vm.$emit('changeDataFile', {
              dataFile: vm.dropdownDataFileToDataPath(value)
            });
          }
        });
    });
    // $('#subtaskSelection')
    //  .dropdown({
    //    onChange: function(value, text, $choice) {
    //      vm.subtask = value;
    //    }
    //  });
  },
  methods: {
    outputCanvas: function() {
      let vueThis = this;
      html2canvas(document.querySelector("#layout-panel-inside")).then(canvas => {
        canvas.toBlob(blob => {
          vueThis.downloadBlob(blob, "result.png");
        });
      });
    },

    // outputPDF: function() {
    //   let vueThis = this;
    //   let outputSVG = document.getElementById("layout-panel-inside").innerHTML;
    //   console.log(outputSVG);
    //   let data = { svg: outputSVG };
    //   let xhttp = new XMLHttpRequest();
    //   xhttp.responseType = "arraybuffer";
    //   xhttp.open("POST", "/pdf", true);
    //   xhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    //   xhttp.setRequestHeader('Accept', 'application/json');
    //   xhttp.send(JSON.stringify(data));
    //   xhttp.onreadystatechange = function() {
    //     if (this.readyState == 4 && this.status == 200) {
    //       console.log("PDF file is ready!");
    //       let pdfBlob = new Blob([xhttp.response], {type:'application/pdf'});
    //       vueThis.downloadBlob(pdfBlob, "test.pdf");
    //     }
    //   };
    // },

    downloadBlob: function(blob, filename) {
      // Create an object URL for the blob object
      const url = URL.createObjectURL(blob);
      
      // Create a new anchor element
      const a = document.createElement('a');
      
      // Set the href and download attributes for the anchor element
      // You can optionally set other attributes like `title`, etc
      // Especially, if the anchor element will be attached to the DOM
      a.href = url;
      a.download = filename || 'download';
      
      // Click handler that releases the object URL after the element has been clicked
      // This is required for one-off downloads of the blob content
      const clickHandler = () => {
        setTimeout(() => {
          URL.revokeObjectURL(url);
          window.removeEventListener('click', clickHandler);
        }, 150);
      };
      
      // Add the click event listener on the anchor element
      // Comment out this line if you don't want a one-off download of the blob content
      a.addEventListener('click', clickHandler, false);
      
      // Programmatically trigger a click on the anchor element
      // Useful if you want the download to happen automatically
      // Without attaching the anchor element to the DOM
      // Comment out this line if you don't want an automatic download of the blob content
      a.click();
      
      // Return the anchor element
      // Useful if you want a reference to the element
      // in order to attach it to the DOM or use it in some other way
      return a;
    },

    dropdownDataFileToDataPath: function(dropdownDataFile) {
      console.log(dropdownDataFile)
      let dataPath = "";
      switch(dropdownDataFile) {
        case "global terrorism dataset":
          dataPath = "savedFile_globalTerr";
          break;
        case "college dataset":
          dataPath = "savedFile_college";
          break;
        case "guns dataset":
          dataPath = "savedFile_guns";
          break;
        case "luma dataset":
          dataPath = "savedFile_luma";
          break;
        default:
          break;
      }
      return dataPath;
    },

    dataPathToDropdownDataFile: function(dataPath) {
      let dropdownDataFile = "";
      switch(dataPath) {
        case "savedFile_globalTerr":
          dropdownDataFile = "global terrorism dataset";
          break;
        case "savedFile_college":
          dropdownDataFile = "college dataset";
          break;
        case "savedFile_guns":
          dropdownDataFile = "guns dataset";
          break;
        case "savedFile_luma":
          dropdownDataFile = "luma dataset";
          break;
        default:
          break;
      }
      return dropdownDataFile;
    }
    // startTheSubtask: function() {
    //  let vm = this;
    //  $.post('./updateLogging', { newEvent: "Start the subtask: " + vm.subtask});
    // },
    // endTheSubtask: function() {
    //  let vm = this;
    //  $.post('./updateLogging', { newEvent: "End the subtask: " + vm.subtask});
    // }
  }
});