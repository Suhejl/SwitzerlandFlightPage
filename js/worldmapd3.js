const $backTop = $(".back-to-top");
var format = d3.format(",");

// Set tooltips
var tip = d3
  .tip()
  .attr("class", "d3-tip")
  .direction("n")
  .style("z-index", 100)
  //   .rootElement(document.getElementById('graph'))
  .html(function (d) {
    return (
      "<strong>Country: </strong><span class='details'>" +
      d.properties.name +
      "<br></span>" +
      "<strong>Population: </strong><span class='details'>" +
      format(d.population) +
      "</span>"
    );
  });

// var viewportWidth = $(window).width();
// var viewportHeight = $(window).height()/2;
// var width = viewportWidth * .97;
// var height = width/1.85;

var margin = { top: 0, right: 0, bottom: 0, left: 0 },
  width = 960 - margin.left - margin.right,
  height = width;

// d3.select(window).on('resize', resize);

// function resize() {

//     width = parseInt(d3.select('div#graph').style('width'));
//     width = $(window).width() * .97;
//     height = width/1.85;

//    projection
//     	.scale([width/3.5])
//    		.translate([width/1,height*1.4]);

//    d3.select("div#graph").attr("width",width).attr("height",height);
//    d3.select("svg").attr("width",width).attr("height",height);

//    d3.selectAll("path").attr('d', path);

// }

var color = d3
  .scaleThreshold()
  .domain([
    10000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000,
    500000000, 1500000000,
  ])
  .range([
    "rgb(247,251,255)",
    "rgb(222,235,247)",
    "rgb(198,219,239)",
    "rgb(158,202,225)",
    "rgb(107,174,214)",
    "rgb(66,146,198)",
    "rgb(33,113,181)",
    "rgb(8,81,156)",
    "rgb(8,48,107)",
    "rgb(3,19,43)",
  ]);

var path = d3.geoPath();

var graph = document.getElementById("graph");
var width2 = graph.clientWidth;
height = width2 / 1.3;

var svg = d3
  .select("div#graph")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 " + width2 + " " + height)
  .classed("svg-content-responsive", true)
  .append("g")
  .attr("class", "map");

var projection = d3
  .geoMercator()
  .scale(width2 / 10)
  .translate([width2 / 2, width2 / 2]);
var path = d3.geoPath().projection(projection);

svg.call(tip);

d3.queue()
  .defer(d3.json, "../world_countries.json")
  .defer(d3.tsv, "../world_population.tsv")
  .await(ready);

function ready(error, data, population) {
  var populationById = {};

  population.forEach(function (d) {
    populationById[d.id] = +d.population;
  });
  data.features.forEach(function (d) {
    d.population = populationById[d.id];
  });

  let lastSelectedCountry = undefined;

  svg
    .append("g")
    .attr("class", "countries")
    .selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill", function (d) {
      return color(populationById[d.id]);
    })
    .style("stroke", "white")
    .style("stroke-width", 1.5)
    .style("opacity", 0.8)
    // tooltips
    .style("stroke", "white")
    .style("stroke-width", 0.3)
    .on("mouseover", function (d) {
      tip.show(d, this);

      d3.select(this)
        .style("opacity", 1)
        .style("stroke", "white")
        .style("stroke-width", 3)
        .style("cursor", "pointer");

      $(this).on("mouseout", function (d) {
        tip.hide(d);
    
        if (lastSelectedCountry !== this) {
          d3.select(this)
            .style("opacity", 0.8)
            .style("stroke", "white")
            .style("stroke-width", 0.3);
        }
      });
    })
    .on("click", function (d) {
      console.log(`clicked ${d.id}`);

      if (lastSelectedCountry) {
        d3.select(lastSelectedCountry)
          .style("opacity", 0.8)
          .style("stroke", "white")
          .style("stroke-width", 0.3);
      }

      lastSelectedCountry = this;

      $backTop.removeClass("is-hidden").attr("id", `${d.id}`);

      d3.select(this)
        .style("opacity", 1)
        .style("stroke", "white")
        .style("stroke-width", 3)
        .style("cursor", "pointer");

      $(this).on("mouseout", function (d) {
        tip.hide(d);

        d3.select(this)
          .style("opacity", 1)
          .style("stroke", "white")
          .style("stroke-width", 3)
          .style("cursor", "pointer");
      });
    });

  // svg
  //   .append("path")
  //   .datum(
  //     topojson.mesh(data.features, function (a, b) {
  //       return a.id !== b.id;
  //     })
  //   )
  //   // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
  //   .attr("class", "names")
  //   .attr("d", path);
}

$backTop.on("click", (e) => {
  this.location.href = `flights.html?id=${e.delegateTarget.id}`;
});
