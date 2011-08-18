$(function() {
	var currentPage = 0;
	var pageSize = 20;
	
	var startIndex = Math.floor(Math.random() * 100);
	requestGetPhotos(startIndex, startIndex + pageSize);
	
	function requestGetPhotos(from, to) {
		$.ajax({
			type: 'GET',
			url: 'http://www.panoramio.com/map/get_panoramas.php',
			//url: 'http://api.seren.tv/d_image/',
			data: 'set=public&from=' + from +  '&to=' + to + '&minx=-180&miny=-90&maxx=180&maxy=90&size=medium&mapfilter=true',
			success: function(data){
				if (data != null && data.count > 1) {
                    var currentPhoto = data.photos[0];
                    $('#current').attr({
                        src: currentPhoto.photo_file_url, 
                        title: currentPhoto.photo_title,
                        'data-photoid': currentPhoto.photo_id,
                        width: 800,
                        height: 600
                    });
                    
                    var nextPhoto = data.photos[1];
                    $('#next').attr({
                        src: nextPhoto.photo_file_url, 
                        title: nextPhoto.photo_title,
                        'data-photoid': currentPhoto.photo_id,
                        width: 160,
                        height: 160
                    });
				
					loadPhoto(data.photos, 0);
				}
			},
			complete: function(data) {
			}
		});
	}
	
	function loadPhoto(photos, index) {
		if (photos.length < index + 3) {
			var from = pageSize * ++currentPage;
			requestGetPhotos(from, from + pageSize);
			return;
		}
		
		var currentPhoto = photos[index];
		var nextPhoto = photos[index + 1];
		var afterNextPhoto = photos[index + 2];

		$('#next #next_btn').click(function () {
			$(this).unbind('click');
			$(this).attr({
			    src: afterNextPhoto.photo_file_url,
			    title: afterNextPhoto.photo_title,
			    'data-photoid': afterNextPhoto.photo_id,
                width: 160,
                height: 160
			}).load(function() {
			    $('#current').attr({
    		        src: nextPhoto.photo_file_url, 
    		        title: nextPhoto.photo_title,
    		        'data-photoid': nextPhoto.photo_id,
                    width: 800,
                    height: 600
    		    });
			});
			
		    loadPhoto(photos, index + 1);
		});
		$('#next .location_img').attr({
		    src: nextPhoto.photo_file_url.replace('medium', 'small'), 
		    title: nextPhoto.photo_title,
		    width: 160,
		    height: 160,
		    'data-photoId': nextPhoto.photo_id
		});
		
		$('#next a').attr({
		    href: nextPhoto.photo_url, 
		});

		$('#current a').attr({
		    href: currentPhoto.photo_url, 
		});

		$('#current img').attr({
		    src: currentPhoto.photo_file_url, 
		    title: currentPhoto.photo_title,
		    'data-photoId': currentPhoto.photo_id
		});
		$('a#title').attr({
			href: currentPhoto.photo_url,
		}).text(currentPhoto.photo_title);
		$('a#owner').attr({
			href: currentPhoto.owner_url,
		}).text(currentPhoto.owner_name);
	}

	$('#current').mouseenter(function() {
		$('#current .hover_effect').fadeIn('fast');
	});

	$('#current').mouseleave(function() {
		$('#current .hover_effect').fadeOut('fast');
	});
	

	$('#next').mouseenter(function() {
		$('#next .hover_effect').fadeIn('fast');
	});

	$('#next').mouseleave(function() {
		$('#next .hover_effect').fadeOut('fast');
	});


	$('#wannago').click(function() {
	    var selectedImg = $('#current img');
		document.location="location.html";
        $.ajax({
        	type: 'GET',
        	url: 'http://seren.tv/new',
        	data: {
        	    'p': selectedPhotoId
        	},
        	success: function(data) {
        		console.log(data);
        		// UI遷移
        	},
        	error: function(data) {
        	    console.log(data);
        	    
        	    if (data.status == 403) {
        	        document.location = 'http://seren.tv/login';
        	    }
        	}
        });
	});
});
