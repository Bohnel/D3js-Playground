//Body Werte definieren
var margin = {top: 50, right: 20, bottom: 80, left: 50} //Rand
    , width = window.innerWidth - margin.left - margin.right //Breite
    , height = window.innerHeight - margin.top - margin.bottom; //Höhe

//Y Achse definieren
var yScale = d3.scaleLinear()
    .domain([0, 280])
    .range([height - margin.bottom - margin.top, 0]);

d3.json("data/pokemon.json").then((data) => {

//X Achse definieren
var xScale = d3.scaleLinear()
    .range([0, width - margin.right])
    .domain([0, data.length])

//SVG erzeugen
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//X Achse erzeugen -> d3.axisBottom
svg.append("g")//Neue SVG gruppe auswählen
    .attr("class", "x axis")//CSS Style für X Achse
    .attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")//Achse an das untere Ende des Charts verschieben
    .call(d3.axisBottom(xScale).ticks(data.length / 2));//Achse erzeugen

//Y Achse erzeugen -> d3.axisLeft
svg.append("g")//Neue SVG gruppe auswählen
    .attr("class", "y axis")//CSS Style für Y Achse
    .call(d3.axisLeft(yScale));//Achse erzeugen

//Linie generieren
var line = d3.line()
    .x((d,i) => { return xScale(i); }) //X Werte
    .y((d) => { return yScale(d.base.HP); }) //Y Werte

//Linie erzeugen und dem Graphen hinzufügen
svg.append("path")
    .datum(data) //Daten aufrufen
    .classed("line", true) //CSS Style class für den Graph
    .attr("d", line) // Linie generieren

//Punkte erzeugen und dem graphen hinzufügen
svg.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle") // SVG Kreis erstellen
    .classed("dot", true) //CSS Style class für die Punkte
    .attr("cx", (d, i) => { return xScale(i) })
    .attr("cy", (d) => { return yScale(d.base.HP) })
    .attr("r", 5) //Radius vergeben
    .on("mouseover", function(d,i) {
        d3.select(this).attr("r", 15); //.dot wird 15px groß on hover
        div.transition().duration(200).style("opacity", 1); //tooltip wird sichtbar mit transition
        div.html("Name: " + i.name.english + "<br> HP: " + i.base.HP) //tooltip wird HP wert übergeben
    })
    .on("mousemove", () => { div.style("top", (event.pageY)+"px").style("left",(event.pageX)+"px");})
    .on("mouseout", function(d,i) {
        d3.select(this).attr("r", 5); //.dot wieder normal on hover out
        div.transition().duration(200).style("opacity", 0);
    })

//Tooltip für .dot
var div = d3.select("body").append("div")
    .classed("tooltip", true)
    .style("opacity", 0); //Unsichtbar 

//X Achsen Label
svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "start")
    .attr("x", 10)
    .attr("y", height - 60)
    .text("Pokemon-ID")
    .style("font-size", "24px")

//Y Achsen Label
svg.append("text")
    .attr("class", "x_label")
    .attr("text-anchor", "start")
    .attr("x", 10)
    .attr("y", 0)
    .text("HP")
    .style("font-size", "24px")
});

//Daten zu Attack wechseln
function AttackData() {
    d3.json("data/pokemon.json").then((data) => {

    var xScale = d3.scaleLinear()
        .range([0, width - margin.right])
        .domain([0, data.length])
    
    var line = d3.line()
        .x((d,i) => { return xScale(i); }) //X Werte
        .y((d) => { return yScale(d.base.Attack); }) //Y Werte
        
    var svg = d3.select("body").transition();

    svg.select(".line").duration(300).attr("d", line)
    var dots = svg.selectAll(".dot")
        .duration(300)
        .attr("cy", (d) => { return yScale(d.base.Attack) })

    svg.select(".x_label")
        .text("Attack")
    
    document.querySelector("button").innerHTML = "Change to HP value";
})};