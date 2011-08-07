$(function() {
	var currentPage = 0;
	var pageSize = 20;
	
	requestGetPhotos(0, pageSize);
	
	function requestGetPhotos(from, to) {
		$.ajax({
			type: 'GET',
			url: 'http://www.panoramio.com/map/get_panoramas.php',
			data: 'set=public&from=' + from +  '&to=' + to + '&minx=-180&miny=-90&maxx=180&maxy=90&size=medium&mapfilter=true',
			success: function(data){
				if (data != null && data.count > 1) {
					loadPhoto(data.photos, 0);
				}
			}
		});
	}
	
	function loadPhoto(photos, index) {
		if (photos.length < index + 2) {
			var from = pageSize * ++currentPage;
			requestGetPhotos(from, from + pageSize);
			return;
		}
		
		var currentPhoto = photos[index];
		var nextPhoto = photos[index + 1];

		$('#next').click(function () {
			$(this).unbind('click');
		    loadPhoto(photos, index + 1);
		}).attr({
		    src: nextPhoto.photo_file_url, 
		    title: nextPhoto.photo_title,
		    width: 160,
		    height: 160,
		    'data-photoId': nextPhoto.photo_id
		});
		
		$('#current').attr({
		    src: currentPhoto.photo_file_url, 
		    title: currentPhoto.photo_title,
			width: 800,
			height: 600,
		    'data-photoId': currentPhoto.photo_id
		});
	}
	
	$('#wannago').click(function() {
	    var selectedImg = $('#current');
        $.ajax({
        	type: 'POST',
        	url: '/wantToGo',
        	data: {
        	    'photo_id': selectedImg.attr('data-photoId'),
        	    'photo_file_url': selectedImg.src
        	},
        	success: function(data){
        		console.log(data);
        	}
        });
	});
});
