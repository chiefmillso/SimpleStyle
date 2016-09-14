var ssgCore = ssgCore || {};
(function($) {
    ssgCore.onLoad = ssgCore.onLoad || [];
    ssgCore.onLoad.push(function() {

        // File Picker demo fixes
        if ($('.ms-FilePicker').length > 0) {
            $('.ms-FilePicker').css({
                "position": "absolute !important"
            });

            $('.ms-Panel').FilePicker();
        } else {
            if ($.fn.Breadcrumb) {
                $('.ms-Breadcrumb').Breadcrumb();
            }
        }

        // Vanilla JS Components
        if (typeof fabric === "object") {
            if ('Breadcrumb' in fabric) {
                var element = document.querySelector('.ms-Breadcrumb');
                var component = new fabric['Breadcrumb'](element);
            }
        }

    });
})(window.jQuery);