let map;
let markersArray = [];
let marker;
let autocomplete;
let max_results = 10;
let distance = '0km';
let last_lat = 35.58095381121093;
let last_lng = -5.345311090584554;

function setLastGeo(lat, lng) {
  last_lat = lat;
  last_lng = lng;
}

function initMap(lat, lng) {
  let myLatLng;

  if (lat && lng) {
    myLatLng = { lat: lat, lng: lng }
    setLastGeo(lat, lng);
  } else {
    myLatLng = { lat: last_lat, lng: last_lng };
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
  markersArray.push(marker);

  map.addListener("click", e => placeMarkerAndPanTo(e.latLng));

  initAutocomplete();
}

function placeMarkerAndPanTo(latLng) {
  setLastGeo(latLng.lat(), latLng.lng());
  removeAllPreviousMarkers();
  marker = new google.maps.Marker({
    position: latLng,
    map,
  });
  markersArray.push(marker);
  map.panTo(latLng);
  getResults(latLng.lat(), latLng.lng());
}

function removeAllPreviousMarkers() {
  for (let i = 0; i < markersArray.length; i++ ) {
    markersArray[i].setMap(null);
  }
  markersArray.length = 0;
}

function removeAllPreviousMarkersExceptUserLocation() {
  for (let i = 1; i < markersArray.length; i++ ) {
    markersArray[i].setMap(null);
  }
  markersArray.length = 1;
}

// function removePreviousMarker() {
//   if (marker != null) {
//     marker.setMap(null);
//   }
// }

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
  let place = autocomplete.getPlace();

  if(!place.geometry) {
    document.getElementById('autocomplete').placeholder = 'Enter a place';
  } else {
    removeAllPreviousMarkers();
    setLastGeo(place.geometry.location.lat(), place.geometry.location.lng());
    initMap(place.geometry.location.lat(), place.geometry.location.lng());
    getResults(place.geometry.location.lat(), place.geometry.location.lng());
  }
}

function getResults(lat, lng) {
  const data = {
    "from": 0,
    "size": max_results,
    "query" : {
      "bool": {
        "must": {
          "match_all" : {}
        },
        "filter" : {
          "geo_distance" : {
            "distance" : distance,
            "location": {
              "lat" : lat,
              "lon" : lng
            }
          }
        }
      }
    },
    "sort" : [
      {
        "_geo_distance" : {
          "location" : [lat, lng],
          "order" : "asc",
          "unit" : "km"
        }
      }
    ]
  };

  fetch('http://localhost:9200/service_providers/_search', {
    method: 'POST',
    mode: 'cors',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(data => processResults(data))
    .catch(error => console.error('Error:', error));
}

function processResults(data) {
  console.log("Processing results...");
  console.log(data);

  clearTableData();

  data['hits']['hits'].map(function(i){
    let src = i['_source'];
    src.id = i["_id"];
    src.formatted_lat = Math.round(src.location.lat * 1000000) / 1000000;
    src.formatted_lon = Math.round(src.location.lon * 1000000) / 1000000;

    loadTableData(src);

    marker = new google.maps.Marker({
      map,
      draggable: false,
      position: new google.maps.LatLng(src.location.lat, src.location.lon),
    });
    markersArray.push(marker);
  });

  loadTableData([]);
}

function clearTableData() {
  const table = document.getElementById("results");
  table.innerHTML = "";
}

function loadTableData(item) {
  if(item && item.length != 0) {
    console.log(item)

    const table = document.getElementById("results");

    let row = table.insertRow();

    let id = row.insertCell(0);
    id.innerHTML = item.id;

    let country = row.insertCell(1);
    country.innerHTML = item.country;

    let city = row.insertCell(2);
    city.innerHTML = item.city;

    let latitude = row.insertCell(3);
    latitude.innerHTML = item.location.lat;

    let longitude = row.insertCell(4);
    longitude.innerHTML = item.location.lon;
  }
}

function getSlideValue() {
  removeAllPreviousMarkersExceptUserLocation();
  let slideValue = document.getElementById("customRange1").value;
  distance = slideValue + 'km';
  getResults(last_lat, last_lng);
  document.getElementById("radius-val").textContent = slideValue + ' km';
}
