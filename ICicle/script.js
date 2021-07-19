/* -------------------------- define document size -------------------------- */
const width = 1200, height = 800

/* ----------------------------- create main svg ---------------------------- */
const svg = d3.select("body").append("svg").attr('width', width).attr('height', height);

/* ----------------------------- load main data ----------------------------- */
d3.json("../data/CountriesByContinent.json").then((data) => {
    visualize(data);
});

/* ----------------------------- draw main graph ---------------------------- */
const visualize = (data) => {
    //define color scale
    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));
    //define hierarchy, sort by size
    const root = d3.hierarchy(data)
        .sort((a, b) => b.height - a.height)
        .count();

    let focus = root;
    
    //initialize group for each node
    const g = svg.selectAll("g").data(root).enter().append("g");
    //define partition layout
    const partition = d3.partition()
        .size([width, 500])
        .padding(1);
    //call partition
    partition(root);
    //initialize rectangle for each node
    const rect = g.append("rect")
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr("fill", d => {
            //root node
            if (!d.depth) return "#ccc";
            //each children
            while (d.depth > 1) d = d.parent;
            return color(d.data.name);
        })
    //initialize text for each node
    const text = g.append("text")
        .attr('x', d => d.x0)
        .attr('y', d => d.y0 + 15)
        .text((d) => { return d.data.name });

}