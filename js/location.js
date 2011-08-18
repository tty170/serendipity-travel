$(function() {
    // TODO from API
    var city = 'SEL';
    
    $('#select_hotel').click(function() {
        var hash = getHash();
        var hotelAnchor = $('#hotel_thums li.selected a');
        var code = hotelAnchor.attr('data-code');
        $.ajax({
        	type: 'GET',
        	url: 'http://seren.tv/post',
        	data: {'hash': hash, 
        	    'target': 'h', 
        	    'status': code
        	},
        	success: function(data) {
        		showSelectedHotel(data);
        		loadRestaurants();
        	},
        	error: function(data) {
        	    // TODO impl
        	    showSelectedHotel(data);
        	    loadRestaurants();
        	}
        });
    });

    $('#select_restaurant').click(function() {
        var hash = getHash();
        var restaurantAnchor = $('#restaurant_thums li.selected a');
        var code = restaurantAnchor.attr('data-code');
        $.ajax({
        	type: 'GET',
        	url: 'http://seren.tv/post',
        	data: {'hash': hash, 
        	    'target': 'r', 
        	    'status': code
        	},
        	success: function(data) {
        		showSelectedRestaurant();
        		$('#edit_title').fadeIn('slow');
        	},
        	error: function(data) {
        	    // TODO impl
        	    showSelectedRestaurant();
        	    $('#edit_title').fadeIn('slow');
        	}
        });
    });

    $('#save_title').click(function() {
        var hash = getHash();
        var title = $('#title').val();
        $.ajax({
        	type: 'GET',
        	url: 'http://seren.tv/post',
        	data: {'hash': hash, 
        	    'target': 't', 
        	    'status': title
        	},
        	success: function(data) {
        		showSavedTitle(title);
        	},
        	error: function(data) {
        	    // TODO impl
        	    showSavedTitle(title);
        	}
        });
    });
    

    loadPlan();
    
    function loadPlan() {
        $.ajax({
            type: 'GET',
            url: 'data/plan.json',
            //url: 'http://seren.tv/get'
            data: {},
            //data: {hash: 'GhGbHII'},
            success: function(data) {
                var plan = JSON.parse(data);
                if (plan.picture != null) {
                    showPhoto(plan);
                    showMap(54.705582, -6.49292);
                }
                
                if (plan.hotel == null || plan.hotel == '') {
                    loadHotels();
                    return;
                }
                $('#selected_hotel').html('このホテル!').fadeIn('slow');
                
                if (plan.restaurant == null || plan.restaurant == '') {
                    loadRestaurants();
                    return;
                }
                $('#selected_restaurant').html('このレストラン!').fadeIn('slow');
                
                if (plan.title == null && plan.title == '') {
                    $('#edit_title').fadeIn('slow');
                    return;
                }
                
                $('#plan_title').html('<h3>ここへ行きたい!</h3>');
            }
        });
    }
    
    function loadHotels() {
        $.ajax({
            type: 'GET',
            url: 'http://api.seren.tv/hotel/', 
            data: {'citycode': city}, 
            success: function(data) {
                showThumbs(data, 'hotel_thumbs');
                $('#choose_hotel').fadeIn('slow');
            },
            error: function(data) {
                // TODO impl
            }
        });
    }
    
    function loadRestaurants() {
        $.ajax({
            type: 'GET',
            url: 'http://api.seren.tv/d_restaurant/', 
            // TODO impl restaurant API
            //data: {'citycode': city}, 
            data: {'citycode': 'CHI'},
            success: function(data) {
                showThumbs(data, 'restaurant_thumbs');
                $('#choose_restaurant').fadeIn('slow');
            },
            error: function(data) {
                // TODO impl
            }
        });
    }
    
    function showPhoto(plan) {
        var photoWidtgetOptions = { 
           'width': 800, 
           'height': 600, 
           'rows': 1, 
           'columns': 1, 
           'croppedPhotos': true, 
           'attributionStyle': panoramio.tos.Style.DEFAULT, 
           'disableDefaultEvents': true 
        };
        
        var photoRequest = {
            'ids': [{'photoId': plan.picture, 'userId': plan.pictureOwner}]
        };
        
        var photoDisplayWidget = new panoramio.PhotoWidget('location_image', 
                                       photoRequest,
                                       photoWidtgetOptions);
        photoDisplayWidget.setPosition(0);
        
        $(photoDisplayWidget).bind(panoramio.events.EventType.PHOTO_CHANGED, function() {  
            var photo = photoDisplayWidget.getPhoto();
            var latLng = photo.getPosition();
        });
    }

	function showMap(lat, lng) {
    	var map = new google.maps.Map(document.getElementById('map'));
    
    	map.setCenter(new google.maps.LatLng(lat, lng));
    	map.setZoom(2);
    	map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    
    	var marker = new google.maps.Marker({
    		map: map,
    		position: map.getCenter()
    	});
	}

    function showThumbs(data, thumbsId) {
        var index = 0;
        var targets = data;
        var targetsCount = targets.length;
        var thumbs = $('#' + thumbsId + ' .thumbs');
        
        $(targets).each(function(i) {
            var target = targets[i];
            
            $('<li>').append(
                $('<a>').attr({
                    'data-code': target.code,
                    'class': 'thumb',
                    'href': '#'
                }).append(
                    $('<img>').attr({
                        'src': target.img_url,
                        'alt': target.name,
                        'height': 80,
                        'width': 80
                    }).load(function() {
                        if (++index >= targetsCount) {
                            applyThumbsView(thumbsId);
                        }
                    })
                )
            ).appendTo(thumbs);
        });
    }

    function showSelectedHotel(hotel) {
        var hotelAnchor = $('#hotel_thumbs li.selected a');
        
        // TODO from parameter
        $('<div><img width="180" height="180" src="http://www.pelican-travel.net/zPutImg.php?act=hotelImg&frCd=chile&fileNm=CHILEgaikanr.JPG"></img><span style="font-size: 2em;">ロイヤルホテル韓国</span></div>')
            .appendTo($('#selected_hotel'));
    
        $('#choose_hotel').hide();
        $('#selected_hotel').show();
        $('#restaurants').show();
    };
    
    function showSelectedRestaurant(restaurant) {
        var restaurantAnchor = $('#restaurant_thumbs li.selected a');
        
        // TODO from parameter
        $('<div><img width="180" height="180" src="http://media-cdn.tripadvisor.com/media/photo-s/01/ef/4d/11/steak-with-mushroom-sauce.jpg"></img><span style="font-size: 2em;">Tiramisu</span></div>')
            .appendTo($('#selected_restaurant'));
    
        $('#choose_restaurant').hide();
        $('#selected_restaurant').show();
        $('#edit_title').show();
    };
    
    function showSavedTitle(title) {
        $('#edit_title').hide();
        $('#saved_title').html('<h3>' + title + '</h3>').show();
        
        $.notifyBar({
          html: '妄想旅行プランに「' + title + '」と名付けました！',
          delay: 2000,
          animationSpeed: 'normal'
        });
    }

    function getHash() {
        var urlElement = location.href.split('/');
        var pathElement = urlElement[urlElement.length - 1];
        var lastPath = pathElement.split('?')[0];
        var hash = lastPath.split('.')[0];
        
        return hash;
    }
    
    function applyThumbsView(thumbsId) {
    	var onMouseOutOpacity = 0.67;
    	$('#' + thumbsId + ' ul.thumbs li, div.navigation a.pageLink').opacityrollover({
    		mouseOutOpacity:   onMouseOutOpacity,
    		mouseOverOpacity:  1.0,
    		fadeSpeed:         'fast',
    		exemptionSelector: '.selected'
    	});
    	
    	var gallery = $('#' + thumbsId).galleriffic({
    		numThumbs:                 10,
    		preloadAhead:              10,
    		enableTopPager:            false,
    		enableBottomPager:         false,
    		imageContainerSel:         '#slideshow',
    		renderSSControls:          true,
    		renderNavControls:         true,
    		prevLinkText:              'Previous',
    		nextLinkText:              'Next',
    		nextPageLinkText:          'Next &rsaquo;',
    		prevPageLinkText:          '&lsaquo; Prev',
    		defaultTransitionDuration: 900,
    		onSlideChange:             function(prevIndex, nextIndex) {
    			this.find('ul.thumbs').children()
    				.eq(prevIndex).fadeTo('fast', onMouseOutOpacity).end()
    				.eq(nextIndex).fadeTo('fast', 1.0);
    		},
    		onPageTransitionOut:       function(callback) {
    			this.fadeTo('fast', 0.0, callback);
    		},
    		onPageTransitionIn:        function() {
    			var prevPageLink = this.find('a.prev').css('visibility', 'hidden');
    			var nextPageLink = this.find('a.next').css('visibility', 'hidden');
    			
    			if (this.displayedPage > 0)
    				prevPageLink.css('visibility', 'visible');
    
    			var lastPage = this.getNumPages() - 1;
    			if (this.displayedPage < lastPage)
    				nextPageLink.css('visibility', 'visible');
    
    			this.fadeTo('fast', 1.0);
    		}
    	});
    	
    	gallery.find('a.prev').click(function(e) {
    		gallery.previousPage();
    		e.preventDefault();
    	});
    
    	gallery.find('a.next').click(function(e) {
    		gallery.nextPage();
    		e.preventDefault();
    	});
    }
});
