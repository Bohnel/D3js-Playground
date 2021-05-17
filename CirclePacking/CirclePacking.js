var data = {"children": [
  {"children": [
    {"stat": 1},
    {"stat": 1},
    {"stat": 1}
  ]},
  {"children": [
    {"stat": 1},
    {"stat": 1},
    {"stat": 2},
    {"stat": 3}
  ]},
  {"children": [
    {"stat": 1},
    {"stat": 1},
    {"stat": 1},
    {"stat": 1},
    {"stat": 2},
    {"stat": 2},
    {"stat": 2},
    {"stat": 4},
    {"stat": 4},
    {"stat": 8}
  ]},
]};

let diameter = 400;
let color = d3.scaleOrdinal()
    .range(["#ff433d", "#ff8e8b", "#ffc6c4", "#5c42ab", "#9d8ecd", "#cec6e6"])
let pack = d3.pack()
    .size([diameter, diameter])
    .padding(1.5)
let vis = d3.select("#svgid").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "pack")
    .append("g");
  
var root = { name: "test", children: data };