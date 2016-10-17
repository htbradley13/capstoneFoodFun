
// This is the API call to Foursquare
function getPlaces(category, place){
	
	// The parameters we need to pass in our request to Foursquares's API
	var parameters = { 
		client_id: 'L4KUNNERV4H1BGBS2LIIUAVRJ0BTJA2TTD5N2NE21RKT1EAT',
		client_secret: 'NL5SVJXDJQOQ00TVO1ZYT1BEYBSQRYDJJU0UUSO0XIJXGC2Z',
		v: '20161016',
		near: place,
		section: category
	};
	url = "//api.foursquare.com/v2/venues/explore";

	$.getJSON(url, parameters, function(data){
		showResults(data.items);
	});
}
 
	






