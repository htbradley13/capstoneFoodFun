// Map and markers variables
var map;
var markers = [];

// Initial Google maps page when the page loads
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.8282, lng: -98.5795},
        zoom: 4
    });
}

// Used as the map when a search is done, and plots markers
function resultsMap(lat, long) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: lat, lng: long},
        zoom: 12
    });
}

// Adds a marker to the map and push to the array.
function addMarker(location, content) {
    var marker = new google.maps.Marker({
        position: location, 
        // If you want to add a label to the google maps markers, use the below line
        //label: label, 
        map: map
    });

    // Variables for the info window and marker effects below it
    var contentInfo = content;

    var infowindow = new google.maps.InfoWindow({
    	content: contentInfo
    });

    /* This code enables the hover effect, if preferred over the click effect, but you can't click the link to the venue
    marker.addListener('mouseover', function() {
  		infowindow.open(map,marker);
	});

    marker.addListener('mouseout', function() {
  		infowindow.close(map,marker);
	});
	*/
	// This allows you to click a marker to see the info window
	marker.addListener('click', function() {
  		infowindow.open(map,marker);
	});
	
    // This pushes the marker results to the marker array
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
		section: category,
		venuePhotos: 1
	};
	url = "//api.foursquare.com/v2/venues/explore";

	$.getJSON(url, parameters, function(data){
		resultsMap(data.response.geocode.center.lat, data.response.geocode.center.lng)
		showResults(data.response.groups[0].items);
	});
}

// Function used to pass results through, set variables based on results, and set html to view accordingly
function showResults(results){
	var html = " ";
	var content = " ";
	$.each(results, function(index,value){
		var venueID = value.venue.id;
		var venueName = value.venue.name;
		var rating = value.venue.rating;
		var priceRange = ""
		var photo = ""

		// If statement to see if there is a price in the search results and setting variable accordingly
		if (value.venue.price != undefined) {
			var priceRange = value.venue.price.currency;
		}
		else {
			var priceRange = 'n/a';
		}

		// If statement to see if there is a photo, and how to display if so
		if (value.venue.photos.count >= 1) {
			var prefix = value.venue.photos.groups[0].items[0].prefix;
			/*Can use height and width if you want actual size, but that's too big
			var height = value.venue.photos.groups[0].items[0].height;
			var width = value.venue.photos.groups[0].items[0].width;
			*/
			//Create my own ideal size for thumbnail using width by height pixel dimensions
			var size = 160 + 'x' + 80;
			var suffix = value.venue.photos.groups[0].items[0].suffix;
			//Per API documentation for Foursquare, the below is how to put together an image
			var photoLink = prefix + size + suffix;
			var photo = '<img src="' + photoLink + '" alt="Picture">';
		}
		else {
			var photo = 'n/a';
		}

		var nameType = value.venue.categories[0].name;
		var venueLat = Number(value.venue.location.lat);
		var venueLong = Number(value.venue.location.lng);
		var location = {lat: venueLat, lng: venueLong};

		// Variable used for search results column, and pop-up marker result div
		content = '<a href="https://foursquare.com/v/' + venueName + '/' + venueID +'" target="_blank">' + venueName + '</a><br>' + rating + ', ' + priceRange + ', ' + nameType + '<br>' + photo + '<br><br>';

		addMarker(location, content);
		html += content;
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
		$("#results-column").show();
		$("#search-results").show();
		$("#foursquare-Attribution").show();
	});
}); 

	






