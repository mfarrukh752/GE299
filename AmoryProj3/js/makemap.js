var map;

function getColor(p) {
		return p > .5 ? '#02006C' :  //greater than 50%
				   p > .4  ? '#090088' : //greater than 40%
				   p > .3  ? '#4D1B7B' : //greater than 30%
				   p > .2  ? '#D3168C' : //greater than 20%
							         '#EA1136'; //fall back value
}

//function to instantiate the Leaflet map
function createMap(){

    //create the map
    map = L.map('mapid', {
        center: [42.2626,-71.8023],
        zoom: 8
    });

    //add  base tilelayer
		var myBasemap =  L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
				maxZoom: 25,
        minZoom: 12,
				attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
				});

		myBasemap.addTo(map);

    //call getData function
    getData(map);

    //create legend
    var legend = L.control({position: 'bottomright'});
        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                grades = [20, 30, 40, 50],
                labels = [];

            // loop through our density intervals and generate a label with a colored square for each interval
            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor((grades[i]+1)/100) + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }

            return div;
        };
        legend.addTo(map);

};



//function to retrieve the data and place it on the map
function getData(map){

//because we are creating a choropleth map, we set the color with a function
  function myStyle(feature) {
    return {
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
      //this equation uses the "getColor" function above to set the color based on the difference between votes divided by those cast
      fillColor: getColor((feature.properties.biden-feature.properties.trump)/feature.properties.cast_total)
    };
  }

  //load the data, then map
    $.getJSON("data/worcElection20.geojson", function(response){

            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(response, {
									style: myStyle
            }).addTo(map);
    });
};


$(document).ready(createMap);
