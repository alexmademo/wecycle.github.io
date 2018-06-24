var lat=-15.78 //latitude variable
var long=-47.93 //longitude variable
 var data_url="http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+long+"&appid=111111111111111111111111111";


   function getmyJson(data_url) {
 return JSON.parse($.ajax({
     type: 'GET',
     url: data_url,
     dataType: 'json',
     global: false,
     async:false,
     success: function(data) {

         var outGeoJson = {}
     outGeoJson['properties'] = data
     outGeoJson['type']= "Feature"
     outGeoJson['geometry']= {"type": "Point", "coordinates":
    [data.coord.lon, data.coord.lat]}

    var brasilia = L.geoJson(outGeoJson, { 
     onEachFeature: function (feature, layer)   
            {
            layer.bindPopup("N&#250;mero da RN: "+feature.properties.id+"<br>"+
                            "Localiza&#231;&#227;o: "+feature.properties.name+"<br>"+
                            "longitude: "+feature.geometry.coordinates[0]+"<br>"+
                            "latitude: "+feature.geometry.coordinates[1]
                            );//just to show something in the popup. could be part of the geojson as well!


        }

}).addTo(map);

    return outGeoJson;
     }
 }).responseText);

}
var myweather = getmyJson(data_url);