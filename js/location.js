$(document).ready(function() {

	var map = new google.maps.Map(document.getElementById("map"));

	map.setCenter(new google.maps.LatLng(-34.397, 150.644));
	map.setZoom(2);
	map.setMapTypeId(google.maps.MapTypeId.ROADMAP);

	var marker = new google.maps.Marker({
		map: map,
		position: map.getCenter()
	});

});
