// Fenstergröße Layout definieren
let vWidth = window.innerWidth;
let vHeight = window.innerHeight;
let margin = 150;

// Diagramm rendern
let g = d3.select('svg')
    .attr('width', vWidth)
    .attr('height', vHeight)
    .select('g');

// Div für Label rendern
var div = d3.select("body").append("div")
    .classed("tooltip", true)
    .style("opacity", 0);

// Daten aus der JSON Datei laden und Zeichnen Funktion aufrufen
d3.json('/data/rental.json').then((data) => {
    console.log(data);
    drawViz(data);
});

// Zeichnen Funktion
function drawViz(data){
    // Größten Kreis Layout definieren
    let vLayout = d3.pack()
        .size([vWidth, vHeight - margin]);

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
    vLayout(vRoot);

    // Kinderkreise rendern
    let vSlices = g.selectAll('circle')
        .data(vNodes)
        .enter()
        .append('circle')
        .on("mouseover", (d,i) => {
            div.transition().duration(200).style("opacity", 1);
            div.html(i.data.name + "</br>" + i.data.value);
        })
        .on("mousemove", () => { 
            div.style("top", (event.pageY)+"px").style("left",(event.pageX)+"px");})
        .on("mouseout", (d,i) => {
            div.transition().duration(200).style("opacity", 0);
        })
        .call(d3.zoom().on("zoom", (event) => {
            vSlices.attr('transform', event.transform);
        }))

    vSlices.append("text")
        .attr("dy", ".3em")
        .text((d) => { return d.data.name; })

    // Diagramm zeichnen
    vSlices.attr('cx', (d) => { return d.x; })
            .attr('cy', (d) => { return d.y; })
            .attr('r', (d) => { return d.r; });
}
