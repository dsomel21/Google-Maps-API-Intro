 "use strict";

 /* Initialize constants and public variables */
 var map;
 var newMarker;
 var infoWindow; 
 var markerPhoto = null;
 var iconURL = "https://www.fws.gov/urban/img/googlePinBlue.png";
 var myLatLng = {lat: 43.464258, lng: -80.5204};
 var coordinates;
 var searchedInfoWindow;
 var searchedMarker;

 function initMap() {
  /* Initialize map before everything */
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: myLatLng
  });

  /* Autocomplete Form */
  var input = document.getElementById('search_location');
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds',map);

  /* Intense Google Maps validations (refer to v3 documentation) */
  google.maps.event.addListener(autocomplete, 'place_changed',function(){
    var place = autocomplete.getPlace();
    /* Gather necessary information after autocompletion */
    var city_name = place.formatted_address;
    coordinates = place.geometry.location;
    // console.log(coordinates.lat())
    // debugger;

    if (!place.geometry){
      return;
    }
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

    /* Creating a new window/marker for searched location */
    searchedInfoWindow = new google.maps.InfoWindow({
      content: 
      '<div id="full_content">'+
      `<h1 id="firstHeading" class="firstHeading">${city_name}</h1>,`+
      `<p><b>${city_name.split(",")[0]}</b>, is a place in <b>${city_name.split(",")[2]}</b></p>`+
      `<p>You should come see!</p>`+
      `</div>`,
      maxWidth: 350
    });

    searchedMarker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      anchorPoint: new google.maps.Point(0, -30),
      icon: iconURL
    });
    searchedInfoWindow.open(map,searchedMarker);
  });

  /* Seperate feature that WILL popup photos upon click */
  map.addListener('click', function(event) {
    coordinates = event.latLng;
    placeMarker(event.latLng);
  });

  infoWindow = new google.maps.InfoWindow({
    content:  
    '<div id="full_content">'+
    '<h1 id="firstHeading" class="firstHeading">Yours to discover...</h1>,'+
    '</div>',
    maxWidth: 250
  });
}

function placeMarker(location) {
  newMarker = new google.maps.Marker({
    position: location, 
    map: map
  });
  infoWindow.open(map,newMarker);
}

/* Function recieves photo object from AJAX call */
function getPics(photo) {

  /* Clear out the div when inserting new photos*/
  document.getElementById("pic").innerHTML = '';
  for (var i = 0; i < 20; i++){
    markerPhoto = photo.photos[i].image_url;
    var elem = document.createElement("img");
    elem.setAttribute("src", markerPhoto);
    document.getElementById("pic").appendChild(elem)
  }
}

$(document).ready(function() { 

  /* Animate scroll after search and get coordinates */
  $('form').submit(function(e) {
    e.preventDefault();
    $(document).scrollTop($(document).height());

    /* Must add timeout function, else it will be undefined */
    setTimeout(function(){ 
      var lng = coordinates.lng();
      var lat = coordinates.lat();

      $.ajax({
        type: 'GET',
        url: `https://api.500px.com/v1/photos/search/?geo=${lat},${lng},10km&feature=popular&consumer_key=XNqpn2rRFpTbvN12g1BzE0hqtRu52tLOSJvdCE3G`
      }).done(function(photo){
        getPics(photo);
      }).fail(function(err){
        console.log(err)
      });

    }, 300);

  });
});