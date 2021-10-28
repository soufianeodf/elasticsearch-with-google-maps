let map;
let marker;

function initMap(lat, lng) {
  let myLatLng;

  if (lat && lng) {
    myLatLng = { lat: lat, lng: lng }
  } else {
    myLatLng = { lat: 35.58095381121093, lng: -5.345311090584554 };
  }

  map = new google.maps.Map(document.getElementById("map"), {
    center: myLatLng,
    zoom: 18,
  });

  marker = new google.maps.Marker({
    position: myLatLng,
    map,
    title: "Hello World!",
  });

  map.addListener("click", (e) => {
    placeMarkerAndPanTo(e.latLng, map);
  });

  initAutocomplete();
}

function placeMarkerAndPanTo(latLng, map) {
  //Remove previous Marker.
  if (marker != null) {
    marker.setMap(null);
  }

  marker = new google.maps.Marker({
    position: latLng,
    map: map,
  });
  map.panTo(latLng);
}

let autocomplete;

function initAutocomplete() {
  const center = { lat: 50.064192, lng: -130.605469 };
  // Create a bounding box with sides ~10km away from the center point
  const defaultBounds = {
    north: center.lat + 0.1,
    south: center.lat - 0.1,
    east: center.lng + 0.1,
    west: center.lng - 0.1,
  };
  const input = document.getElementById("autocomplete");
  const options = {
    bounds: defaultBounds,
    fields: ["place_id", "address_components", "geometry", "icon", "name"],
    // componentRestrictions: { country: "us" },
    strictBounds: false,
    types: ["establishment"],
  };
  autocomplete = new google.maps.places.Autocomplete(input, options);
  autocomplete.addListener('place_changed', onPlaceChanged);
}

function onPlaceChanged() {
  var place = autocomplete.getPlace();

  if(!place.geometry) {
    document.getElementById('autocomplete').placeholder = 'Enter a place';
  } else {
    initMap(place.geometry.location.lat(), place.geometry.location.lng());
  }
}
