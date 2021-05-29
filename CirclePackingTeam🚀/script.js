// Fenstergröße Layout definieren
const margin = 100
const vWidth = window.innerWidth
const vHeight = window.innerHeight - margin
let clicked = false

// Diagramm rendern
let g = d3.select('svg')
    .attr('width', vWidth)
    .attr('height', vHeight)
    .select('g')

// Div für Label rendern
var div = d3.select("body").append("div")
    .classed("tooltip", true)
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
        .size([vWidth, vHeight - margin])
        .padding(10)

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
        .append('circle')
        .attr("fill-opacity", ".3")
        .attr("class", (d) => { return d.children ? "node" : "leaf"; })
        // Tooltips bei Mausbewegung
            .on("mouseover", handleMouseOver)
            .on("mousemove", () => { div.style("top", (event.pageY) + -65 + "px").style("left", (event.pageX) + 10 + "px") })
            .on("mouseout", handleMouseOut)
            .on("click", handleClick)

    vSlices.append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text((d,i) => { return i.name; })

    // Diagramm zeichnen
    vSlices.attr('cx', (d) => { return d.x; })
            .attr('cy', (d) => { return d.y; })
            .attr('r', (d) => { return d.r; })

    function handleMouseOver(d,i) {
        d3.select(this)
            .transition()
            .duration(100)
            .attr("stroke", "#EDF6F9")
            .attr("stroke-opacity", 1)
        div.transition().duration(200).style("opacity", .9)
        div.html("name: " + i.data.name + "</br>" + "amount: " + i.data.value)
    }

    function handleMouseOut() {
        d3.select(this)
            .transition()
            .duration(300)
            .attr("stroke-opacity", 0)
        div.transition().duration(200).style("opacity", 0)
    }

    function handleClick() {
        let x, y, k
        x = d3.select(this).attr("cx")
        y = d3.select(this).attr("cy")
        k = d3.select(this).attr("r")
        k = 4 //calculation

        if (clicked === true) {
            // Zweiter Klick
            clicked = false
            g.transition()
                .ease(d3.easeBack,9)
                .duration(750)
                .attr("transform", "translate(" + vWidth / 2 + "," + vHeight / 2 
                    + ")scale()")
        } else {
            //Erster Klick
            clicked = true
            g.transition()
                .ease(d3.easeExp,10)
                .duration(750)
                .attr("transform", "translate(" + vWidth / 2 + "," + vHeight / 2 
                    + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
            vSlices.transition()
                .duration(750)
                // .style("stroke-width", 1.5 / k + "px");
        }
    } 
}
