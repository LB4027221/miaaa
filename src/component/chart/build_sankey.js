const {
  sankeyCircular,
  sankeyLeft,
  sankeyRight,
  sankeyCenter,
  sankeyJustify
} = require('d3-sankey-circular')
const { scaleSequential } = require('d3-scale')
const selection = require('d3-selection')
const { extent } = require('d3-array')
const { interpolateCool } = require('d3-scale-chromatic')
import * as d3 from 'd3'


export default data => {
  console.log('====================================')
  console.log(data)
  console.log('====================================')
  var margin = { top: 30, right: 30, bottom: 30, left: 30};
  var width = 1100;
  var height = 500;
  var sankey = sankeyCircular()
    .nodeWidth(10)
    .nodePadding(20) //note that this will be overridden by nodePaddingRatio
    //.nodePaddingRatio(0.5)
    .size([width, height])
    .nodeId(function (d) {
      return d.id;
    })
    .nodeAlign(sankeyJustify)
    .iterations(5)
    .circularLinkGap(1)
    .sortNodes("col")
  console.log('====================================')
  console.log(selection.select)
  console.log('====================================')
  var svg = selection
    .select("#chart-view")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  var linkG = g.append("g")
    .attr("class", "links")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.2)
    .selectAll("path");

  var nodeG = g.append("g")
    .attr("class", "nodes")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .selectAll("g");

  //run the Sankey + circular over the data
  let sankeyData = sankey(data);
  console.log('====================================')
  console.log(sankeyData)
  console.log('====================================')
}