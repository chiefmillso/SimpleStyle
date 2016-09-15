/* globals fabric */

var ssgCore = ssgCore || {};
(function($) {
    ssgCore.onLoad = ssgCore.onLoad || [];
    ssgCore.onLoad.push(function() {

        // File Picker demo fixes
        if ($('.ms-FilePicker').length > 0) {
            $('.ms-FilePicker').css({
                'position': 'absolute !important'
            });

            $('.ms-Panel').FilePicker();
        } else {
            if ($.fn.Breadcrumb) {
                $('.ms-Breadcrumb').Breadcrumb();
            }
            if ($.fn.CommandBar) {
                $('.ms-CommandBar').CommandBar();
            }
        }

        // Vanilla JS Components
        if (typeof fabric === 'object') {
            if ('Breadcrumb' in fabric) {
                new fabric['Breadcrumb'](document.querySelector('.ms-Breadcrumb'));
            }
            if ('CommandBar' in fabric) {
                new fabric['CommandBar'](document.querySelector('.ms-CommandBar'));
            }
        }

    });
})(window.jQuery);