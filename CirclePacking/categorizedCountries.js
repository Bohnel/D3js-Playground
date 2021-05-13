d3.json("/data/country-by-continent.json").then((data) => {
    //SVG Größe definieren
    const width = window.innerWidth
    const height = window.innerHeight

    //SVG erstellen
    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)

    var x = d3.scaleOrdinal()
        .range([0, 100, 200, 300, 400, 500, 600])
    
    var color = d3.scaleOrdinal()
        .range(["green", "blue", "red", "gray", "pink", "yellow", "violet"])

    //Tooltip
    var tooltip = d3.select("body")   
        .append("div")
        .style("opacity", 0)
        .classed("tooltip", true)

    var mouseover = (d) => {
        tooltip
            .style("opacity", 1)
        }

    var mousemove = (d) => {
        tooltip
            .html("<b>" + d.country + "</b>" + "<br>" + d.continent)
            .style("top", (event.pageY)+"px").style("left",(event.pageX)+"px");
        }

    var mouseleave = (d) => {
        tooltip
            .style("opacity", 0)
        }

    //Circles erstellen
    var node = svg.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
            .attr("r", 10)
            .attr("cx", width / 2 + "px")
            .attr("cy", height / 2 + "px")
            .style('fill', (d) => { return color(d.continent)})
            .attr("stroke", "black")
            .attr("stroke-width", "1px")
            .text((d) => { return d.continent; })
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

    //Force Simulation
    var simulation = d3.forceSimulation()
        .force("x", d3.forceX().strength(0.5).x((d) => {return x(d.continent)}))
        .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
        .force("charge", d3.forceManyBody().strength(1)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(.1).radius(10).iterations(1)) // Force that avoids circle overlapping
    
    //Execute Force Simulation
    simulation
        .nodes(data)
        .on("tick", function(d){
            node
                .attr("cx", (d) => { return d.x; })
                .attr("cy", (d) => { return d.y; })
        });


});