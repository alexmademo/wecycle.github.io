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
window.locRefAll = db.ref('urbanapps-wecycle');

//MARKERS LAYER:
var transactionLayer = new L.LayerGroup();
var markerLayer = new L.LayerGroup();
var polylineLayer = new L.LayerGroup();

//MAP:
var map = L.map('wecyclemap').setView([41.396940,2.194380], 14);

L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',{
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);

//MARKER OPTIONS:
var MarkerOptions = {
    radius: 50,
    fillColor: "#0000ff",
    color: "#000",
    weight: 1,
    opacity: 0,
    fillOpacity: 0.75,
    icon:bikeIcon
};

var bikeIcon = L.icon({
    iconUrl: 'assets/wecycle-mapicon.png',
    shadowUrl: 'assets/wecycle-mapicon-shadow.png',
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

//FIRST, DO A 'ONDATA' LISTENER/STREAMER:
locRef1.on('value', function(snapshot){
    console.log(snapshot);
    //THEN, INSIDE THAT, ITERATE OVER THE ITEMS YOU RECEIVE:
    var dataOn = snapshot.val();
    
    Object.keys(dataOn).forEach(function(key) {

        console.log(key, dataOn[key]);
        var lat = dataOn[key].pickup_lat;
        var lon = dataOn[key].pickup_lon;
        //var name = dataOn[key].username;
        var biketype = dataOn[key].bike_type;
        var bikeprice = dataOn[key].bike_price;
        var timeavailable = dataOn[key].pickup_time;
        var message = dataOn[key].publisher_message;
        var contact = dataOn[key].publisher_contact;
        
        //here, clean strings:
        //lat = lat.replace(/\D/g,'');
        lat = lat.replace('\"', '');
        lon = lon.replace('\"', '');
        biketype = biketype.replace('\"', '');
        biketype = biketype.replace('"', '');
        bikeprice = bikeprice.replace('\"', '');
        bikeprice = bikeprice.replace('"', '');
        timeavailable = timeavailable.replace('\"', '');
        timeavailable = timeavailable.replace('"', '');
        message = message.replace('\"', '');
        message = message.replace('"', '');
        //contact = contact.replace('\"', '');
        //var contact = 
        console.log(lat);
        console.log(lon);
        console.log(bikeprice);
        console.log(biketype);
        console.log(timeavailable);
        console.log(message);
        console.log(contact);
        //here,  place markers:
        var marker = L.circle([lat,lon], MarkerOptions);
        
        var popupText = 'Bike type: '+biketype+'<br>'+'Price: '+bikeprice+'<br>'+'Available until: '+timeavailable+'<br>'+'Publisher message: '+message+'<br>'
        if(contact){
            contact = contact.split('"').join('');
            popupText = popupText +'<a href="mailto:'+contact+'">contact</a>'
        }
        marker.bindPopup(
            popupText
        ).openPopup();
        transactionLayer.addLayer(marker);
        

        //marker.bindPopup().openPopup();
        
      //locRef2.once

    });
// return lat, lon, biketype;
});

map.addLayer(transactionLayer);

//NEED A WHILE FUNCTION FOR AVAILABLE BIKES:
/*
while (CURRENTTIME>timeavailable) {
    //while time now (corrrectly formatted) is greater than the time available of the bike (correctly formatted), set the marker to true.
    //if the timestamp of now is greater than timem available, then destroy the marker.
};
*/

locRefAll.on('value', function(snapshot){
    console.log(snapshot);
});

var currentdate = new Date();
var time = currentdate.getHours() + ":" + currentdate.getMinutes();
console.log(time);
/*
if time > timeavailable, then erasae the marker.
*/