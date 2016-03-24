/* globals ssgCore,baseComponents,$ */
ssgCore.Events = {};

ssgCore.Events.toggleToc = function(event) {

    event.preventDefault();

    var tocSection = $('#ssg-toc');

    if (tocSection.length !== 0) {
        tocSection.toggleClass('show');
    }

};

ssgCore.Events.closeToc = function() {

    var toc = $('#ssg-toc');

    if (toc.hasClass('show')) {
        toc.removeClass('show');
    }

};

// Fitler for multiple items
ssgCore.Events.filterItems = function(event) {

    var curButton = $(this);
    var filterMode = $(this).text().toLowerCase();

    // Check if TOC is closed
    ssgCore.Events.closeToc();

    // Just in case table of content is filtered
    $('#ssg-btntoc').removeClass('active');

    if (curButton.hasClass('active')) {

        $('.ssg-filter-button').removeClass('active');
        ssgCore.UIHelper.setCategoryFilter(null);

    } else {

        $('.ssg-filter-button').removeClass('active');
        curButton.addClass('active');
        ssgCore.UIHelper.setCategoryFilter(filterMode);

    }

};

// Filter for single item
ssgCore.Events.filterItem = function(event) {

    event.preventDefault();

    var curFilter = $(this);

    if (curFilter.hasClass('selected')) {

        // remove selected from current filter
        curFilter.removeClass('selected');

        // remove active toc selection
        $('#ssg-btntoc').removeClass('active');

        // show all elements
        $('.ssg-item').removeClass('hide');

        return;
    }

    if (curFilter.length === 0) {
        return;
    }

    var curFilterValue = curFilter.data('filter');

    // Set toc filter as selected
    $('#ssg-btntoc').addClass('active');
    $('.ssg-filter-button').removeClass('active');


    // Remove all selected items
    $('.ssg-toc-item').removeClass('selected');

    // Select only the current one
    curFilter.addClass('selected');

    // filter items
    $('.ssg-item').addClass('hide');
    $('.ssg-item[data-file=' + curFilterValue + ']').removeClass('hide');

    // Close table of contents
    $('#ssg-toc').removeClass('show');

};

// Enable disco mode through automatic resizing
ssgCore.Events.enableDiscoMode = function(event) {

    event.preventDefault();

    var discoBtn = $(this),
        patternsContainer = '#ssg-patterns',
        patternsCtrl = $(patternsContainer),

        patternsInnerContainer = '#ssg-patterns-inner',
        patternsInnerCtrl = $(patternsInnerContainer);

    var curWidth = document.width;

    if (!discoBtn.hasClass('active')) {

        discoBtn.addClass('active');

        console.log(curWidth);

        patternsCtrl.css('width', curWidth);

        var cssValues = {
            'width': curWidth,
            'min-width': '100%'
        };

        ssgCore.components.resize();

    } else {

        discoBtn.removeClass('active');

        // patternsCtrl.css('width', '100%');
        ssgCore.components.resize();

    }

};

ssgCore.Events.sectionEnabler = function(curButton, affectedElement) {

    if (curButton.hasClass('active')) {

        curButton.removeClass('active');
        affectedElement.removeClass('show');

    } else {

        curButton.addClass('active');
        affectedElement.addClass('show');

    }

};

// toggle description text
ssgCore.Events.enableAnnotation = function(event) {

    var curButton = $(this),
        affectedElement = $('.ssg-item-description');

    ssgCore.Events.sectionEnabler(curButton, affectedElement);
    $('#ssg-btnisolate').removeClass('active');

    ssgCore.Session.uiOptions.add('annotation');
    console.log('annotation');

};

// toggle to show source code
ssgCore.Events.enableCode = function(event) {

    var curButton = $(this),
        affectedElement = $('.ssg-item-code');

    ssgCore.Events.sectionEnabler(curButton, affectedElement);

    $('.ssg-item').removeClass('isolate');
    $('#ssg-btnisolate').removeClass('active');

    ssgCore.Session.uiOptions.add('code');
    console.log('code');

};

// isolate pattern
ssgCore.Events.isolate = function(event) {

    var curButton = $(this);

    if (curButton.hasClass('active')) {

        curButton.removeClass('active');
        $('.ssg-item').removeClass('isolate');

        ssgCore.Session.uiOptions.remove();

    } else {

        curButton.addClass('active');

        $('.ssg-item').addClass('isolate');
        $('#ssg-btnshowCode').removeClass('active');
        $('#ssg-btnshowAnnot').removeClass('active');

        ssgCore.Session.uiOptions.remove();
        ssgCore.Session.uiOptions.add('isolate');

    }

};


ssgCore.Events.init = (function() {

    // start toggle Toc
    $('.' + baseComponents.toc.class).bind('click', ssgCore.Events.toggleToc);

    // Core filter items for atoms, molecules, organism, tempalte and pages
    $('.ssg-filter-button').bind('click', ssgCore.Events.filterItems);

    // Single item filter
    $('#ssg-toc').on('click', '.ssg-toc-item', ssgCore.Events.filterItem);


    // Viewport resizer: Disco mode
    $('#ssg-btn-disco').bind('click', ssgCore.Events.enableDiscoMode);

    // Toggle Annotation
    $('#ssg-btnshowAnnot').on('click', ssgCore.Events.enableAnnotation);

    // Toggle Annotation
    $('#ssg-btnshowCode').on('click', ssgCore.Events.enableCode);

    // 
    $('#ssg-btnisolate').on('click', ssgCore.Events.isolate);


}());
