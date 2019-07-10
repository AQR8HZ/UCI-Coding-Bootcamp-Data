// Define a markerSize function that will give each eathquake a different radius based on its magnidude
function markerSize(magnitude) {
  return magnitude * 30000;
}

function getColor(d) {
  return d > 5  ? '#e21c15fd' :
         d > 4  ? '#d66f1b' :
         d > 3  ? '#d39522' :
         d > 2  ? '#d3c228' :
         d > 1  ? '#a3d31f' :
                  '#0fdf32';
}

var dataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var cities = [];
var earthquakeMarkers = [];

// Obtain json data from dataURL
var locations = d3.json(dataUrl, function(response) {
  var features = response.features;
  console.log("features", features)
  for (var i = 0; i < features.length; i++) {
    var properties = features[i].properties;
    var geometry = features[i].geometry;
    if (geometry) {
      cities.push({"place": properties.place, "time": properties.time, "status": properties.status, "magnitude": properties.mag, "location": [geometry.coordinates[1], geometry.coordinates[0]]});
    }
  }

//console.log("cities", cities)
// Loop through the cities array and create one marker for each city object
  for (var i = 0; i < cities.length; i++) {
    earthquakeMarkers.push(
      L.circle(cities[i].location, {
        fillOpacity: 0.80,
        color: 'black',
        stroke: false,
        fillColor: getColor(cities[i].magnitude),
        radius: markerSize(cities[i].magnitude)
      }).bindPopup("<h1>" + cities[i].place + "</h1> <hr> <h3>Magnitude: " + cities[i].magnitude + "</h3> Time:" + new Date(cities[i].time) ).addTo(myMap)
    )
  }
});



// Define variables for our base layers
var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});

var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY
});

var tectonicPlatesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"


// Create two separate layer groups: one for cities and one for states
var earthquakes = L.layerGroup(earthquakeMarkers);
var tectonicPlates = L.layerGroup(tectonicPlatesLines);

// Create a baseMaps object
var baseMaps = {
  "Satellite": satellite,
  "Grayscale": grayscale,
  "Outdoors": outdoors
};

// Create an overlay object
var overlayMaps = {
  "Earthquakes": earthquakes,
  "Fault Lines": tectonicPlates
};

// Define a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 3,
  layers: [satellite, tectonicPlates, earthquakes]
});

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);

var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend'),
  grades = [0, 1, 2, 3, 4, 5],
  labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
    '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
  return div;
};

legend.addTo(myMap);


// Our style object
var mapStyle = {
  color: "orange",
  weight: 1.0
};


var tectonicPlatesLines = d3.json(tectonicPlatesUrl, function(data) {
  // Creating a geoJSON layer with the retrieved data
 // console.log("tectonic data", data)
  L.geoJson(data, {
    // Passing in our style object
    style: mapStyle
  }).addTo(myMap);
});