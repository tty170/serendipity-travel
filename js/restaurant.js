$(function() {
    $('#restaurantSelect').click(function() {
        var urlElement = location.href.split('/');
        var pathElement = urlElement[urlElement.length - 1];
        var lastPath = pathElement.split('?')[0];
        var hash = lastPath.split('.')[0];
        
        var hotelAnchor = $('#restaurant-thums li.selected a');
        $.ajax({
        	type: 'GET',
        	url: 'http://seren.tv/post',
        	data: {'hash': hash, 
        	    'target': 'r', 
        	    'status': hotelAnchor.attr('data-restaurantCode')
        	},
        	success: function(data) {
        		showSelectedRestaurant();
        	},
        	error: function(data) {
        	    showSelectedRestaurant();
        	}
        });
    });
    

    function showSelectedRestaurant(restaurant) {
        var hotelAnchor = $('#restaurant-thums li.selected a');
        $('<div><img width="180" height="180" src="http://media-cdn.tripadvisor.com/media/photo-s/01/ef/4d/11/steak-with-mushroom-sauce.jpg"></img><span style="font-size: 2em;">Tiramisu</span></div>')
            .appendTo($('#selectedRestaurant'));
    
        $('#restaurantSelect').hide();
        $('#restaurants').hide();
        $('#selectedRestaurant').show();
    }

    $.getJSON('http://api.seren.tv/d_restaurant/', {'citycode':'CHI'}, function(data) {
        var index = 0;
        var restaurants = data;
        var restaurantsCount = hotels.length;
        var thumbs = $('#restaurants-thumbs .thumbs');
        
        $(restaurants).each(function(i) {
            var restaurant = restaurants[i];
            
            $('<li>').append(
                $('<a>').attr({
                    'data-restaurantId': restaurant.code,
                    'class': 'thumb',
                    'href': '#'
                }).click(function(event) {
                    console.log(event.currentTarget);
                }).append(
                    $('<img>').attr({
                        'src': restaurant.img_url,
                        'alt': restaurant.name,
                        'height': 80,
                        'width': 80
                    }).load(function() {
                        if (++index >= restaurantsCount) {
                            applyThumbsView();
                        }
                    })
                )
            ).appendTo(thumbs);
        });
    });
    
    function applyThumbsView() {
    	var onMouseOutOpacity = 0.67;
    	$('#restaurants-thumbs ul.thumbs li, div.navigation a.pageLink').opacityrollover({
    		mouseOutOpacity:   onMouseOutOpacity,
    		mouseOverOpacity:  1.0,
    		fadeSpeed:         'fast',
    		exemptionSelector: '.selected'
    	});
    	
    	var gallery = $('#restaurants-thumbs').galleriffic({
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
