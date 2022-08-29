function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;   
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    
    var samples_array = data.samples;
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filt_s_array = samples_array.filter(sampleObj => sampleObj.id == sample);
    
    // variable that filters the metadata for object w/ desired ID number (i.e. the sample ID)
    var volunteer = data.metadata.filter(volObj => volObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var first_sample = filt_s_array[0];
    
    // variable holding first sample in the metadata array (volunteer)
    var first_volunteer = volunteer[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var s_otu_ids = first_sample.otu_ids
    var s_otu_labels = first_sample.otu_labels
    var s_sample_values = first_sample.sample_values

    // variable for wfreq
    var v_wfreq = parseFloat(first_volunteer.wfreq);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = s_otu_ids.slice(0,10).reverse().map(argh => ("OTU " + argh))
        
    var hoverlabels = s_otu_labels.slice(0,10).reverse().map(argh2 => (argh2))
    
    // 8. Create the trace for the bar chart. 
    var barData = [{
      type: "bar",
      x: s_sample_values.map(values => values).sort((a,b) => a-b).slice(-10),
      y: yticks,
      orientation: 'h',
      hovertemplate: hoverlabels
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
  

      // 1. Create the trace for the bubble chart.
    var bubbleData = [{
        type: "bubble",
        x: s_otu_ids, 
        y: s_sample_values,
        text: s_otu_labels,
        mode: "markers",
        marker: {
          color: s_otu_ids,
          size: s_sample_values,
        },

      }];
  
      // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        hovermode: "closest",
        xaxis: {title: "OTU ID"}

      };
  
      // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
     value: v_wfreq,
     type: 'indicator',
     mode: 'gauge+number',
     gauge: {
      bar: {color: "black"},
      axis: {range: [0,10]},
      steps: [
        {range: [0,2], color: "red"},
        {range: [2,4], color: "orange"},
        {range: [4,6], color: "yellow"},
        {range: [6,8], color: "lightgreen"},
        {range: [8,10], color: "green"}
       ]
     }
     }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     width: 475,
     height:368
    };

   // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}
