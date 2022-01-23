/* -------------------------- Define window layout -------------------------- */
const vWidth = window.innerWidth;
const vHeight = 800;
const margin = 50;
let clicked = false;
const textMargin = 5;
const strokeColor = "#EDF6F9";
const zoomSpeed = 750;

// Render Diagram
let g = d3.select('svg').attr('width', vWidth).attr('height', vHeight).select('g');

/* ------------------------------------ Tooltips ----------------------------------- */
var tooltip = d3.select("body").append("div")
    .classed("tooltip", true)
    .style("opacity", 0);

/* ------------------------------------ ViewBox ----------------------------------- */
d3.select('svg')
    .attr("viewBox", [0, 0, vWidth, vHeight ])
    .style('margin', 'auto');

/* ------------------------------------ Load data from JSON and call the function drawViz ---------- */

d3.json("./data/WorldData.json").then((data) => {
    // Set biggest circle as the main circle
    root = d3.pack(data);
    // Set focus on the main circle
    focus = root;
    // Draw diagram
    drawViz(data);
});

/* ------------------------------------ Visualize Function ----------------------------------- */
function drawViz(data) {
    // Define layout for the main circle
    let vLayout = d3.pack().size([vWidth - margin, vHeight - margin]).padding(5);

    // Create main circle and sum values
    let vRoot = d3.hierarchy(data)
        .sum((d) => { return d.value; })
        .sort((a, b) => { return b.value - a.value }) // Sort data by value

    // Create children
    let vNodes = vRoot.descendants();

    // Set main circle for the main circle's layout
    vLayout(vRoot);

    // Render children
    let vSlices = g.selectAll('circle')
        .data(vNodes)
        .enter()
        .append("g")
        .append('circle')
        .attr("fill-opacity", ".3")
        .attr("class", function(d) { return d.parent ? d.children ? "node rootCircle" : "node node--leaf nodeCircle" : "node node--root rootCircle"; })
        // Interactions with mouse
        .on("mouseover", handleMouseOver)
        .on("mousemove", () => { tooltip.style("top", (event.pageY) + - 65 + "px").style("left", (event.pageX) + 10 + "px") })
        .on("mouseout", handleMouseOut)
        .on("click", handleClick)

    // Set label for main circle at loading the window
    d3.select(window).on("load", showLabelsOnInit())

/* ------------------------------------ Interactions ---------- */
    // Function for labelling the main circle
    function showLabelsOnInit() {
        g.selectAll("g")
            .filter((d) => { return d.parent === vRoot })
            .append("text")
            .attr("class", "root label")
            .text((d) => { return d.data.name })
            .attr("x", (d) => { return d.x })
            .attr("y", (d) => { return d.y + textMargin })
            .attr("text-anchor", "middle")
            .attr("font-size", ".8em")
    }

    // Function for labelling the child circles
    function showLabelsOnClick() {
        g.selectAll("g")
            .filter((d) => {
                if (clicked === false) {
                    return !d.children
                } else {
                    return d.parent === vRoot
                }
            })
            .append("text")
            .attr("x", (d) => { return d.x })
            .attr("y", (d) => { return d.y + 2 })
            .attr("class", (d) => { if (d.children) { return "root" } else { return "nodex label" } })
            .text((d) => { return d.data.name.substring(0, d.r / 2) })
            .transition()
    }

    // Draw diagram 
    vSlices.attr('cx', (d) => { return d.x; })
        .attr('cy', (d) => { return d.y; })
        .attr('r', (d) => { return d.r; })

    //Function for hovering over the circles
    /**
     * @param  {} d
     * @param  {} i
     */
    function handleMouseOver(d, i) {
        if (clicked === false) {
            d3.select(this)
            if (d3.select(this).classed("rootCircle") === true) {
                d3.select(this).transition()
                    .duration(100)
                    .attr("fill-opacity", .4)
                tooltip.transition().duration(200).style("opacity", .9)
                if (i.data.value === undefined) {
                    tooltip.html("Name: " + i.data.name + "</br>" + "Population: " + numberWithCommas(i.value))
                } else {
                    tooltip.html("Name: " + i.data.name + "</br>" + "Population: " + numberWithCommas(i.data.value))
                }
            } else {
                d3.select(".rootCircle").transition()
                    .duration(100)
                    .attr("fill-opacity", .4)
            }
        } else {
            d3.select(this)
                .filter(".nodeCircle")
                .transition()
                .duration(100)
                .attr("stroke", strokeColor)
                .attr("stroke-opacity", 1)

            .attr("fill-opacity", .4)
            if (d3.select(this).classed("nodeCircle") === true) {
                tooltip.transition().duration(200).style("opacity", .9)
                tooltip.html("Name: " + i.data.name + "</br>" + "Population: " + numberWithCommas(i.data.value))
            }
        }
    }

    // Function for removing the tooltip
    function handleMouseOut() {
        d3.select(this)
            .transition()
            .duration(300)
            .attr("stroke-opacity", 0)
        tooltip.transition().duration(200).style("opacity", 0)
    }

    // Function for clicking in the circles
    function handleClick() {
        showLabelsOnClick()

        let x, y, k;
        x = d3.select(this).attr("cx");
        y = d3.select(this).attr("cy");
        k = d3.select(this).attr("r");

        var scaleAmount = vHeight / (k * 2)

        if (clicked === true) {
            // Second click
            clicked = false;
            d3.selectAll(".nodeCircle").classed("node--leaf", true)
            g.transition()
                .duration(zoomSpeed)
                .ease(d3.easeBackOut.overshoot(.6))
                .attr("transform", "translate(" + vWidth / 2 + "," + vHeight / 2 + ")scale(null)")
            g.selectAll(".nodex").remove()
        } else {
            // First click
            d3.selectAll(".node--leaf").classed("node--leaf", false)
            g.transition()
                .duration(zoomSpeed)
                .ease(d3.easePolyInOut.exponent(3))
                .attr("transform", "translate(" + vWidth / 2 + "," + vHeight / 2 + ")scale(" + scaleAmount + ")translate(" + -x + ", " + -y + ")")
            vSlices.transition()
                .duration(zoomSpeed)
            clicked = true;
            g.selectAll(".root").remove()
        }
    }

    // Add thousand point for values
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
}
