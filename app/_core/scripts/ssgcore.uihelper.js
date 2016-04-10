/* globals ssgCore,baseComponents,$ */
ssgCore.UIHelper = {};

ssgCore.UIHelper.setCategoryFilter = function(filter) {
    // setting correct button active

    ssgCore.Session.filter.add(filter);
    console.log('Set filter:  ' + filter);

    // regular filter behaviour
    if (filter !== null) {
        // filter items

        var currentItems,
            otherItems;

        $('#ssg-item-selector').html('');

        if (filter === 'templates' || filter === 'pages') {

            var allElements = $('.ssg-item[data-cat=' + filter + ']');
            otherItems = $('.ssg-item');
            otherItems.addClass('hide');

            // var test = $('.ssg-item[data-cat=' + filter + ']');

            this.enablePaging(allElements);

            currentItems = $('.ssg-item[data-cat=' + filter + ']');
            currentItems[0].removeClass('hide');

        } else {

            currentItems = $('.ssg-item[data-cat=' + filter + ']');
            otherItems = $('.ssg-item[data-cat!=' + filter + ']');

            currentItems.removeClass('hide');
            otherItems.addClass('hide');

        }

        var filterButton = $('#ssg-btn' + filter);

        if (filterButton.length !== 0) {

            filterButton.addClass('active');

        }

    } else {
        // remove filter
        $('.ssg-item').removeClass('hide');
    }

};


ssgCore.UIHelper.enablePaging = function(elements) {

    var items = [];

    for (var i = 0; i < elements.length; i++) {

        var curItem = $(elements[i]);
        var curTitle = curItem.find('.ssg-item-title').text();

        var item = {
            title: curTitle
        };

        items.push(item);

    }

    ssgCore.itemSelector = items;
    ssgCore.components.addSelector(items, 0);

};
