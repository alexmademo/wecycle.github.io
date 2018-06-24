//Popups for the buttons, for a user to publish a bike:


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB49EXzOyyRVuuApccOgSLN2f5P4Svp3wg",
    authDomain: "urbanapps-wecycle.firebaseapp.com",
    databaseURL: "https://urbanapps-wecycle.firebaseio.com",
    projectId: "urbanapps-wecycle",
    storageBucket: "urbanapps-wecycle.appspot.com",
    messagingSenderId: "301286513420"
  };
  firebase.initializeApp(config);

window.db = firebase.database(); 
window.locRef1 = db.ref('transactions');
window.locRef2 = db.ref('users');
window.locRef3 = db.ref('trips');

//MARKERS LAYER:

var markerLayer = new L.LayerGroup();
var polylineLayer = new L.LayerGroup();
var markerLayerStart = new L.LayerGroup();
var markerLayerEnd = new L.LayerGroup();

//MAP:
var map = L.map('wecyclemap').setView([41.389072,2.183486], 14);

L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',{
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);

//MARKER OPTIONS:

var TripMarkerOptionsStart = {
    radius: 30,
    fillColor: "blue",
    color: "blue",
    weight: 3,
    opacity: 0.5,
    fillOpacity: 0
};

var TripMarkerOptionsEnd = {
    radius: 30,
    fillColor: "blue",
    color: "blue",
    weight: 3,
    opacity: 1,
    fillOpacity: 0
};

var PolylineMarkerOptions = {
    radius:10,
    stroke: true,
    color: "red",
    weight: 6,
    opacity: 0.25,
    lineCap:'round'
};

var BikeIcon = L.icon({
    iconUrl: 'assets/wecycle-mapicon.png',
    //shadowUrl: 'assets/wecycle-mapicon-shadow.png',
    iconSize: [300, 300], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
});

var popupcontents = {
    'biketype':'',
    'bikeprice': '',
    'timeavailable':'',
    'message':'',
    'contact':''
    //biketype, bikeprice, timeavailable, message, contact
};

//MARKER LAYERS:
map.addLayer(polylineLayer);
map.addLayer(markerLayerStart);
map.addLayer(markerLayerEnd);


