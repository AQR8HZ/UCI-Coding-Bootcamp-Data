// from data.js
var tableData = data;

// Get a reference to the table body
var tbody = d3.select("tbody");

populateTable(tableData);

// populate the table using data from file
function populateTable(tableData){
  tableData.forEach((UfoReport) => {
    var row = tbody.append("tr");
    Object.entries(UfoReport).forEach(([key, value]) => {
      var cell = row.append("td");
      cell.text(value);
    });
  });
}

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

  // Filted the table based on the input value
  if (inputValue) {
    var filteredData = tableData.filter(UfoReport => UfoReport.datetime === inputValue);
  } 
  else {
      filteredData = data // No filter, present all records
  }

  console.log(filteredData);

  // Eliminate all table rows before populating the table with the requested filter
  var selection = d3.select("tbody").selectAll("tr")
  selection.remove();

  populateTable(filteredData);

});
 
