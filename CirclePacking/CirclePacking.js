//Body definition//
let width = 700, height = 700
let margin = 50

let canvas = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
    .attr("class", "world")

let pack = d3.pack()
  .size([width, height])
  .padding(5)

//Load JSON//
d3.json("/data/countryByContinent.json").then((root) => {
  
  console.log(root);
  //daten sortieren 
  root = d3.hierarchy(root)
    .sum((d) => { return d.size; })
    // .sort((a,b) => { return b.value - a.value}) //only for unsorted data

  //Create and position circles
  let node = canvas.selectAll(".node")
    .data(pack(root).descendants())
    .enter()
    .append("g")
      // .attr("class", (d) => { return d.children ? "node" : "leaf node"; })
      .attr("class", (d) => { if ( d.data.name === "Europe" || d.data.name === "Asia" 
                            || d.data.name === "Africa" || d.data.name === "North America" || d.data.name === "world") {
        return "continent node"
      } else {
        return "leaf node";
      }})
      .attr("transform", (d) => { return "translate(" + d.x + "," + d.y + ")"; })

  //Define hover
  node.append("title")
    .text((d) => { 
      return d.data.name + "\n" + d.data.size; 
    })

  //Define circle
  node.append("circle")
      .attr("r", (d) => { return d.r; })
  
  //Create label
  node.filter((d) => { return !d.children; })
      .append("text")
      .attr("dy", "0.3em")
      .text((d) => { return d.data.name.substring(0, d.r / 4); })

  //define color and hover
  canvas.selectAll(".node")
    .attr("fill", "#2a9d8f")
  canvas.selectAll(".leaf")
    .attr("fill", "#e9c46a")
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)

  function handleMouseOver() {
    d3.select(this).transition().duration(150).attr("fill", "#f4a261")
  }
  function handleMouseOut() {
    d3.select(this).transition().duration(300).attr("fill", "#e9c46a")
  }
  function log(msg, sel) {
    console.log(sel);
  }
});