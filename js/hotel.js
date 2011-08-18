$(function() {
    $('#hotelSelect').click(function() {
        var urlElement = location.href.split('/');
        var pathElement = urlElement[urlElement.length - 1];
        var lastPath = pathElement.split('?')[0];
        var hash = lastPath.split('.')[0];
        
        var hotelAnchor = $('#hotel-thums li.selected a');
        $.ajax({
        	type: 'GET',
        	url: 'http://seren.tv/post',
        	data: {'hash': hash, 
        	    'target': 'h', 
        	    'status': hotelAnchor.attr('data-code')
        	},
        	success: function(data) {
        		showSelectedHotel();
        	},
        	error: function(data) {
        	    showSelectedHotel();
        	}
        });
    });
    
    function showSelectedHotel(hotel) {
        var hotelAnchor = $('#hotel-thums li.selected a');
        
        $('<div><img width="180" height="180" src="http://www.pelican-travel.net/zPutImg.php?act=hotelImg&frCd=chile&fileNm=CHILEgaikanr.JPG"></img><span style="font-size: 2em;">ロイヤルホテル韓国</span></div>')
            .appendTo($('#selectedHotel'));
    
        $('#hotelSelect').hide();
        $('#hotels').hide();
        $('#selectedHotel').show();
        $('#restaurants').show();
    }

    $.getJSON('http://api.seren.tv/hotel/', {'citycode':'SEL'}, function(data) {
        var index = 0;
        var hotels = data;
        var hotelsCount = hotels.length;
        var thumbs = $('#hotels-thumbs .thumbs');
        
        $(hotels).each(function(i) {
            var hotel = hotels[i];
            
            $('<li>').append(
                $('<a>').attr({
                    'data-code': hotel.code,
                    'class': 'thumb',
                    'href': '#'
                }).append(
                    $('<img>').attr({
                        'src': hotel.img_url,
                        'alt': '#',
                        'height': 100,
                        'width': 100
                    }).load(function() {
                        if (++index >= hotelsCount) {
                            applyThumbsView();
                        }
                    })
                )
            ).appendTo(thumbs);
        });
    });
    
    function applyThumbsView() {
    	var onMouseOutOpacity = 0.67;
    	$('#hotels-thumbs ul.thumbs li, div.navigation a.pageLink').opacityrollover({
    		mouseOutOpacity:   onMouseOutOpacity,
    		mouseOverOpacity:  1.0,
    		fadeSpeed:         'fast',
    		exemptionSelector: '.selected'
    	});
    	
    	var gallery = $('#hotels-thumbs').galleriffic({
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
