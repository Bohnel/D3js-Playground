d3.json("data/pokemon.json").then((data) => {
    
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
    .x((d,i) => { return xScale(i); }) //X Werte
    .y((d) => { return yScale(d.base.HP); }) //Y Werte
    .curve(d3.curveMonotoneX)

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
            .style("left", (width/2) + margin.left + "px") //tooltip wird mittig ausgerichtet
            .style("top", "150px");	
    })
    .on("mouseout", function(d,i) {
        d3.select(this).attr("r", 5); //.dot wieder normal on hover out
        div.transition().duration(200).style("opacity", 0);
    })


//Wert bei Hover auf .dot
var div = d3.select("body").append("div")
    .classed("tooltip", true)
    .style("opacity", 0); //Unsichtbar 

//X Achsen Label
svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "start")
    .attr("x", 10)
    .attr("y", height+40)
    .text("pokemon-id")
    .style("font-size", "24px")

//Y Achsen Label
svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "start")
    .attr("x", 10)
    .attr("y", 0)
    .text("HP")
    .style("font-size", "24px")

});