//LISTENERS:
locRef3.on('value', function(snapshot){
    //console.log(snapshot);
    
    //'hours' VARIABLE IS THE OBJECT WHICH WILL POPULATE THE REAL-TIME ACTIVITY CHART.
    var hours = {
            '00':0,
            '01':0,
            '02':0,
            '03':0,
            '04':0,
            '05':0,
            '06':0,
            '07':0,
            '08':0,
            '09':0,
            '10':0,
            '11':0,
            '12':0,
            '13':0,
            '14':0,
            '15':0,
            '16':0,
            '17':0,
            '18':0,
            '19':0,
            '20':0,
            '21':0,
            '22':0,
            '23':0,
            '24':0
        };
    
    //THEN, INSIDE THAT, ITERATE OVER THE ITEMS YOU RECEIVE:
    var dataOn = snapshot.val();
    
    Object.keys(dataOn).forEach(function(key) {

        //console.log(key, dataOn[key]);
        
        //BELOW, WE ADD START AND END COORDINATES:
        var startLat = dataOn[key].start_lat;
        var startLon = dataOn[key].start_lon;
        var endLat = dataOn[key].end_lat;
        var endLon = dataOn[key].end_lon;
        var starttime = dataOn[key].start_time;
        var endtime = dataOn[key].end_time;
        //console.log(startLat, startLon);
        
                //FOR STARTPOINT AND ENDPOINT:
        var markerStart = L.circle([startLat, startLon], TripMarkerOptionsStart);
        var markerEnd = L.circle([endLat, endLon], TripMarkerOptionsEnd);
        markerLayerStart.addLayer(markerStart);
        markerLayerEnd.addLayer(markerEnd);
        
//        var marker = L.circle([startLat, startLon], TripMarkerOptionsStart);
//        markerLayer.addLayer(marker);
        
        //BELOW WE BUILD THE POLYLINE:
        //ITERATION INSIDE THE ITERATION:
        var points = [];
        var geometry = dataOn[key].geometry;
        
        Object.keys(dataOn[key].geometry).forEach(function(element){
            //console.log(geometry);    
            geometry.forEach(function(element) {
            var latforpolyline = element['latitude'];
            var lonforpolyline = element['longitude'];
            //latforpolyline = latforpolyline.replace('\"', '');
            //lonforpolyline = lonforpolyline.replace('\"', '');
            //console.log(latforpolyline);
            //console.log(lonforpolyline);
            //var latlon = [latforpolyline, lonforpolyline];
            points.push([latforpolyline, lonforpolyline]);
                
            //HERE, GET TIME:
            var hour =  element['timestamp'];   
            hour = hour.slice(10,12);
            hours[hour]++;
            return hours;
        });
        //YOU CAN JUST ADD THE CHART HERE:
        //console.log(hours);
        var hourslist = [];
            for(var key in hours) {
            //console.log(key, hours[key]);
            hourslist.push(hours[key]);
            }
        //console.log(hourslist);
        
        //WHY DO THE KEYS IN THIS OBJECT GET OUT OF ORDER??? IS THERE A WAY TO REORDER THEM?
            addLineChart({
            //'x':,
            'y':hourslist,
            type:'bar',
            //color:{},
        });
        
        //DRAW POLYLINE;
        //console.log(points);
        var polyline = L.polyline(points, PolylineMarkerOptions);
        polylineLayer.addLayer(polyline);
            
        var popupText = 'Start time: '+starttime.slice(10,12)+':'+starttime.slice(12,14)+'<br>'+'End time: '+endtime.slice(10,12)+':'+endtime.slice(12,14)+'<br>'+'Distance: '+'2.2 kilometers'+'<br>'+'Bike type: '+'Road bike'+'<br>'+'Price: '+'3.50 €/hr'+'<br>';
        polyline.bindTooltip(popupText).openTooltip();
        polyline.bindPopup(popupText);
        });
                
        //here, clean strings:
//        lat = lat.replace('\"', '');
//        lon = lon.replace('\"', '');

        //lat = lat.replace(/\D/g,'');

    });
});


//NEED A WHILE FUNCTION FOR AVAILABLE BIKES:
/*
while (CURRENTTIME>timeavailable) {
    //while time now (corrrectly formatted) is greater than the time available of the bike (correctly formatted), set the marker to true.
    //if the timestamp of now is greater than timem available, then destroy the marker.
};
*/

//CHARTS:
function addLineChart(dt){
    
    //lineChart ATTACHES TO THE HTML OBJECT:
    window.lineChart = $(".lineChart")[0];
    
    //dataLineMax CREATES THE LAYOUT:
    window.dataLineMax = {
        x:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
        y:dt['y'],
        name: 'WeCycle activity over 24h',
        mode: 'lines+markers',
        marker: {
            color: 'red', 
            size: 5, 
            opacity: 1
        },
        line: {
            color:'red'
            //color:dt['color'],
        }
    };
    
    //
    window.lineDataChart = [dataLineMax];
    //lineDataChart is just a name
    window.lineLayout = {
    //lineLayout is just a name
        //HEIGHT AND WIDTH ARE SET IN THE CSS FILE:
        //width: 1000,
        //height: 500,
        xaxis: {title: '24 hours',
                showgrid: true,
                dtick:1,
                gridcolor: '#000',
                gridwidth: 1,
                showline: true, 
                linewidth: 1,
                linecolor: '#000'},
        yaxis: {title:'WeCycle activity',
                showgrid: true, 
                gridcolor: '#000',
                gridwidth: 1,
                showline: true, 
                linewidth: 1,
                linecolor: '#000'},
        showlegend: false,
//      margin: {
//            l: 20, 
//            r: 20, 
//            b: 30, 
//            t: 50},
        autosize: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        hoverinfo: 'text',
        hovermode: 'closest'
    };    

    Plotly.newPlot(lineChart, lineDataChart, lineLayout, {displayModeBar: false});     
};


function chartColor(){
    dataBars['y'] = y;
    
    Plotly.update(lineChart, barDataChart, layout);
};

/*
locRef3.on('value', function(){
    addLineChart({'x':[1,3,2,4,6,9,7],'y':[9,7,5,2,3,1,6]});
});
*/
