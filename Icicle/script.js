/* -------------------------- Define window layout -------------------------- */
const vWidth = window.innerWidth - 50;
const vHeight = window.innerHeight - 100;
const margin = 50;

/* ----------------------------- create main svg ---------------------------- */
const svg = d3.select("body").append("svg").attr('width', vWidth).attr('height', vHeight);
let x = d3.scaleLinear().range([0, vHeight]);
let y = d3.scaleLinear().range([0, vWidth]);
var partition = d3.partition().size([vHeight, vWidth]).padding(0).round(true);


// Render Div for labels
// var tooltip = d3.select("body").append("div")
//     .classed("tooltip", true)
//     .style("opacity", 0);

/* ------------------------------------ Load data from JSON and call the function drawViz ---------- */

d3.json("../CirclePackingTeam/data/dataWorld.json").then((data) => {
    // Draw diagram
    drawViz(data);
});

/* ------------------------------------ Visualize Function ----------------------------------- */
const drawViz = (data) => {
    
    //define color scale
    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));

    const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.height - a.height || b.value - a.value)
        // .count(); //define size by number of nodes

    //initialize group for each node
    const g = svg.selectAll("g").data(root.descendants()).enter().append("g");

    //define partition layout 
    const partition = d3.partition()
        .size([vHeight, vWidth])
        .padding(1);
    
    //call partition
    partition(root);

    //initialize rectangle for each node
    rect = g.append("rect")
        .attr('x', d => d.y0)
        .attr('y', d => d.x0)
        .attr('width', d => d.y1 - d.y0)
        .attr('height', d => d.x1 - d.x0)
        .style("cursor", "pointer")
        .attr("fill", d => {
            //root node
            if (!d.depth) return "gray";
            //each children
            while (d.depth > 1) d = d.parent;
                return color(d.data.name);
        })
        .on("click", handleClick);
        
    //initialize text for each node
    const text = g.append("text")
        .attr('x', d => d.y0)
        .attr('y', d => d.x0 + 15)
        .attr('fill-opacity', (d) => labelVisible(d))
        .attr('fill', 'black')
        .style("user-select", "none")
        .attr("pointer-events", "none")
        .text((d) => { return d.data.name});

    //Zoom on Click
    function handleClick(d) {
        x.domain([d.x0, d.x1]);
        y.domain([d.y0,vWidth]).range([d.depth ? 50 : 0, vWidth]);

        rect.transition()
            .duration(750)
            .attr("x", function(d) { return y(d.y0); })
            .attr("y", function(d) { return x(d.x0); })
            .attr("width", function(d) { return y(d.y1) - y(d.y0); })
            .attr("height", function(d) { return x(d.x1) - x(d.x0); });
        
        text
            .transition()
            .duration(750)
            .attr("x", function(d) { return y(d.y0); })
            .attr("y", function(d) { return x(d.x0) + 15; })
            .attr('fill-opacity', function(d) { return x(d.x1) - x(d.x0) > 30 ? 1 : 0 })
    }

    //check for rect size and define visibility
    function labelVisible(d) {
        return d.x1 - d.x0 > 15 ? 1 : 0;
    }
}