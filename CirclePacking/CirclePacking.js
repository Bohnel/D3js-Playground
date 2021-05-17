//Body definition//

let width = 800, height = 600;

let canvas = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
    .attr("transform", "translate(50,50)");

var pack = d3.pack()
  .size([width, height - 50])
  .padding(1);

//Load JSON//
d3.json("/data/hierarchy.json").then((root) => {

  //daten sortieren 
  root = d3.hierarchy(root)
    .sum((d) => { return d.size; })
    .sort((a,b) => { return b.value - a.value})

  //Create and position circles
  let node = canvas.selectAll(".node")
    .data(pack(root).descendants())
    .enter()
    .append("g")
      .attr("class", (d) => { return d.children ? "node" : "leaf node"; })
      .attr("transform", (d) => { return "translate(" + d.x + "," + d.y + ")"; });
  //Define label
  node.append("title")
  .text(function(d) { return d.data.name + "\n" + d.data.size; });
  //Define circle
  node.append("circle")
      .attr("r", (d) => { return d.r; });
  //Create label
  node.filter((d) => { return !d.children; }).append("text")
      .attr("dy", "0.3em")
      .text((d) => { return d.data.name.substring(0, d.r / 3); });

});