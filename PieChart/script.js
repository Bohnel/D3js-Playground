/* -------------------------- define document size -------------------------- */
const width = 1200, height = 800, maxRadius = Math.min(width, height) / 2

/* ----------------------------- create main svg ---------------------------- */
const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

/* ------------------------------------ Load data from JSON and call the function drawViz ---------- */
d3.json("../data/Age.json").then((data) => {

var multiLevelData = [];
var setMultiLevelData = function(data) {
    if (data == null)
        return;
    var level = data.length,
        counter = 0,
        index = 0,
        currentLevelData = [],
        queue = [];
    for (var i = 0; i < data.length; i++) {
        queue.push(data[i]);
    };

    while (!queue.length == 0) {
        var node = queue.shift();
        currentLevelData.push(node);
        level--;

        if (node.subData) {
            for (var i = 0; i < node.subData.length; i++) {
                queue.push(node.subData[i]);
                counter++;
            };
        }
        if (level == 0) {
            level = counter;
            counter = 0;            multiLevelData.push(currentLevelData);
            currentLevelData = [];
        }
    }
}

var drawPieChart = function(_data, index) {
    var pie = d3.pie()
        .sort(null)
        .value(function(d) {
            return d.nodeData.population;
        });
    var arc = d3.arc()
        .outerRadius((index + 1) * pieWidth - 1)
        .innerRadius(index * pieWidth);

    var g = svg.selectAll(".arc" + index).data(pie(_data)).enter().append("g")
        .attr("class", "arc" + index);

    g.append("path").attr("d", arc)
    .attr("fill", (d) => color(d.value));

    g.append("text").attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("dy", ".35em").style("text-anchor", "middle")
        .text(function(d) {
            return d.data.nodeData.age;
        });
}


setMultiLevelData(data);

var pieWidth = parseInt(maxRadius / multiLevelData.length) - multiLevelData.length;

var color = d3.scaleSequential(d3.interpolate("purple", "orange")).domain([50,100]);

for (var i = 0; i < multiLevelData.length; i++) {
    var _cData = multiLevelData[i];
    drawPieChart(_cData, i);
}


});