// Fenstergröße Layout definieren
const vWidth = 800;
const vHeight = 800;
const margin = 50;
let clicked = false;

let view;

// Diagramm rendern
let g = d3.select('svg').attr('width', vWidth).attr('height', vHeight).select('g');

// Div für Label rendern
var div = d3.select("body").append("div")
    .classed("tooltip", true)
    .style("opacity", 0);

// Daten aus der JSON Datei laden und Zeichnen Funktion aufrufen
d3.json('data.json').then((data) => {
    //größten Kreis als Wurzel abspeichern
    root = d3.pack(data);
    // Fokus auf dem größten Kreis
    focus = root;
    // Diagramm zeichnen
    drawViz(data);
});

// Zeichnen Funktion
function drawViz(data) {
    // Größten Kreis Layout definieren
    let vLayout = d3.pack().size([vWidth - margin, vHeight - margin]).padding(15);

    // Größten Kreis erzeugen indem alle untere Kindervalues aufsummiert werden
    let vRoot = d3.hierarchy(data).sum((d) => {
        console.log("Sum-Funktion", d.value)
        return d.value;
    })

    // Kinder erzeugen
    let vNodes = vRoot.descendants();

    // Dem Kreis Layout den größten Kreis übergeben
    vLayout(vRoot);

    // Kinderkreise rendern
    let vSlices = g.selectAll('circle')
        .data(vNodes)
        .enter()
        .append("g")
        .append('circle')
        .attr("fill-opacity", ".3")
        .attr("id", (d) => { if (d.data.main === "main") { return "main" } })
        // .attr("class", (d) => { if (d.children) { return "rootCircle" } else { return "nodeCircle" } })
        .attr("class", function(d) { return d.parent ? d.children ? "node rootCircle" : "node node--leaf nodeCircle" : "node node--root rootCircle"; })
        // Tooltips bei Mausbewegung
        .on("mouseover", handleMouseOver)
        .on("mousemove", () => { div.style("top", (event.pageY) + -65 + "px").style("left", (event.pageX) + 10 + "px") })
        .on("mouseout", handleMouseOut)
        .on("click", handleClick)

    // Beim Laden des Fensters die größten Kreise bschriften
    d3.select(window).on("load", showLabelsOnInit())

    // Funktion: größte Kreise beschriften
    function showLabelsOnInit() {
        g.selectAll("g")
            .filter((d) => { return d.children })
            .append("text")
            .attr("class", "root label")
            .text((d) => { return d.data.name })
            .attr("x", (d) => { return d.x })
            .attr("y", (d) => { return d.y + 5 })
            .attr("text-anchor", "middle")
            .attr("font-size", ".8em")
    }

    // Funktion: Kleinere Kreise beschriften
    function showLabelsOnClick() {
        g.selectAll("g")
            .filter((d) => {
                if (clicked === false) {
                    return !d.children
                } else {
                    return d.children
                }
            })
            .append("text")
            .attr("x", (d) => { return d.x })
            .attr("y", (d) => { return d.y + 5 })
            .attr("class", (d) => { if (d.children) { return "root" } else { return "nodex label" } })
            .text((d) => { return d.data.name })
            .attr("font-size", 0)
            .attr("text-anchor", "middle")
            .transition()
            .duration(150)
            .attr("font-size", ".8em")
    }

    // Diagramm zeichnen
    vSlices.attr('cx', (d) => { return d.x; })
        .attr('cy', (d) => { return d.y; })
        .attr('r', (d) => { return d.r; })

    //Funktion: Über die Kreise hovern
    function handleMouseOver(d, i) {
        if (clicked === false) {
            d3.select(this)
                // .filter((d) => { return d.children })
                .filter(".rootCircle")
                // if (d3.select(this).attr("class") === "node rootCircle") {
            if (d3.select(this).classed("rootCircle") === true) {
                console.log("tooltip")
                d3.select(this).transition()
                    .duration(100)
                    // .attr("stroke", "#EDF6F9")
                    // .attr("stroke-opacity", 1)
                    .attr("fill-opacity", .4)
                div.transition().duration(200).style("opacity", .9)
                if (i.data.value === undefined) {
                    div.html("name: " + i.data.mainName + "</br>" + "amount: " + i.value)
                } else {
                    div.html("name: " + i.data.name + "</br>" + "amount: " + i.data.value)
                }
            } else {
                // if not clicked and is no rootCircle then select rootCircle
                console.log("This", parent)
                d3.select(".rootCircle").transition()
                    .duration(100)
                    // .attr("stroke", "#EDF6F9")
                    // .attr("stroke-opacity", 1)
                    .attr("fill-opacity", .4)
            }
        } else {
            d3.select(this)
                // .filter((d) => { return !d.children })
                .filter(".nodeCircle")
                .transition()
                .duration(100)
                .attr("stroke", "#EDF6F9")
                .attr("stroke-opacity", 1)
                .attr("fill-opacity", .4)
                // if (d3.select(this).attr("class") === "nodeCircle") {
            if (d3.select(this).classed("nodeCircle") === true) {
                div.transition().duration(200).style("opacity", .9)
                div.html("name: " + i.data.name + "</br>" + "amount: " + i.data.value)
            }
        }
    }

    function handleMouseOut() {
        d3.select(this)
            .transition()
            .duration(300)
            .attr("stroke-opacity", 0)
        div.transition().duration(200).style("opacity", 0)
    }

    function handleClick() {
        // Beim Klicken kleinere Kreise beschriften
        showLabelsOnClick()

        let x, y, k;
        x = d3.select(this).attr("cx");
        y = d3.select(this).attr("cy");
        k = d3.select(this).attr("r");

        var scaleAmount = vHeight / (k * 2)

        if (clicked === true) {
            // Zweiter Klick
            clicked = false;
            d3.selectAll(".nodeCircle").classed("node--leaf", true)
            g.transition()
                .duration(750)
                .attr("transform", "translate(" + vWidth / 2 + "," + vHeight / 2 + ")scale(null)")
            g.selectAll(".nodex").remove()
        } else {
            //Erster Klick
            d3.selectAll(".node--leaf").classed("node--leaf", false)
            g.transition()
                .duration(750)
                .attr("transform", "translate(" + vWidth / 2 + "," + vHeight / 2 + ")scale(" + scaleAmount + ")translate(" + -x + ", " + -y + ")")
            vSlices.transition()
                .duration(750)
            clicked = true;
            g.selectAll(".root").remove()
        }
    }
}