var map;
var markers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.8282, lng: -98.5795},
        zoom: 4
    });
}

function resultsMap(lat, long) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: lat, lng: long},
        zoom: 12
    });
}

// Adds a marker to the map and push to the array.
function addMarker(location) {
    var marker = new google.maps.Marker({
        position: location, 
        //label: label, 
        map: map
    });
    markers.push(marker);
}

// This is the API call to Foursquare
function getRequest(category, place){
	
	// The parameters we need to pass in our request to Foursquares's API
	var parameters = { 
		client_id: 'L4KUNNERV4H1BGBS2LIIUAVRJ0BTJA2TTD5N2NE21RKT1EAT',
		client_secret: 'NL5SVJXDJQOQ00TVO1ZYT1BEYBSQRYDJJU0UUSO0XIJXGC2Z',
		v: '20161016',
		near: place,
		section: category
	};
	url = "https://api.foursquare.com/v2/venues/explore";

	$.getJSON(url, parameters, function(data){
		resultsMap(data.response.geocode.center.lat, data.response.geocode.center.lng)
		showResults(data.response.groups[0].items);
	});
}

function showResults(results){
	var html = " ";
	$.each(results, function(index,value){
		var venueID = value.venue.id;
		var venueName = value.venue.name;
		// Put the lat long in a new function?
		var venueLat = Number(value.venue.location.lat);
		var venueLong = Number(value.venue.location.lng);
		var location = {lat: venueLat, lng: venueLong};
		addMarker(location);
		html += '<a href="https://foursquare.com/v/' + venueName + '/' + venueID +'" target="_blank">' + venueName + '</a><br>';
	});
	$("#search-results").html(html);
}

// Sets the map on all markers in the array.
      function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

      // Removes the markers from the map, but keeps them in the array.
      function clearMarkers() {
        setMapOnAll(null);
      }

// Document Ready Function 
$(function(){

	$("#search-place").submit(function(event){
		event.preventDefault();
		clearMarkers();
		var searchCategory = $("#query").val();
		var searchPlace = $("#query2").val();
		getRequest(searchCategory, searchPlace);
		$("#search-results").show();
	});
});

	






