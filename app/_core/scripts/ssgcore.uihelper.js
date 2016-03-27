/* globals ssgCore,baseComponents,$ */
ssgCore.UIHelper = {};

ssgCore.UIHelper.setCategoryFilter = function(filter) {
    // setting correct button active

    ssgCore.Session.filter.add(filter);
    console.log(ssgCore.Session.filter.get());

    // regular filter behaviour
    if (filter !== null) {
        // filter items

        var currentItems,
            otherItems;

        if (filter === 'templates' || filter === 'pages') {

            var allElements = $('.ssg-item[data-cat=' + filter + ']');
            otherItems = $('.ssg-item');
            currentItems = $('.ssg-item[data-cat=' + filter + ']:first');

            console.log(currentItems);

            var test = $('.ssg-item[data-cat=' + filter + ']');

            console.log('________________________________');
            console.log(test);
            console.log($(test[0]).removeClass('hide'));
            console.log('________________________________');

            console.log(allElements);
            this.enablePaging(allElements);

            otherItems.addClass('hide');

            currentItems.removeClass('hide');

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
