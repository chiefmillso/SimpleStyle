var jQuery = jQuery.noConflict();
(function($){
'use strict';
var baseComponents = {
    filterButtons: {
        target: '#ssg-filter',
        items: [{
            action: 'atoms',
            title: 'Atoms',
            class: 'ssg-atoms'
        }, {
            action: 'molecules',
            title: 'Molecules',
            class: 'ssg-molecules'
        }, {
            action: 'orangism',
            title: 'Organism',
            class: 'ssg-organism'
        }, {
            action: 'templates',
            title: 'Templates',
            class: 'ssg-templates'
        }, {
            action: 'pages',
            title: 'Pages',
            class: 'ssg-pages'
        }]
    }
};

/* globals ssgCore,ssg,$,Handlebars */

// var ssgCore = ssgCore || {};

var debug = function() {

    // SSG Core
    console.log(ssgCore);
    // SSG
    console.log(ssg);
    // Registered partials
    console.log(Handlebars.partials);

};

// Build UI
// Filter
// Session Handling
// Render Style Guide
// Constructor
// Core components
ssgCore.components = {};

ssgCore.components.filter = function() {

    var button = Handlebars.partials.buttons;

    var btnFilter = baseComponents.filterButtons;

    for (var i = 0; i < btnFilter.items.length; i++) {

        var filter = button(btnFilter.items[i]);

        $(btnFilter.target).append(filter);

    };
};

ssgCore.components.toc = function() {

	console.log(ssg);

};

ssgCore.initUi = (function() {

    // Logging debug information
    // debug();

    // init filter button
    ssgCore.components.filter();
    ssgCore.components.toc();

}());

/* globals ssgCore,$ */
ssgCore.Events = (function() {

}());
})(jQuery);
//# sourceMappingURL=ssgCoreLib.js.map
