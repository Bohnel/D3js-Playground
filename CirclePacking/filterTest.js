let width = 700, height = 700
let margin = 50

// let canvas = d3.select("body").append("svg")
//     .attr("width", width)
//     .attr("height", height)
//     .append("g")
//         .attr("class", "world")

// let pack = d3.pack()
//     .size([width, height])
//     .padding(5)

d3.json("https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-population.json").then((root) => {

    root = d3.hierarchy(root)
        .sum((d) => {
            return d.population;
        })

    let svg = d3.select("body")
        .append("svg")
        .attr("width", 800)
        .attr("height", 800)
        .append("g")

    let node =  

    function log(sel, msg) {
        console.log(sel, msg);
    }
});