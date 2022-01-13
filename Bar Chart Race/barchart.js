/* -------------------------- Define window layout -------------------------- */
const vWidth = window.innerWidth - 50;
const vHeight = window.innerHeight - 150;
const margin = 50;
const ticker = 500;
const reverse = true;
const barHeight = 10;
const textMarginLeft = 15;
const maxData = 100;
let clicked = false;
let year;
let dataObj = {};
//Dimensions for bars
const rectProperties = { height: barHeight, padding: 10 }
//define color scale
const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, maxData));
const dropdown = d3.select('#dateDropdown');

/* ----------------------------- Create main SVG ---------------------------- */
var svg = d3.select("body").append("svg")
    .attr('width', vWidth)
    .attr('height', vHeight)
    .attr("viewBox", [0, 0, vWidth + margin * 2, vHeight + margin * 2])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
const yearLabel = d3.select("#yearLabel")

/* ------------------------------------ Load data from JSON and call the function drawViz ---------- */
async function fetchData() {
    const res = await fetch('./data/richestPeople.json');
    const data = await res.json();

    //Group data by date
    const groupedData = processData(data)
    dates = Array.from(groupedData.keys()).reverse()
    //Get the maximum value to define the scale width
    const maxvalue = getMax(data)
    dataObj.groupedData = groupedData;
    dataObj.maxvalue = maxvalue;
    dropdown.selectAll("option")
        .data(dates)
        .enter()
        .append("option")
        .attr("value", function (d) {
            return d;
        })
        .text(function (d) { return d; });
}
fetchData()

/* -------------------------- Buttons -------------------------- */
d3.select('#btn-start').on('click', startChartRace);
dropdown.on('click', selectEndDate);

function startChartRace() {
    d3.selectAll('g').remove()
    const array = Array.from(dataObj.groupedData.keys()).reverse()
    drawViz(dataObj.groupedData, dataObj.maxvalue, array[array.length]);
}

function selectEndDate() {
    d3.selectAll('g').remove()
    drawViz(dataObj.groupedData, dataObj.maxvalue, dropdown.node().value);
}

/* ------------------------------------ Visualize Function ----------------------------------- */
async function drawViz(data, max, datum) {
    //Create an Array of dates    
    let dateList = Array.from(data.keys())
    //Definde data order
    reverse ? dateList.reverse() : dateList
    //Group to display the diagram in
    const container = svg.append("g")
        .attr("class", "container")
        .style("transform", "translateY(25px)")
    //General scala for diagram
    const xScale = d3.scaleLinear()
    //Axis to show values on top
    const xAxis = svg.append("g")
        .attr("class", "axis")
        .style("transform", "translate(10px, 20px)")
        .call(d3.axisTop(xScale))
    const label = svg.append("g")
        .attr("class", "label")
        .append("text")
        .text("")
        .style("transform", "translate(" + vWidth / 1.1 + "px, " + vHeight + "px)")
        .attr("fill", "#fff")

    //Update dimensions on each date value
    const update = (date) => {
        // console.log("UPDATE " + date)
        //All values for the current date
        let presentData = data.get(date)
        // console.log("presentData" + presentData);
        year = date

        xScale
            .domain([0, max + margin]) //Set scale from 0 to max value
            // .domain([0, d3.max(Object.values(presentData), d => d.value) + 20]) //Set scale from 0 to max value
            .range([0, vWidth - margin]) //Set length of scale
        xAxis
            .call(d3.axisTop(xScale))

        svg.append("text")
            .attr("class", "axis")
            .attr("text-anchor", "end")
            .attr("fill", "white")
            .attr("x", vWidth -margin)
            .attr("y",  margin)
            .text("Mrd $");
        //Sort data by values
        const sortedRange = [...presentData]
            .sort((a, b) => b.value - a.value)
        //console.log("Sortiert: ", sortedRange)
        label.data(presentData).transition().delay(ticker).text(d => d.date)
        container
            .selectAll("text")
            .data(presentData)
            .enter()
            .append("text")
        container
            .selectAll("text")
            .text(d => d.name + " $" + d.value + " Mrd")
            .transition().delay(ticker)    //d3 texttween einbauen
            .style("fill", "#fff")
            .attr("x", d => xScale(d.value) + textMarginLeft)
            // .attr("y", (d, i) => sortedRange.findIndex(e => e.value === d.value) * (rectProperties.height + rectProperties.padding) + 15)
            .attr("y", (d) => sortedRange.indexOf(d) * (rectProperties.height + rectProperties.padding) + 15)
        container
            .selectAll("rect")
            .data(presentData)
            .enter()
            .append("rect")
        container
            .selectAll("rect")
            .attr("x", 10)
            .transition()
            .delay(ticker)
            .attr("fill", (d, i) => {
                return color(i);
            })
            .attr("y", (d) => sortedRange.indexOf(d) * (rectProperties.height + rectProperties.padding))
            .attr("width", d => xScale(d.value))
            .attr("height", barHeight)
    }

    //Iterate through dates until end
    if (datum > 0) {
        update(dateList[dateList.indexOf(Number(datum))])
    } else {
        for (const date of dateList) {
            update(date)
            await new Promise(done => setTimeout(() => done(), ticker))
        }
    }
}

//Group data by date
const processData = (data) => {
    return d3.group(data, d => d.date);
}

//Get biggest value
const getMax = (data) => {
    const maxV = d3.group(data, d => d.value)
    let maxArray = Array.from(maxV.keys())
    return d3.max(maxArray)
}

//entfernt nicht gebrauchte daten aus dem Array
function processEachDateData(data) {
    for (const value of data) {
        delete value.name
        delete value.value
        delete value.date
    }

    const obj = Object.keys(data).map(key => ({key, value: parseInt(data[key])}))
    console.log(obj)
    return obj
}
