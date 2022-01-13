let margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

const colors = d3.schemeTableau10

var transformX = 0;
var tarnsformY = 0;
//sankeyCenter, sankeyLeft, sankeyRight, sankeyJustify


// console.log(data);

var formatNumber = d3.format(",.0f"), // zero decimal places
    format = function (d) { return formatNumber(d); },
    color = d3.scaleOrdinal(d3.schemeCategory10);

// var dropDown = d3.select("body").append("select")
//   .attr("name", "name-list");


// var options = dropDown.selectAll("option")
//   .data(data)
//   .enter()

// Dropdown
// var data = [
//     {
//     'name': "Option 1",
//     'value': d3.sankeyCenter
//     },
//      {
//     'name': "Option 2",
//     'value': d3.sankeyLeft
//     },
//     {
//     'name': "Option 3",
//     'value': d3.sankeyRight
//     },
// ];

var sankey = d3.sankey()
    .nodeAlign(d3.sankeyJustify) //sankeyCenter, sankeyLeft, sankeyRight, sankeyJustify
    .nodeWidth(15)
    .nodePadding(15)
    .size([width, height]);

// var data = ["Option 1", "Option 2", "Option 3"];

// var select = d3.select('body')
//   .append('select')
//   	.attr('class','select')
//     .on('change',onchange)

// var options = select
//     .selectAll('option')
// 	.data(data).enter()
// 	.append('option')
//         .attr("value", function(d) {return d;})
// 		.text(function (d) { return d; });

// function onchange() {
// 	selectValue = d3.select('select').property('value')
//     // d3.select('sankey').nodeAlign('value');

//     sankey.remove();
//     if(selectValue === 'Option 2') {
//         sankey = d3.sankey().nodeAlign(d3.sankeyRight)
//             .nodeWidth(15)
//             .nodePadding(15)
//             .size([width, height]);
//     }
//     console.log(selectValue);
// };

// function selectOrientation(value) {
//     console.log(value)
// }


// @TODO
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", [0, 0, width, height + margin.bottom + margin.top ]) //scale down real viewport
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var path = sankey.links();

d3.json("./data/energyX.json").then(function (sankeydata) {

    graph = sankey(sankeydata);
    
    var node = svg.append("g").selectAll(".node")
        .data(graph.nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        // .attr('transform', d => `translate(${d.x0},${d.y0})`)
        .call(d3.drag()
            .subject((d) => d)
            .on("start", function() {  this.parentNode.appendChild(this); })
            .on("drag", dragmove)
            .on('end', dragEnd));
        
    node.append("rect")
        .attr("x", function (d) { return d.x0; })
        .attr("y", function (d) { return d.y0; })
        .attr("height", function (d) { return Math.round(d.y1 - d.y0)})
        .attr("width", sankey.nodeWidth())
        .style("fill", function (d) {
            return d.color = color(d.name.replace(/ .*/, ""));
        })
        .style("stroke", function (d) {
            return d3.rgb(d.color).darker(0);
        })
        .append("title")
        .text(function (d) {
            return d.name + "\n" + format(d.value);
        })
        
    
    var link = svg.append("g").selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.sankeyLinkHorizontal())
        .style("stroke", function (d) {
            return d.color = d.source.color;
        })
        .attr("stroke-width", function (d) { return d.width; });

    link.append("title")
        .text(function (d) {
            return d.source.name + " → " +
                d.target.name + "\n" + format(d.value);
        });

    node.append("text")
        .attr("x", function (d) { return d.x0 - 6; })
        .attr("y", function (d) { return (d.y1 + d.y0) / 2; })
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .text(function (d) { return d.name; })
        .filter(function (d) { return d.x0 < width / 2; })
        .attr("x", function (d) { return d.x1 + 6; })
        .attr("text-anchor", "start");
        
    function dragmove(d) {
        var rectY = d3.select(this).select("rect").attr("y");
        var rectX = d3.select(this).select("rect").attr("x");

        d.y0 = d.y0 + event.dy;
        d.x1 = d.x1 + event.dx;
        d.x0 = d.x0 + event.dx;

        d3.select(this).attr('transform', "translate(" + (event.x - rectX - 30) + "," + (event.y- rectY - 100) + ")");
        let x = rectX + (event.x - rectX - 30);
        let y = rectY + (event.y - rectY - 100);

    }
    function dragEnd(d) {
        // Get X & Y values from rect
        var rectY = d3.select(this).select("rect").attr("y");
        var rectX = d3.select(this).select("rect").attr("x");

        // Delete translation
        d3.select(this).attr('transform', null);

        // Round X & Y values to set new coordinates
        let x = Math.round(parseFloat(rectX) + (parseInt(event.x) - parseFloat(rectX) - 30));
        let y = Math.round(parseFloat(rectY) + (parseInt(event.y) - parseFloat(rectY) - 100));
        // d3.select(this).attr("x", x).attr("y", y)
        d3.select(this).select("rect")
            .attr("x", x)
            .attr("y", y)

        d3.select(this).select("text")
            .attr("x", x < width / 2  ? x + 20 : x - 20)
            .attr("y", y + (d3.select(this).select("rect").attr("height") / 2))

        for (const element of graph.nodes) {
            if(element.x0 == rectX && element.y0 == rectY) {
                element.x0 = x
                element.y0 = y
                element.x1 = Number(x) + Number(d3.select(this).select("rect").attr("width"))
                element.y1 = Number(y) + Number(d3.select(this).select("rect").attr("height"))
            }
        }
        
        d3.sankey(sankeydata).update(graph);
        link.attr('d', d3.sankeyLinkHorizontal()); // Update Links
        console.log('Graph after', graph)
    }

});
