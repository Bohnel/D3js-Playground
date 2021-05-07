1. D3 Libraty laden
    <script src="https://d3js.org/d3.v5.min.js"></script>
2. X und Y Skalen erstellen
    d3.scaleLinear().domain([0,n-1]).range([0,width])
3. linie erzeugen
    d3.line().x(function(d,i) {return xScale(i);})
4. SVG mit gewünschter größe erzeugen
    d3.select("body").append("svg").attr...
5. X und Y Skalen zuweisen
6. Graphen path erzeugen und daten übergeben
    svg.append("path").data(data).attr...
7. Kreis für jeden Datenpunt erstellen
    svg.selectAll("punkt").data(data).enter().append("circle").attr...