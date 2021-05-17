const margin = 50, width = window.innerWidth - margin , height = window.innerHeight - margin;

//Generate Canvas with an SVG of 600x600px + 50px Margin
let canvas = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
        .attr("transform", "translate(" + margin + ", " + margin + ")");

//Set Tree size
let tree = d3.tree()
    .size([width - margin, height - margin - 20]);

//Load JSON
// d3.json("/data/flare.json").then((data) => {
d3.json("/data/hierarchy.json").then((data) => {

    //Load data as a hierarchy
    let treeRoot = d3.hierarchy(data)
    tree(treeRoot)
    //Shows every object
    const nodes = treeRoot.descendants()
    // const links = treeRoot.links()

    //Generate dots for every node
    let node = canvas.selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
            .attr("class", "node")
            .attr("transform", (d) => { return "translate(" + d.x + "," + d.y + ")" })
    //Define dots
    node.append("circle")
        .attr("r", 5)
        .attr("fill", "gray");
    //define labels
    node.append("text")
        .text((d) => { return d.data.name; })
        .attr("transform", "translate(10, 20)");
        
    //Generate line 
    canvas.selectAll(".link")
        .data(nodes.slice(1))
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("d", (d) =>{
            return "M" + d.x + "," + d.y
                + "C" + d.x + "," + (d.y + d.parent.y) / 2
                + " " + d.parent.x + "," +  (d.y + d.parent.y) / 2
                + " " + d.parent.x + "," + d.parent.y;
            });

    // function log(sel) {
    //     console.log(sel);
    // }
});