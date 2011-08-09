$(function() {
	var currentPage = 0;
	var pageSize = 20;
	
	var startIndex = Math.floor(Math.random() * 100);
	requestGetPhotos(startIndex, startIndex + pageSize);
	
	function requestGetPhotos(from, to) {
		$.ajax({
			type: 'GET',
			url: 'http://www.panoramio.com/map/get_panoramas.php',
			data: {
			    'set': 'public',
			    'from': from,
			    'to': to,
			    'minx': -180,
			    'miny': -90,
			    'maxx': 180,
			    'maxy': 90,
			    'size': 'medium',
			    'mapfilter': true
			    },
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
		    'data-photoid': nextPhoto.photo_id
		});
		
		$('#current').attr({
		    src: currentPhoto.photo_file_url, 
		    title: currentPhoto.photo_title,
			width: 800,
			height: 600,
		    'data-photoid': currentPhoto.photo_id
		});
	}
	
	$('#wannago').click(function() {
		//document.location="location.html";
		var selectedPhotoId = $('#current').attr('data-photoid');
        $.ajax({
        	type: 'GET',
        	url: '/new',
        	data: {
        	    'photo_id': photoId
        	},
        	success: function(data) {
        		console.log(data);
        	}
        	error: function(msg) {
        	    console.log(msg);
        	}
        });
	});
});
