$(function() {
    $.getJSON('data/test.json', {}, function(data) {
        var index = 0;
        var restaurantsCount = data.restaurants.length;
        var thumbs = $('#restaurants-thumbs .thumbs');
        
        $(data.restaurants).each(function(i) {
            var restaurant = data.restaurants[i];
            
            $('<li>').append(
                $('<a>').attr({
                    'data-restaurantId': restaurant.id,
                    'class': 'thumb',
                    'href': '#'
                }).click(function(event) {
                    console.log(event.currentTarget);
                }).append(
                    $('<img>').attr({
                        'src': restaurant.photoUrl,
                        'alt': '#'
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
