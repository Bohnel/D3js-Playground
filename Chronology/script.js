/* -------------------------- Define window layout -------------------------- */
const valueSize = '12px';
const textMarginTop = 15;
const valueMarginTop = 35;
const textMarginLeft = 5;
let tooltipSideMargin = 10;
var imgmeta = {
  width: 0,
  height: 0,
  src: ''
}

var margin = { top: 15, right: 10, bottom: 45, left: 20 },
    width = window.innerWidth - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

/* ----------------------------- Create main SVG ---------------------------- */
var svg = d3.select("body").append("svg")
    .attr("width", width - margin.left - margin.right)
    .attr("height", height - margin.top - margin.bottom)
    .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.bottom + margin.top ]) //scale down real viewport
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/* ------------------------------------ Load data from JSON and call svg ---------- */
d3.json("./data/germanHistory.json").then((data) => {

  /* ------------------------------------ Data processing ---------- */
  let subgroups = [] //index
  let processedData = []
  let groups = []
// Fill group 
  for (const [key, value] of Object.entries(data)) {
    groups.push(key);
    if(subgroups.length < value.length){
      subgroups = [...Array(value.length).keys()];
    }
  }
// Subgroup Index Werte deklarieren
  for (const [key, value] of Object.entries(data)) {
    let obj = {'group': key}
    for(let i = 0; i< subgroups.length;i++) {
      obj[i] = 0
    }
    value.map((date, i)  => {
      obj[i] = 1
    })
    // Fill process data
    processedData.push(obj);
  }

  const x = d3.scaleBand()
  .domain(groups)
  .range([0, width])
  .padding([0.2])
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));


  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(d3.schemePastel1)

  const stackedData = d3.stack()
    .keys(subgroups)
    (processedData)

  var tooltip = d3.select("body").append("div")
    .classed("tooltip", true)
    .style("opacity", 1)

  svg.append("g")
    .selectAll("g")
    .data(stackedData)
    .join("g")
    .attr("fill", d => color(d.key))
    .selectAll("rect")
    .data(d => d)
    .join("rect")
      .attr("x", d => x(d.data.group))
      .attr("y", function(d, i) { 
        if (!isNaN(d[1])) {return height - d[1] * 21}})
      .attr("height", 20)
      .attr("width", x.bandwidth())
      .on("mouseover", handleTooltip)
      .on("mousemove", () => { 
        if (event.clientX > window.innerWidth / 2) 
        { 
          tooltipSideMargin = (event.clientX -610) 
        } else 
        { 
          tooltipSideMargin = event.clientX + 10 
        } 
        tooltip.style("top", (event.pageY) + (-200) + "px").style("left", tooltipSideMargin + "px") 
      })
      .on("mouseout", handleMouseOut)

/* ------------------------------------ Interactions ---------- */
    function handleTooltip(d, i){
      let text = ''
      let imageUrl = ''
      let date = ''
      let meta = '';

      d3.select(this)
        .transition()
        .duration(100)
        .style("stroke", "black")
        .style("opacity", .9)

      tooltip
        .transition()
        .duration(200)
        .style("opacity", 1)
        .attr("class", "tooltip")

      if(i[0] == i[1]) {
        imageUrl = data[i.data.group][i[0] -1].Picture
        date = data[i.data.group][i[0] -1].Date
        text = data[i.data.group][i[0] -1].Desc
      } else {
        imageUrl = data[i.data.group][i[0]].Picture
        date = data[i.data.group][i[0]].Date
        text = data[i.data.group][i[0]].Desc
      }

      getMeta(imageUrl);
      
      if (imageUrl === '') {
        tooltip.html(
            "<div class='tooltipBox' style='height:40vw;width:40vh;background-image: url(" + imageUrl + "); background-position: center;background-repeat: no-repeat;background-size: cover; height:" + 600 + "px; width:" + 600 + "px; '>" +
            "<div class='innerText' style='width: 100%'>" +
            "<h2>" + date + "</h2>" + "<hr class='divider' />" +
            "<p>" + text + "<p>" +
            "</div>" +
            "</div>")
    } else {
        tooltip.html(
            "<div class='tooltipBox' style='background-image: url(" + imageUrl+ "); " +
            "background-position: center;background-repeat: no-repeat;background-size: cover; height:" + imgmeta.height + "px; width:" + imgmeta.width + "px;'>" +
            "<div class='innerText'>" +
            "<h2>" + date + "</h2>" + "<hr class='divider' />" +
            "<p>" + text + "<p>" +
            "</div>" +
            "</div>")
    }
      

      tooltip
        .style("left", (d3.select(this)[0]) + "px")
        .style("top", (d3.select(this)[1]) + "px")
    }
    
    function handleMouseOut(d, i) {
      d3.select(this)
        .transition()
        .duration(300)
        .attr("stroke-opacity", 0)
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
        .attr("class", 'none')
    }
    
})

function getMeta(url) {
  
  const img = new Image();
    img.addEventListener("load", function() {
        // var ratio = Math.min(600 / this.naturalWidth, 600 / this.naturalHeight);
        // imgmeta.width = this.naturalWidth * ratio;
        // imgmeta.height = this.naturalHeight * ratio;
        imgmeta.width = 600;
        imgmeta.height = 600;
    })
  img.src = url;
}
