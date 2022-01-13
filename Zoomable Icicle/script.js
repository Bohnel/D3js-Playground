/* -------------------------- Define window layout -------------------------- */
const vWidth = window.innerWidth - 50;
const vHeight = window.innerHeight - 100;
const margin = 50;
const valueSize = '12px';
const textMarginTop = 15;
const valueMarginTop = 35;
const textMarginLeft = 5;

/* ----------------------------- create main svg ---------------------------- */
const svg = d3.select("body")
    .append("svg")
    .attr('width', vWidth)
    .attr('height', vHeight)
    .attr("viewBox", [0, 0, vWidth, vHeight ])

let x = d3.scaleLinear().range([0, vHeight]);
let y = d3.scaleLinear().range([0, vWidth]);
var partition = d3.partition().size([vHeight, vWidth]);

/* ------------------------------------ Load data from JSON and call the function drawViz ---------- */
d3.json("./data/dataWorld.json").then((data) => {
    drawViz(data);
});

/* ------------------------------------ Visualize Function ----------------------------------- */
const drawViz = (data) => {
    //define color scale
    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 2));

    const root = d3.hierarchy(data)
        .count() //define size by number of nodes
        .sum(d => d.value)
        .sort((a, b) => b.height - a.height || b.value - a.value)

    //initialize group for each node
    const g = svg.selectAll("g").data(root.descendants()).enter().append("g");

    //define partition layout
    const partition = d3.partition()
        .size([vHeight, vWidth])
        .padding(vWidth / 1000);

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
            while (d.depth > 1) d = d.parent; //assign color based on depth 2
                return color(d.data.name);
        })
        .on("click", handleClick)

    //initialize text for each node
    const text = g.append("text")
        .attr('x', d => d.y0 + textMarginLeft)
        .attr('y', d => d.x0 + textMarginTop)
        .attr('fill-opacity', (d) => labelVisible(d))
        .attr('fill', '#000')
        .style("user-select", "none")
        .attr("pointer-events", "none")
        .text((d) => { return d.data.name});

    const values = g.append("text")
        .attr('x', d => d.y0 + textMarginLeft)
        .attr('y', d => d.x0 + valueMarginTop)
        .attr('font-size', valueSize)
        .attr('fill-opacity', (d) => d.depth > 1 ? 0 : 1)
        .attr('fill', '#000')
        .style("user-select", "none")
        .attr("pointer-events", "none")
        .text((d) => { return 'Population: ' + numberWithCommas(d.value)});

/* ------------------------------------ Interactions ---------- */
    // On Click on rectangle
    function handleClick(d) {
        x.domain([d.x0, d.x1]);
        y.domain([d.y0,vWidth]).range([d.depth ? 50 : 0, vWidth]);
        
        rect
            .transition()
            .duration(750)
            .attr("x", function(d) { return y(d.y0); })
            .attr("y", function(d) { return x(d.x0); })
            .attr("width", function(d) { return y(d.y1) - y(d.y0); })
            .attr("height", function(d) { return x(d.x1) - x(d.x0); });
        
        text
            .transition()
            .duration(750)
            .attr("x", function(d) { return y(d.y0) + textMarginLeft; })
            .attr("y", function(d) { return x(d.x0) + textMarginTop; })
            .attr('fill-opacity', function(d) { return x(d.x1) - x(d.x0) > 30 ? 1 : 0 })

        values
            .transition()
            .duration(750)
            .attr("x", function(d) { return y(d.y0) + textMarginLeft; })
            .attr("y", function(d) { return x(d.x0) + valueMarginTop; })
            .attr('fill-opacity', function(d) { return x(d.x1) - x(d.x0) > 30 ? 1 : 0 })
    }

    function labelVisible(d) {
        return d.x1 - d.x0 > 0 ?  d.depth < 2 ? 1 : 0 : 0;
    }
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

}