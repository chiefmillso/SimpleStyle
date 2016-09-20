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

ssgCore.Events.toggleCss = function(event) {

    event.preventDefault();

    var cssSection = $('#ssg-css');

    if (cssSection.length !== 0) {
        cssSection.toggleClass('show');
    }

};

ssgCore.Events.closeCss = function() {

    var cssSection = $('#ssg-css');

    if (cssSection.hasClass('show')) {
        cssSection.removeClass('show');
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

    // Check if button is active
    if (curButton.hasClass('active')) {

        $('.ssg-filter-button').removeClass('active');
        ssgCore.UIHelper.setCategoryFilter(null);
        ssgCore.components.showAll();

    } else {

        $('.ssg-filter-button').removeClass('active');
        curButton.addClass('active');
        ssgCore.UIHelper.setCategoryFilter(filterMode);
        ssgCore.components.showAll();

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

ssgCore.Events.setSize = function(event) {
    event.preventDefault();
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

// enables different sections
ssgCore.Events.sectionEnabler = function(curButton, affectedElement, noCode) {

    console.log(affectedElement);

    if (curButton.hasClass('active')) {

        curButton.removeClass('active');

        if (noCode === undefined) {
            affectedElement.removeClass('show');
        }

    } else {

        curButton.addClass('active');

        if (noCode === undefined) {
            affectedElement.addClass('show');
        }

    }

};

ssgCore.Events.enableFramework = function(event) {
    var curButton = $(this);
    var frameworkId = curButton.attr('data-link');
    if (curButton.is(":checked")) {
        var frameworkName = frameworkId.replace(/\-/g, '_');
        var framework = ssgCore.templates[frameworkName];
        if (framework != null) {
            var html = framework();
            var content = $(html);
            content.filter('link').attr('data-id', frameworkId);
            content.filter('script').attr('data-id', frameworkId);
            $('head').append(content);
            console.log('ssgCore.Events - Enabling framework: ' + frameworkName);

            ssgCore.Session.frameworks.add(frameworkId);
        }
    } else {
        $('head link[data-id="' + frameworkId + '"]').remove();
        $('head script[data-id="' + frameworkId + '"]').remove();
        ssgCore.Session.frameworks.remove(frameworkId);
    }
};

// toggle description text
ssgCore.Events.enableAnnotation = function(event) {

    var curButton = $(this),
        affectedElement = $('.ssg-item-description');

    ssgCore.Events.sectionEnabler(curButton, affectedElement);
    $('#ssg-btnisolate').removeClass('active');

    ssgCore.Session.uiOptions.add('annotation');

};

// toggle to show source code
ssgCore.Events.enableCode = function(event) {

    var curButton = $(this),
        affectedElement;

    $('.ssg-item').removeClass('isolate');
    $('#ssg-btnisolate').removeClass('active');
    $('#ssg-patterns, #ssg-wrapper').removeClass('isolate-background');

    var currentFilter = ssgCore.Session.filter.get();
    var curIndex = $('#ssg-items').data('item-index');
    affectedElement = $('div[data-cat=' + currentFilter + '] .ssg-item-code');

    // check if current template selection is not template or page
    if (currentFilter !== 'templates' && currentFilter !== 'pages') {

        ssgCore.Events.sectionEnabler(curButton, affectedElement);
        affectedElement.addClass('show');

    } else {
        // when templates or pages are currently selectd
        ssgCore.Events.sectionEnabler(curButton, affectedElement, true);
        console.log($('#ssg-items').data('item-index'));
    }

    if (curButton.hasClass('active')) {

        ssgCore.Session.uiOptions.add('code');

        $('.ssg-item-code').addClass('show');

        console.log('need to enable the code here');
        console.log('currently active');

    } else {

        ssgCore.Session.uiOptions.remove('code');

        $('.ssg-item-code').removeClass('show');

        // remove all code elements
        console.log('remove SHOW here');
        console.log('currently de-active');

    }

    console.log(sessionStorage);

};

// isolate pattern
ssgCore.Events.isolate = function(event) {

    var curButton = $(this);

    if (curButton.hasClass('active')) {

        curButton.removeClass('active');
        $('.ssg-item').removeClass('isolate');
        $('#ssg-patterns, #ssg-wrapper').removeClass('isolate-background');

        ssgCore.Session.uiOptions.remove();

    } else {

        curButton.addClass('active');

        $('.ssg-item').addClass('isolate');
        $('#ssg-patterns, #ssg-wrapper').addClass('isolate-background');
        $('#ssg-btnshowCode').removeClass('active');
        $('#ssg-btnshowAnnot').removeClass('active');

        ssgCore.Session.uiOptions.remove();
        ssgCore.Session.uiOptions.add('isolate');

    }

};

// page and template next handler
ssgCore.Events.prevPage = function(event) {

    event.preventDefault();

    console.log('Move Next');

    var curIndex = $('#ssg-items').data('item-index');

    $('#ssg-items').data('item-index', curIndex - 1);

    ssgCore.components.addSelector(ssgCore.itemSelector, curIndex - 1);

};

// page and template next handler
ssgCore.Events.nextPage = function(event) {

    event.preventDefault();

    //  return;
    var curIndex = parseInt($('#ssg-items').data('item-index'));

    $('.ssg-item-code').removeClass('show');

    $('#ssg-items').data('item-index', curIndex + 1);

    console.log('Move Next');

    ssgCore.components.addSelector(ssgCore.itemSelector, curIndex + 1);

};

// init events
ssgCore.Events.init = (function() {

    // start toggle Toc
    $('.' + baseComponents.toc.class).bind('click', ssgCore.Events.toggleToc);

    $('.' + baseComponents.css.class).bind('click', ssgCore.Events.toggleCss);

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

    // Toggle items to isolate
    $('#ssg-btnisolate').on('click', ssgCore.Events.isolate);

    // Events for Next / Previous
    $('#ssg-item-selector').on('click', '.next', ssgCore.Events.nextPage);
    $('#ssg-item-selector').on('click', '.prev', ssgCore.Events.prevPage);

    $("#ssg-css").on('change', 'input', ssgCore.Events.enableFramework);

}());