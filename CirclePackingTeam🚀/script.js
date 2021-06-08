// Fenstergröße Layout definieren
const margin = 100
const vWidth = 800
const vHeight = 800
let clicked = false

// Diagramm rendern
let g = d3.select('svg')
    .attr('width', vWidth)
    .attr('height', vHeight)
    .select('g')

// Div für Label rendern
let tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)

// Daten aus der JSON Datei laden und Zeichnen Funktion aufrufen
d3.json('/data/rental.copy.json').then((data) => {
    //größten Kreis als Wurzel abspeichern
    root = d3.pack(data)
    // Diagramm zeichnen
    drawViz(data)
})

// Zeichen Funktion
function drawViz(data){
    // Größten Kreis Layout definieren
    let vLayout = d3.pack()
        .size([vWidth, vHeight])
        .padding(5)

    // Größten Kreis erzeugen indem alle untere Kindervalues aufsummiert werden
    let vRoot = d3.hierarchy(data)
        .sum((d) => { 
            return d.value; 
        })
        // .sort((a,b) => {
        //     return b.value - a.value
        // })

    // Kinder erzeugen
    let vNodes = vRoot.descendants();
    
    // Dem Kreis Layout den größten Kreis übergeben
    vLayout(vRoot)

    // Kinderkreise rendern
    let vSlices = g.selectAll('circle')
        .data(vNodes)
        .enter()
        .append("g") //svg group for label
        .append('circle')
            .attr("fill-opacity", ".3")
            .attr("id", (d) => { if (d.data.main === "main") { return "main" }})
            // .attr("class", (d) => { return d.children ? "node" : "leaf"; })
            .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
            // Tooltips bei Mausbewegung
            .on("mouseover", handleMouseOver)
            .on("mousemove", () => { tooltip.style("top", (event.pageY) + -65 + "px").style("left", (event.pageX) + 10 + "px") })
            .on("mouseout", handleMouseOut)
            .on("click", handleClick)

    d3.select(window).on("load", showLabelsInit())

    //Show labels on load
    function showLabelsInit(d) {
        g.selectAll("g")
            .filter((d) => { return d.children })
            .append("text")
                .attr("class", "continent label")
                .text((d) => { return d.data.name })
                .attr("x", (d) => { return d.x })
                .attr("y", (d) => { return d.y + 5 })
                .attr("text-anchor", "middle")
                .attr("font-size", "2em")
    }

    //Show labels on click
    function showLabels(d) {
        console.log(clicked)
        g.selectAll("g")
            .filter((d) => { if (clicked === false) { 
                    return !d.children } 
                else { 
                    return d.children }})
            .append("text")
                .attr("x", (d) => { return d.x })
                .attr("y", (d) => { return d.y + 5 })
                .attr("class", (d) => { if ( d.children ) { return "continent label" } else { return "country label" }})
                .text((d) => { return d.data.name })
                .attr("font-size", 0)
                .attr("text-anchor", "middle")
                .transition()
                .duration(600)
                .attr("font-size", (d) => { if ( d.children ) { return "2em" } else { return ".8em" }})
    }

    // Diagramm zeichnen
    vSlices.attr('cx', (d) => { return d.x; })
            .attr('cy', (d) => { return d.y; })
            .attr('r', (d) => { return d.r; })

    //Show tooltip and add circle stroke
    function handleMouseOver(d,i) {
        if (clicked === false) {
        d3.select(this)
            .filter((d) => { return d.children })
            .transition()
            .duration(100)
            // .attr("stroke", "#EDF6F9")
            // .attr("stroke-opacity", 1)
            .attr("fill-opacity", .4)
        } else {
            d3.select(this)
            .filter((d) => { return !d.children })
            .transition()
            .duration(100)
            // .attr("stroke", "#EDF6F9")
            // .attr("stroke-opacity", 1)
            .attr("fill-opacity", .4)
            tooltip.transition().duration(200).style("opacity", .9)
            tooltip.html("name: " + i.data.name + "</br>" + "amount: " + i.data.value)
        }
    }

    //remove tooltip and circle stroke
    function handleMouseOut() {
        d3.select(this)
            .transition()
            .duration(300)
            // .attr("stroke-opacity", 0)
            .attr("fill-opacity", .3)
            tooltip.transition().duration(200).style("opacity", 0)
    }

    //zoom on click
    function handleClick() {
        showLabels()
        let x, y, k
        x = d3.select(this).attr("cx")
        y = d3.select(this).attr("cy")
        r = d3.select(this).attr("r")
        k = 4
        console.log(k);
        

        if (clicked === true) {
            // Zweiter Klick
            clicked = false
            g.transition()
                .ease(d3.easeBack,9)
                .duration(750)
                .attr("transform", "translate(" + vWidth / 2 + "," + vHeight / 2 
                    + ")scale()")
            g.selectAll(".country").transition().duration(100).remove()
        } else {
            //Erster Klick
            clicked = true
            d3.selectAll(".node--leaf").classed("node--leaf", false)
            g.transition()
                .ease(d3.easeExp,10)
                .duration(750)
                .attr("transform", "translate(" + vWidth / 2 + "," + vHeight / 2 
                    + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
            g.selectAll(".continent").remove()
        }
    } 
}