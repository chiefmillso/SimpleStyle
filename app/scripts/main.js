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
            if ($.fn.DatePicker) {
                $('.ms-DatePicker').DatePicker();
            }
            if ($.fn.Dropdown) {
                $('.ms-Dropdown').Dropdown();
            }
        }

        // Vanilla JS Components
        var component;
        if (typeof fabric === 'object') {
            if ('Breadcrumb' in fabric) {
                component = new fabric['Breadcrumb'](document.querySelector('.ms-Breadcrumb'));
            }
            if ('CommandBar' in fabric) {
                component = new fabric['CommandBar'](document.querySelector('.ms-CommandBar'));
            }
            if ('DatePicker' in fabric) {
                component = new fabric['DatePicker'](document.querySelector('.ms-DatePicker'));
            }
            if ('Dropdown' in fabric) {
                component = new fabric['Dropdown'](document.querySelector('.ms-Dropdown'));
            }
        }

    });
})(window.jQuery);