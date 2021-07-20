/* -------------------------- define document size -------------------------- */
const width = 1200, height = 800

/* ----------------------------- create main svg ---------------------------- */
const svg = d3.select("body").append("svg").attr('width', width).attr('height', height);

/* ----------------------------- load main data ----------------------------- */
d3.json("../data/forbes400.json").then((data) => {
    console.log(data);
    console.log(data[0].uri + " " + data[1].finalWorth + "$")
    visualize(data);
});

function visualize(data) {
    //define color scale
    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.length + 1));
    //define max and min values
    const max = d3.max(data, d => d.finalWorth);
    const min = d3.min(data, d => d.finalWorth);
    //initialize group for each node
    const g = svg.selectAll("g").data(data).enter().append("g");
    //initialize rectangle for each node
    const rect = g.append("rect")
        .attr('x', 0)
        .attr('y', (d, i) => (i * 55) + 20)
        .attr('width', (d) => d.finalWorth / 200)
        .attr('height', 50)
        .attr("fill", (d, i) => {
            return color(i);
        })
    //initialize text for each node
    const text = g.append("text")
        .attr('x', 10)
        .attr('y', (d, i) => (i * 55) + 50)
        .text((d) => { return d.uri })
        .style("fill", "black");
    //define axis values
    var xScale = d3.scaleLinear()
        .domain([0, max])
        .range([1, max / 200]);
    //define axis visualisation
    var xAxis = d3.axisBottom(xScale);
    //initialize axis
    svg.append("g")
        .attr("transform", "translate(0,0)")
        .call(xAxis);
}