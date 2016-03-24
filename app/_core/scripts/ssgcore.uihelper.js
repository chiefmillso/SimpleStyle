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

        var filterButton = $('#ssg-btn' + filter);
        if (filterButton.length !== 0) {
            filterButton.addClass('active');
        }
    } else {
        // remove filter
        $('.ssg-item').removeClass('hide');
    }

};
