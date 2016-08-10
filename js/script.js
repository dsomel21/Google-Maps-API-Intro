"use strict";

var map;
var newMarker;
var markerPhoto = null;
var waterlooWindow;
var infoWindow;

function getLatLng(the_lat, the_lng){
  return {lat: the_lat || 43.506254, lng: the_lng || -80.500955};
}

function initMap() {
  /* Autocompletion */
  var input = document.getElementById('search_location');
  var autocomplete = new google.maps.places.Autocomplete(input);
  /* Defult Locations */
  var myLatLng = {lat: 43.464258, lng: -80.5204};
  var eastBridgeLatLng = getLatLng();

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: myLatLng
  });

  var waterlooString =
  '<div id="full_content">'+
  '<div id="siteNotice">'+
  '</div>'+ 
  '<h1 id="firstHeading" class="firstHeading">Waterloo</h1>,'+
  '<p><b>Waterloo</b>, also referred to as <b>The 9!</b></p>'+
  '<p>Attribution: Waterloo, <a href="https://en.wikipedia.org/wiki/Waterloo,_Ontario">'+
  '</div>'+
  '</div>';

  map.addListener('click', function(event) {
    placeMarker(event.latLng);
  });

  infoWindow = new google.maps.InfoWindow({
    content: waterlooString,
    maxWidth: 350
  });

      // selectedMarker = new google.maps.Marker({
      //   position: eastBridgeLatLng,
      //   map: map,
      //   title: 'This is my where I spent my childhood!'
      // }); 

    }

    var coordinates = {lat, lng}
    function placeMarker(location) {
      debugger;
      console.log(location.lat)
      newMarker = new google.maps.Marker({
        position: location, 
        map: map
      });

      infoWindow.open(map,newMarker);
    }

    function getFirstPhoto(photo) {
      markerPhoto = photo.photos[1].image_url;
      // myMarker.addListener('click', function() {
      //  waterlooWindow.open(map, myMarker);
      popMessage(selectedMarker, markerPhoto);
     // });
   }

    // function popMessage(marker, markerPhoto) {
    //   var miniInfoWindow = new google.maps.InfoWindow({
    //     content: `<div><img width='355' height='220' src=${markerPhoto} alt=''/></div>`
    //   });
    //   marker.addListener('click', function() {
    //     miniInfoWindow.open(marker.get('map'), marker);
    //   });
    // }

    $(document).ready(function(){
      // $('div form').on('submit', function(e){
      //   e.preventDefault();
      //   var input = $("#search_location").val();
      //   var geo_coordinate = [parseFloat(input.split(',')[0]), parseFloat(input.split(',')[1])];
      // });

      $.ajax({
        type: 'GET',
        url: `https://api.500px.com/v1/photos/search/?geo=${coordinates.lat},${coordinates.lng},10km&feature=popular&consumer_key=XNqpn2rRFpTbvN12g1BzE0hqtRu52tLOSJvdCE3G`
      }).done(function(photos){
        getFirstPhoto(photos);
      });
    });

    </script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBOWxTnbHJLi0VuTefxkuKf0gaA0AwvMfA&libraries=places&callback=initMap"
    async defer></script>