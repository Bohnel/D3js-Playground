d3.json("pokemon.json").then(function(data) {
    
//Body Werte definieren
var margin = {top: 50, right: 50, bottom: 50, left: 50} //Rand
    , width = window.innerWidth - margin.left - margin.right //Breite
    , height = window.innerHeight - margin.top - margin.bottom; //Höhe

//Werte für die Größe des Charts definieren

//Dummy Datenpunkte definieren
// var länge = 5
var länge = data.length;

//X Achse definieren
var xScale = d3.scaleLinear()
    .range([0, width])
    .domain([0, länge-1])

//Y Achse definieren
var yScale = d3.scaleLinear()
    .domain([0, 300])
    .range([height, 0]);

//SVG erzeugen
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//X Achse erzeugen -> d3.axisBottom
svg.append("g")//Neue SVG gruppe auswählen
    .attr("class", "x axis")//CSS Style für X Achse
    .attr("transform", "translate(0," + height + ")")//Achse an das untere Ende des Charts verschieben
    .call(d3.axisBottom(xScale).ticks(data.length / 2));//Achse erzeugen

//Y Achse erzeugen -> d3.axisLeft
svg.append("g")//Neue SVG gruppe auswählen
    .attr("class", "y axis")//CSS Style für Y Achse
    .call(d3.axisLeft(yScale));//Achse erzeugen

//Linie generieren
var line = d3.line()
    .x(function(d,i) { return xScale(i); }) //X Werte
    .y(function(d) { return yScale(d.base.HP); }) //Y Werte
    .curve(d3.curveMonotoneX)

//Linie erzeugen und dem Graphen hinzufügen
svg.append("path")
    .datum(data) //Daten aufrufen
    .attr("class", "line") //CSS style für den Graph
    .attr("d", line); // Linie generieren

//Punkte erzeugen und dem graphen hinzufügen
svg.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle") // SVG Kreis erstellen
    .attr("class", "dot") //CSS Style der Punkte vergeben
    .attr("cx", function(d, i) { return xScale(i) })
    .attr("cy", function(d) { return yScale(d.base.HP) })
    .attr("r", 5) //Radius vergeben

svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "start")
    .attr("x", 10)
    
    .attr("y", height+30)
    .text("pokemon")
    .style("font-size", "24px")

svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "start")
    .attr("x", 10)
    .attr("y", 0)
    .text("HP")
    .style("font-size", "24px")
});