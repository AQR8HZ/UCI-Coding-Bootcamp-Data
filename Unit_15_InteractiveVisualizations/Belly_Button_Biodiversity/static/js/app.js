function buildMetadata(sample) {
var metadataUrl = "/metadata/"+sample

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    var selector = d3.select("#sample-metadata");
    selector.text(" ");

    // Use the list of sample names to populate the select options
    d3.json(metadataUrl).then((sampleMetadata) => {
      
      for(item in sampleMetadata) { 
        selector
        .append("p")
        .text(item +": " + sampleMetadata[item])
      }
      
      });
  

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    

    var samplesUrl = "/samples/"+sample

    d3.json(samplesUrl).then((sampleData) => {

      var result = [];
      sampleData['otu_ids'].forEach((sample, i) => {
        result[i] =  {"id": sample, "value" : sampleData['sample_values'][i], "label" : sampleData['otu_labels'][i] }
      });

      var resultsSorted = result.sort(function(a, b){return b.value - a.value});
      var topTen = resultsSorted.slice(0, 10);
     
      console.log(topTen);

      var labels = [];
      var values = [];
      var trace = [];

      topTen.forEach((item, i) => {
        labels[i] = topTen[i]['id'];
        values[i] = topTen[i]['value'];
        trace[i]  = topTen[i]['label'];
      });

      var pieChart = {
        labels: labels,
        values: values,
        hovertext: trace,
        type: 'pie'
      };

      var data = [pieChart];
      var layout = {
        title: "Top 10 samples",
      };

      Plotly.newPlot("pie", data, layout);



      var bubbleChart = {
        x: sampleData['otu_ids'],
        y: sampleData['sample_values'],
        text: sampleData['otu_labels'],
        mode: 'markers',
        marker: {
          color: sampleData['otu_ids'],
          size: sampleData['sample_values']
        }
      };
      
      var data = [bubbleChart];
      
      var layout = {
        title: 'Graphic representation of all available information for the sample',
      };
      
      Plotly.newPlot("bubble", data, layout);

    });


    var metadataUrl = "/metadata/"+sample
    d3.json(metadataUrl).then((sampleMetadata) => {
      
      weeklyFreq  = sampleMetadata['WFREQ']
      console.log('weeklyFreq', weeklyFreq);

    // Enter a speed between 0 and 180
    var level = weeklyFreq;

    // Trig to calc meter point
    var degrees = 10 - level,
        radius = .5;
    var radians = degrees * Math.PI / 10;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data = [{ type: 'scatter',
      x: [0], y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'frequency',
        text: level,
        hoverinfo: 'text+name'},
      { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ' '],
      textinfo: 'text',
      textposition:'inside',
      marker: {colors:['rgba(139,69,19, .5)', 'rgba(160,82,45, .5)', 'rgba(210,105,30, .5)',
                            'rgba(205,133,63, .5)', 'rgba(244,164,96, .5)', 'rgba(222,184,135, .5)',
                            'rgba(210,180,140, .5)', 'rgba((255,228,181, .5)', 'rgba(250,240,230, .5)',
                            'rgba(255, 255, 255, .5)']},
      labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ' '],
      hoverinfo: 'none',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];

    var layout = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
      title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per week',
      height: 500,
      width: 500,
      xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
    };

    Plotly.newPlot("gauge", data, layout);
  });


  

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Initialize the dashboard
init();
