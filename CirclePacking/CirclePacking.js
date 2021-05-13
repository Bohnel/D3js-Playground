d3.json("/data/country-by-continent.json").then((data) => {

    var svg = d3.select("body")
        .append("svg")
        .attr("width", 950)
        .attr("height", 950)

    var format = d3.format(",d")

    var pack = d3.pack()
        .size([900, 900])
    data = d3.hierarchy(data)
        .sum(function(d) { return d.length; })
        .sort(function(a,b) { return 10; })

    var node = d3.select("svg")
        .append("g")
        .selectAll(".node")
        .data(pack(data).descendants())
        .enter().append("g")
            // .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

    //Hover
    node.append("title")
        .text(function(d) { 
            console.log(d.country);  return d.country + "\n" + 15; 
        })

    //Circle radius
    node.append("circle")
        .attr("r", function(d) { 
            return d.r; 
        });

    //Alle Circles ohne Children zeigen namen an
    node.filter(function(d) { return !d.children; })
        .append("text")
        .attr("dy", "0.1em")
        .text(function(d) { 
            return d.data.country; 
        });
});