$(document).ready(function() {

	var map = new google.maps.Map(document.getElementById("map"));

	map.setCenter(new google.maps.LatLng(54.705582,-6.49292));
	map.setZoom(2);
	map.setMapTypeId(google.maps.MapTypeId.ROADMAP);

	var marker = new google.maps.Marker({
		map: map,
		position: map.getCenter()
	});

});
