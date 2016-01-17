/* globals ssgCore,baseComponents,$ */
ssgCore.UIHelper = {};

ssgCore.UIHelper.setCategoryFilter = function(filter) {
    // setting correct button active

    ssgCore.Session.filter.add(filter);
    console.log(ssgCore.Session.filter.get());

    // regular filter behaviour
    if (filter !== null) {
        // filter items
        var currentItems = $('.ssg-item[data-cat=' + filter + ']');
        var otherItems = $('.ssg-item[data-cat!=' + filter + ']');

        currentItems.removeClass('hide');
        otherItems.addClass('hide');
    } 
    else {
    	// remove filter
        $('.ssg-item').removeClass('hide');
    }

};
