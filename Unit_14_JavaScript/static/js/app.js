// from data.js
var tableData = data;

// Get a reference to the table body
var tbody = d3.select("tbody");


// populate the table using data from file
tableData.forEach((weatherReport) => {
   var row = tbody.append("tr");
   Object.entries(weatherReport).forEach(([key, value]) => {
     var cell = row.append("td");
     cell.text(value);
   });
 });

// ------------------------------
// Script for filter
// ------------------------------


 // Select the submit button
var submit = d3.select("#filter-btn");

submit.on("click", function() {

  // Prevent the page from refreshing
  d3.event.preventDefault();

  // Select the input element and get the raw HTML node
  var inputElement = d3.select("#datetime");

  // Get the value property of the input element
  var inputValue = inputElement.property("value");

  console.log(inputValue);
  console.log(tableData);

  var filteredData = tableData.filter(person => person.bloodType === inputValue);

  console.log(filteredData);

  // BONUS: Calculate summary statistics for the age field of the filtered data

  // First, create an array with just the age values
  var ages = filteredData.map(person => person.age);

  // Next, use math.js to calculate the mean, median, mode, var, and std of the ages
  var mean = math.mean(ages);
  var median = math.median(ages);
  var mode = math.mode(ages);
  var variance = math.var(ages);
  var standardDeviation = math.std(ages);

  // Finally, add the summary stats to the `ul` tag
  d3.select(".summary")
    .append("li").text(`Mean: ${mean}`)
    .append("li").text(`Median: ${median}`)
    .append("li").text(`Mode: ${mode}`)
    .append("li").text(`Variance: ${variance}`)
    .append("li").text(`Standard Deviation: ${standardDeviation}`);
});
 
