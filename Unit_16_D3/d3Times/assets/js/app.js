var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(journalData, chosenXAxis) {
  // create scales
  console.log("create X scales", chosenXAxis)

  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(journalData, d => d[chosenXAxis]) * 0.8,
      d3.max(journalData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);
  return xLinearScale;
}


// function used for updating y-scale var upon click on axis label
function yScale(journalData, chosenYAxis) {
  // create scales
  console.log("create Y scales", chosenYAxis)

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(journalData, d => d[chosenYAxis])])
    .range([height, 0]);
  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  console.log("renderXAxes xAxis: ", xAxis)    

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(2000)
    .call(leftAxis);
  
    console.log("renderYAxes yAxis: ", yAxis)   

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(2000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  if (chosenXAxis === "poverty") { var xlabel = "Poverty (%):";  }
  if (chosenXAxis === "age") { var xlabel = "Age (median):";  }
  if (chosenXAxis === "income") { var xlabel = "Income (median):";  }

  if (chosenYAxis === "obesity") { var ylabel = "Obese (%):";  }
  if (chosenYAxis === "smokes") { var ylabel = "Smokes (%):";  }
  if (chosenYAxis === "healthcare") { var ylabel = "Healthcare (%):";  }
  
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv", function(err, journalData) {
  if (err) throw err;

  // parse data
  journalData.forEach(function(data) {
  
    // X axes data
    data.poverty = +data.poverty;       // Hair_length
    data.age = +data.age;               // Albums Released
    data.income = +data.income;
  
    // Y axes data
    data.healthcare = +data.healthcare; // Num_hits
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
  
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(journalData, chosenXAxis);
  var yLinearScale = yScale(journalData, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
   
  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);    

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(journalData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 14)
    .attr("fill", "blue")
    .attr("opacity", ".4");

  //format the text for each circle
  circlesGroup
    .append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .attr("text-anchor", "middle")
    .text(function(d) { return d.abbr; })
    .style("fill","Black")
    .style("font-family", "Helvetica Neue, Helvetica, Arial, san-serif")
    .style("font-size", "12px");
  
  console.log("abbr", circlesGroup)

  // Create group for  3 x- axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("valueX", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("valueX", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("valueX", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)"); 


    // Create group for  3 y- axis labels
  var ylabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

  var obesityLabel = ylabelsGroup.append("text")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("valueY", "obesity") // value to grab for event listener
    .classed("inactive", true)
    .text("Obese (%)");

  var smokesLabel = ylabelsGroup.append("text")
    .attr("y", 0 - margin.left + 20)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("valueY", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");

  var healthcareLabel = ylabelsGroup.append("text")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("valueY", "healthcare") // value to grab for event listener
    .classed("active", true)
    .text("Lacks Healthcare (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("valueX");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        console.log("chosenXAxis", chosenXAxis)

        // functions here found above csv import
        // updates x & y scales for new data
        xLinearScale = xScale(journalData, chosenXAxis);
        yLinearScale = yScale(journalData, chosenYAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);            
        }
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);            
        }
        if (chosenXAxis === "income") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);            
        }
      }
    });

  // y axis labels event listener
  ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("valueY");
      if (value !== chosenYAxis) {

        // replaces chosenYAxis with value
        chosenYAxis = value;

        console.log("chosenYAxis", chosenYAxis)

        // functions here found above csv import
        // updates x & y scales for new data
        xLinearScale = xScale(journalData, chosenXAxis);
        yLinearScale = yScale(journalData, chosenYAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "obesity") {
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);            
        }
        if (chosenYAxis === "smokes") {
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);            
        }
        if (chosenYAxis === "healthcare") {
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);            
        }
      }
    });    
});
