const url =
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

let samples;
let metaData;

function init() {

  // Populate the dropdown menu
  let dropdown = d3.select("#selDataset");
  console.log(dropdown);

  d3.json(url).then((data) => {
    console.log(data);

    let names = data.names;
    console.log("names", names);

    for (let i = 0; i < names.length; i++) {
      dropdown.append("option").text(names[i]).property("value", names[i]);
    }

    let nameValues = names[0];
    console.log("name values", nameValues);

    samples = data.samples;
    console.log("samples", samples);

    metaData = data.metadata;
    console.log("meta_data", metaData);


    barChart(samples[0]);
    addGraphBreak();

    bubbleChart(samples[0]);
    addGraphBreak();

    gaugeChart(metaData[0]);
    addGraphBreak();

    metaChart(metaData[0]);
  });
}


function barChart(dataValues) {

  let otu_ids = dataValues.otu_ids;
  console.log("otu_ids", otu_ids);

  let otu_labels = dataValues.otu_labels;
  console.log("otu_labels", otu_labels);

  let sampleValues = dataValues.sample_values;
  console.log("sampleValues", sampleValues);

  //
  let xticks = sampleValues.slice(0, 10).reverse();
  console.log("xticks", xticks);

  let yticks = otu_ids.slice(0, 10).reverse().map((otuID) => `OTU ${otuID}`);
  console.log("yticks", yticks);

  let text = otu_labels.slice(0, 10).reverse();
  console.log("text", text);

  //
  let trace1 = {
    x: xticks,
    y: yticks,
    text: text,
    type: "bar",
    orientation: "h"
  };

  let barData = [trace1];

  let barLayout = {
    title: "<b>Top 10 OTUs</b>",
    margin: {
      l: 75,
      t: 50,
      r: 30,
      b: 30,
    },
    height: 500,
    width: 400,
  };

  Plotly.newPlot("bar", barData, barLayout);
}


function bubbleChart(dataValues) {

  let otu_ids = dataValues.otu_ids;
  console.log("otu_ids", otu_ids);

  let otu_labels = dataValues.otu_labels;
  console.log("otu_labels", otu_labels);

  let sampleValues = dataValues.sample_values;
  console.log("sampleValues", sampleValues);

  //
  let xticks = otu_ids;
  console.log("xticks", xticks);

  let yticks = sampleValues;
  console.log("yticks", yticks);

  let markerSize = sampleValues.map(value => value);
  console.log("markerSize", markerSize);

  let markerColor = otu_ids;
  console.log("markerColor", markerColor);

  let text = otu_labels;
  console.log("text", text);

  //
  let trace2 = {
    x: xticks,
    y: yticks,
    text: text,
    mode: "markers",
    marker: {
      size: markerSize,
      color: markerColor,
      colorscale: "Earth"
    }
  };

  let bubbleData = [trace2];

  let bubbleLayout = {
    title: "<b>OTU IDs</b>",
    margin: {
      l: 50,
      t: 70,
      r: 30,
      b: 30,
    },
    height: 500,
    width: 1500,
  };

  Plotly.newPlot("bubble", bubbleData, bubbleLayout);

}


function gaugeChart(dataValue) {

  let trace3 = {
    domain: {x: [0, 1], y: [0, 1]},
    value: dataValue.wfreq,
    title: {text: "<b>Belly Button Washing Frequency</b> <br>Scrubs per Week</br>"},
    type: "indicator",
    mode: "gauge+number",
    gauge: {
      axis: {range: [null, 9]},
      steps: [
        { range: [0, 1], color: "rgb(248, 243, 236)" },
        { range: [1, 2], color: "rgb(244, 241, 229)" },
        { range: [2, 3], color: "rgb(233, 230, 202)" },
        { range: [3, 4], color: "rgb(229, 231, 179)" },
        { range: [4, 5], color: "rgb(213, 228, 156)" },
        { range: [5, 6], color: "rgb(183, 204, 146)" },
        { range: [6, 7], color: "rgb(140, 191, 136)" },
        { range: [7, 8], color: "rgb(138, 187, 143)" },
        { range: [8, 9], color: "rgb(133, 180, 138)" }
      ]
    }
  };

  let gaugeData = [trace3];

  let gaugeLayout = {
    height: 500,
    width: 400,
    margin: { 
      t: 20, 
      b: 0,
    }
  };

  Plotly.newPlot("gauge", gaugeData, gaugeLayout);
}


function metaChart(dataValue) {

  d3.select("#sample-metadata").html("");

  for (let [key, value] of Object.entries(dataValue)) {
    console.log(key, value);

    d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
  }
}


function optionChanged(dataValue) {
  console.log('optionChanged', dataValue);

  let filteredData = samples.filter((sample) => sample.id == dataValue);
  let filteredMeta = metaData.filter((meta) => meta.id == dataValue);

  metaChart(filteredMeta[0]);
  barChart(filteredData[0]);
  bubbleChart(filteredData[0]);
  gaugeChart(filteredMeta[0]);
}


function addGraphBreak() {
  d3.select("#bar").append("br");
  d3.select("#bubble").append("br");
  d3.select("#gauge").append("br");
}

init();