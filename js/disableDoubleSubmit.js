(function() {
    $.fn.disableDoubleSubmit = function(timeout) {
    if(!timeout || timeout < 1) {
        timeout = 5000;
    }

    $(this).bind("submit",function() {
        var submit_buttons = $(":submit, :image", this);
        submit_buttons.attr("disabled", true);
        setTimeout(function(){
            submit_buttons.attr("disabled", false);
        }, timeout);
        });
        return this;
    }
})(jQuery);