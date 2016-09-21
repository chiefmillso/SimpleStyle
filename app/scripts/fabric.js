/* globals fabric */

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
// See LICENSE in the project root for license information.

/**
 * Breadcrumb component
 *
 * Shows the user's current location in a hierarchy and provides a means of navigating upward.
 *
 */

/**
 * @namespace fabric
 */
var fabric = fabric || {};
/**
 *
 * @param {HTMLElement} container - the target container for an instance of Breadcrumb
 * @constructor
 *
 * If dynamically populating a list run the constructor after the list has been populated
 * in the DOM.
 */
fabric.Breadcrumb = function(container) {
    this.breadcrumb = container;
    this.breadcrumbList = container.querySelector('.ms-Breadcrumb-list');
    this.listItems = container.querySelectorAll('.ms-Breadcrumb-listItem');
    this.contextMenu = container.querySelector('.ms-ContextualMenu');
    this.overflowButton = container.querySelector('.ms-Breadcrumb-overflowButton');
    this.overflowMenu = container.querySelector('.ms-Breadcrumb-overflowMenu');
    this.itemCollection = [];
    this.currentMaxItems = 0;
    this.init();

};

fabric.Breadcrumb.prototype = (function() {

    //medium breakpoint
    var MEDIUM = 639;
    var _createItemCollection, _onResize, _renderListOnResize, _addItemsToOverflow, _addBreadcrumbItems;
    var _resetList, _openOverflow, _overflowKeyPress, _closeOverflow, _removeClass;
    var _setListeners, _updateBreadcrumbs, _removeOutlinesOnClick;

    /**
     * initializes component
     */
    var init = function() {
        _setListeners.call(this);
        _createItemCollection.call(this);
        _onResize.call(this, null);
    };

    /**
     * Adds a breadcrumb item to a breadcrumb
     * @param itemLabel {String} the item's text label
     * @param itemLink {String} the item's href link
     * @param tabIndex {number} the item's tabIndex
     */
    var addItem = function(itemLabel, itemLink, tabIndex) {
        this.itemCollection.push({ text: itemLabel, link: itemLink, tabIndex: tabIndex });
        _updateBreadcrumbs.call(this);
    };

    /**
     * Removes a breadcrumb item by item label in the breadcrumbs list
     * @param itemLabel {String} the item's text label
     */
    var removeItemByLabel = function(itemLabel) {
        var i = this.itemCollection.length;
        while (i--) {
            if (this.itemCollection[i].text === itemLabel) {
                this.itemCollection.splice(i, 1);
            }
        }
        _updateBreadcrumbs.call(this);
    };

    /**
     * removes a breadcrumb item by position in the breadcrumbs list
     * index starts at 0
     * @param itemLabel {String} the item's text label
     * @param itemLink {String} the item's href link
     * @param tabIndex {number} the item's tabIndex
     */
    var removeItemByPosition = function(value) {
        this.itemCollection.splice(value, 1);
        _updateBreadcrumbs.call(this);
    };

    /**
     * create internal model of list items from DOM
     */
    _createItemCollection = function() {
        var length = this.listItems.length;
        var i = 0;
        var item;
        var text;
        var link;
        var tabIndex;

        for (i; i < length; i++) {
            item = this.listItems[i].querySelector('.ms-Breadcrumb-itemLink');
            text = item.textContent;
            link = item.getAttribute('href');
            tabIndex = parseInt(item.getAttribute('tabindex'), 10);
            this.itemCollection.push({ text: text, link: link, tabIndex: tabIndex });
        }
    };

    /**
     * Re-render lists on resize
     *
     */
    _onResize = function() {
        _closeOverflow.call(this, null);
        _renderListOnResize.call(this);
    };

    /**
     * render breadcrumbs and overflow menus on resize
     */
    _renderListOnResize = function() {
        var maxItems = window.innerWidth > MEDIUM ? 4 : 2;
        if (maxItems !== this.currentMaxItems) {
            _updateBreadcrumbs.call(this);
        }

        this.currentMaxItems = maxItems;
    };

    /**
     * creates the overflow menu
     */
    _addItemsToOverflow = function(maxItems) {
        _resetList.call(this, this.contextMenu);
        var end = this.itemCollection.length - maxItems;
        var overflowItems = this.itemCollection.slice(0, end);
        var contextMenu = this.contextMenu;
        overflowItems.forEach(function(item) {
            var li = document.createElement('li');
            li.className = 'ms-ContextualMenu-item';
            if (!isNaN(item.tabIndex)) {
                li.setAttribute('tabindex', item.tabIndex);
            }
            var a = document.createElement('a');
            a.className = 'ms-ContextualMenu-link';
            if (item.link !== null) {
                a.setAttribute('href', item.link);
            }
            a.textContent = item.text;
            li.appendChild(a);
            contextMenu.appendChild(li);
        });
    };

    /**
     * creates the breadcrumbs
     */
    _addBreadcrumbItems = function(maxItems) {
        _resetList.call(this, this.breadcrumbList);
        var i = this.itemCollection.length - maxItems;
        i = i < 0 ? 0 : i;
        if (i >= 0) {
            for (i; i < this.itemCollection.length; i++) {
                var listItem = document.createElement('li');
                var item = this.itemCollection[i];
                var a = document.createElement('a');
                var chevron = document.createElement('i');
                listItem.className = 'ms-Breadcrumb-listItem';
                a.className = 'ms-Breadcrumb-itemLink';
                if (item.link !== null) {
                    a.setAttribute('href', item.link);
                }
                if (!isNaN(item.tabIndex)) {
                    a.setAttribute('tabindex', item.tabIndex);
                }
                a.textContent = item.text;
                chevron.className = 'ms-Breadcrumb-chevron ms-Icon ms-Icon--chevronRight';
                listItem.appendChild(a);
                listItem.appendChild(chevron);
                this.breadcrumbList.appendChild(listItem);
            }
        }
    };

    /**
     * resets a list by removing its children
     */
    _resetList = function(list) {
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
    };

    /**
     * opens the overflow menu
     */
    _openOverflow = function(event) {
        if (this.overflowMenu.className.indexOf(' is-open') === -1) {
            this.overflowMenu.className += ' is-open';
            _removeOutlinesOnClick.call(this, event);
            // force focus rect onto overflow button
            this.overflowButton.focus();
        }
    };

    _overflowKeyPress = function(event) {
        if (event.keyCode === 13) {
            _openOverflow.call(this, event);
        }
    };

    /**
     * closes the overflow menu
     */
    _closeOverflow = function(event) {
        if (!event || event.target !== this.overflowButton) {
            _removeClass.call(this, this.overflowMenu, ' is-open');
        }
    };

    /**
     * utility that removes a class from an element
     */
    _removeClass = function(element, value) {
        var index = element.className.indexOf(value);
        if (index > -1) {
            element.className = element.className.substring(0, index);
        }
    };

    /**
     * sets handlers for resize and button click events
     */
    _setListeners = function() {
        window.addEventListener('resize', _onResize.bind(this), false);
        document.addEventListener('click', _closeOverflow.bind(this), false);
        this.overflowButton.addEventListener('click', _openOverflow.bind(this), false);
        this.overflowButton.addEventListener('keypress', _overflowKeyPress.bind(this), false);
        this.breadcrumbList.addEventListener('click', _removeOutlinesOnClick.bind(this), false);
    };

    /**
     * removes focus outlines so they don't linger after click
     */
    _removeOutlinesOnClick = function(event) {
        event.target.blur();
    };

    /**
     * updates the breadcrumbs and overflow menu
     */
    _updateBreadcrumbs = function() {
        var maxItems = window.innerWidth > MEDIUM ? 4 : 2;
        if (this.itemCollection.length > maxItems) {
            this.breadcrumb.className += ' is-overflow';
        } else {
            _removeClass.call(this, this.breadcrumb, ' is-overflow');
        }

        _addBreadcrumbItems.call(this, maxItems);
        _addItemsToOverflow.call(this, maxItems);
    };

    return {
        init: init,
        addItem: addItem,
        removeItemByLabel: removeItemByLabel,
        removeItemByPosition: removeItemByPosition
    };

}());



// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
// See LICENSE in the project root for license information.

/**
 * Contextual Menu Plugin
 */
(function($) {
    $.fn.ContextualMenu = function() {

        /** Go through each nav bar we've been given. */
        return this.each(function() {

            var $contextualMenu = $(this);


            // Set selected states.
            $contextualMenu.on('click', '.ms-ContextualMenu-link:not(.is-disabled)', function(event) {
                event.preventDefault();

                // Check if multiselect - set selected states
                if ($contextualMenu.hasClass('ms-ContextualMenu--multiselect')) {

                    // If already selected, remove selection; if not, add selection
                    if ($(this).hasClass('is-selected')) {
                        $(this).removeClass('is-selected');
                    } else {
                        $(this).addClass('is-selected');
                    }

                }
                // All other contextual menu variants
                else {

                    // Deselect all of the items and close any menus.
                    $('.ms-ContextualMenu-link')
                        .removeClass('is-selected')
                        .siblings('.ms-ContextualMenu')
                        .removeClass('is-open');

                    // Select this item.
                    $(this).addClass('is-selected');

                    // If this item has a menu, open it.
                    if ($(this).hasClass('ms-ContextualMenu-link--hasMenu')) {
                        $(this).siblings('.ms-ContextualMenu:first').addClass('is-open');

                        // Open the menu without bubbling up the click event,
                        // which can cause the menu to close.
                        event.stopPropagation();
                    }

                }


            });

        });
    };
})(jQuery);



// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. 
// See LICENSE in the project root for license information.

/**
 * Command Bar Plugin
 */

(function($) {
    $.fn.CommandBar = function() {

        var createMenuItem = function(text) {
            var item = '<li class="ms-ContextualMenu-item"><a class="ms-ContextualMenu-link"" href="#">';
            item += text;
            item += '</a></li>';

            return item;
        };

        var saveCommands = function($commands, $commandWidth, $commandarea) {
            var commands = [];
            $commands.each(function() {
                var $Item = $(this);
                var itemRight = ($Item.position().left + $Item.outerWidth() + $commandWidth + 10);
                var $rightOffset = itemRight - $commandarea.position().left; // Added padding of 10
                commands.push({ jquery: $Item, rightOffset: $rightOffset });
            });

            return commands;
        };

        var processCommands = function(commands, width, overflowwidth) {
            var overFlowCommands = [];

            for (var i = 0; i < commands.length; i++) {
                var $Item = commands[i].jquery;
                var rightOffset = commands[i].rightOffset;

                // If the command is outside the right boundaries add to overflow items
                if (!$Item.hasClass('ms-CommandBarItem-overflow')) {
                    if ((rightOffset + overflowwidth) > width) {
                        overFlowCommands.push($Item);
                    } else {
                        // Make sure item is displayed
                        $Item.removeClass('is-hidden');
                    }
                }
            }
            return overFlowCommands;
        };

        var processOverflow = function(overFlowCommands, $oCommand, $menu) {
            var overflowStrings = '';

            if (overFlowCommands.length > 0) {
                $oCommand.addClass('is-visible');
                // Empty menu
                $menu.html('');

                // Add overflowed commands to ContextualMenu
                for (var i = 0; i < overFlowCommands.length; i++) {
                    var $Item = $(overFlowCommands[i]);
                    // Hide Element in CommandBar
                    $Item.addClass('is-hidden');
                    var commandBarItemText = $Item.find('.ms-CommandBarItem-commandText').text();
                    overflowStrings += createMenuItem(commandBarItemText);
                }
                $menu.html(overflowStrings);
            } else {
                $oCommand.removeClass('is-visible');
            }
        };

        /** Go through each CommandBar we've been given. */
        return this.each(function() {
            var $CommandBar = $(this);
            var $CommandMainArea = $CommandBar.find('.ms-CommandBar-mainArea');
            var $CommandBarItems = $CommandMainArea.find('.ms-CommandBarItem').not('.ms-CommandBarItem-overflow');
            var $OverflowCommand = $CommandBar.find('.ms-CommandBarItem-overflow');
            var $OverflowCommandWidth = $CommandBar.find('.ms-CommandBarItem-overflow').outerWidth();
            var $OverflowMenu = $CommandBar.find('.ms-CommandBar-overflowMenu');
            var $SearchBox = $CommandBar.find('.ms-CommandBarSearch');
            var mobileSwitch = false;
            var overFlowCommands;
            var allCommands;

            // Go through process and save commands
            allCommands = saveCommands($CommandBarItems, $OverflowCommandWidth, $CommandMainArea);

            // Initiate process commands and add commands to overflow on load
            overFlowCommands = processCommands(allCommands, $CommandMainArea.innerWidth(), $OverflowCommandWidth);
            processOverflow(overFlowCommands, $OverflowCommand, $OverflowMenu);

            // Set Search Behavior
            if ($(window).width() < 640) {

                $('.ms-CommandBarSearch-iconSearchWrapper').click(function() {
                    $(this).closest('.ms-CommandBarSearch').addClass('is-active');
                });

            }

            // Add resize event handler on commandBar
            $(window).resize(function() {
                var overFlowCommands;

                if ($(window).width() < 640 && mobileSwitch === false) {
                    // Go through process and save commands
                    allCommands = saveCommands($CommandBarItems, $OverflowCommandWidth, $CommandMainArea);

                    mobileSwitch = true;

                    // Search Behavior
                    $('.ms-CommandBarSearch-iconSearchWrapper').unbind();
                    $('.ms-CommandBarSearch-iconSearchWrapper').click(function() {
                        $(this).closest('.ms-CommandBarSearch').addClass('is-active');
                    });

                } else if ($(window).width() > 639 && mobileSwitch === true) {
                    // Go through process and save commands
                    allCommands = saveCommands($CommandBarItems, $OverflowCommandWidth, $CommandMainArea);

                    mobileSwitch = false;
                    $('.ms-CommandBarSearch').unbind();

                }

                // Initiate process commands and add commands to overflow on load
                overFlowCommands = processCommands(allCommands, $CommandMainArea.innerWidth(), $OverflowCommandWidth);
                processOverflow(overFlowCommands, $OverflowCommand, $OverflowMenu);

            });

            // Hook up contextual menu
            $OverflowCommand.click(function() {
                $OverflowMenu.toggleClass('is-open');
            });

            $OverflowCommand.focusout(function() {
                $OverflowMenu.removeClass('is-open');
            });

            $SearchBox.find('.ms-CommandBarSearch-input').click(function() {
                $(this).closest('.ms-CommandBarSearch').addClass('is-active');
            });

            $SearchBox.find('.ms-CommandBarSearch-input').on('focus', function() {
                $(this).closest('.ms-CommandBarSearch').addClass('is-active');
            });

            // When clicking the x clear the SearchBox and put state back to normal
            $SearchBox.find('.ms-CommandBarSearch-iconClearWrapper').click(function() {
                var $input = $(this).parent().find('.ms-CommandBarSearch-input');
                $input.val('');
                $input.parent().removeClass('is-active');
            });

            $SearchBox.parent().find('.ms-CommandBarSearch-input').blur(function() {
                var $input = $(this);
                $input.val('');
                $input.parent().removeClass('is-active');
            });

        });
    };
})(jQuery);

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

(function($) {

    /**
     * DatePicker Plugin
     */

    $.fn.DatePicker = function(options) {

        return this.each(function() {

            /** Set up variables and run the Pickadate plugin. */
            var $datePicker = $(this);
            var $dateField = $datePicker.find('.ms-TextField-field').pickadate($.extend({
                // Strings and translations.
                weekdaysShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],

                // Don't render the buttons
                today: '',
                clear: '',
                close: '',

                // Events
                onStart: function() {
                    initCustomView($datePicker);
                },

                // Classes
                klass: {

                    // The element states
                    input: 'ms-DatePicker-input',
                    active: 'ms-DatePicker-input--active',

                    // The root picker and states
                    picker: 'ms-DatePicker-picker',
                    opened: 'ms-DatePicker-picker--opened',
                    focused: 'ms-DatePicker-picker--focused',

                    // The picker holder
                    holder: 'ms-DatePicker-holder',

                    // The picker frame, wrapper, and box
                    frame: 'ms-DatePicker-frame',
                    wrap: 'ms-DatePicker-wrap',
                    box: 'ms-DatePicker-dayPicker',

                    // The picker header
                    header: 'ms-DatePicker-header',

                    // Month & year labels
                    month: 'ms-DatePicker-month',
                    year: 'ms-DatePicker-year',

                    // Table of dates
                    table: 'ms-DatePicker-table',

                    // Weekday labels
                    weekdays: 'ms-DatePicker-weekday',

                    // Day states
                    day: 'ms-DatePicker-day',
                    disabled: 'ms-DatePicker-day--disabled',
                    selected: 'ms-DatePicker-day--selected',
                    highlighted: 'ms-DatePicker-day--highlighted',
                    now: 'ms-DatePicker-day--today',
                    infocus: 'ms-DatePicker-day--infocus',
                    outfocus: 'ms-DatePicker-day--outfocus',

                }
            }, options || {}));
            var $picker = $dateField.pickadate('picker');

            /** Respond to built-in picker events. */
            $picker.on({
                render: function() {
                    updateCustomView($datePicker);
                },
                open: function() {
                    scrollUp($datePicker);
                }
            });

        });
    };

    /**
     * After the Pickadate plugin starts, this function
     * adds additional controls to the picker view.
     */
    function initCustomView($datePicker) {

        /** Get some variables ready. */
        var $monthControls = $datePicker.find('.ms-DatePicker-monthComponents');
        var $goToday = $datePicker.find('.ms-DatePicker-goToday');
        var $monthPicker = $datePicker.find('.ms-DatePicker-monthPicker');
        var $yearPicker = $datePicker.find('.ms-DatePicker-yearPicker');
        var $pickerWrapper = $datePicker.find('.ms-DatePicker-wrap');
        var $picker = $datePicker.find('.ms-TextField-field').pickadate('picker');

        /** Move the month picker into position. */
        $monthControls.appendTo($pickerWrapper);
        $goToday.appendTo($pickerWrapper);
        $monthPicker.appendTo($pickerWrapper);
        $yearPicker.appendTo($pickerWrapper);

        /** Update the custom view. */
        updateCustomView($datePicker);

        /** Move back one month. */
        $monthControls.on('click', '.js-prevMonth', function(event) {
            event.preventDefault();
            var newMonth = $picker.get('highlight').month - 1;
            changeHighlightedDate($picker, null, newMonth, null);
        });

        /** Move ahead one month. */
        $monthControls.on('click', '.js-nextMonth', function(event) {
            event.preventDefault();
            var newMonth = $picker.get('highlight').month + 1;
            changeHighlightedDate($picker, null, newMonth, null);
        });

        /** Move back one year. */
        $monthPicker.on('click', '.js-prevYear', function(event) {
            event.preventDefault();
            var newYear = $picker.get('highlight').year - 1;
            changeHighlightedDate($picker, newYear, null, null);
        });

        /** Move ahead one year. */
        $monthPicker.on('click', '.js-nextYear', function(event) {
            event.preventDefault();
            var newYear = $picker.get('highlight').year + 1;
            changeHighlightedDate($picker, newYear, null, null);
        });

        /** Move back one decade. */
        $yearPicker.on('click', '.js-prevDecade', function(event) {
            event.preventDefault();
            var newYear = $picker.get('highlight').year - 10;
            changeHighlightedDate($picker, newYear, null, null);
        });

        /** Move ahead one decade. */
        $yearPicker.on('click', '.js-nextDecade', function(event) {
            event.preventDefault();
            var newYear = $picker.get('highlight').year + 10;
            changeHighlightedDate($picker, newYear, null, null);
        });

        /** Go to the current date, shown in the day picking view. */
        $goToday.click(function(event) {
            event.preventDefault();

            /** Select the current date, while keeping the picker open. */
            var now = new Date();
            $picker.set('select', [now.getFullYear(), now.getMonth(), now.getDate()]);

            /** Switch to the default (calendar) view. */
            $datePicker.removeClass('is-pickingMonths').removeClass('is-pickingYears');

        });

        /** Change the highlighted month. */
        $monthPicker.on('click', '.js-changeDate', function(event) {
            event.preventDefault();

            /** Get the requested date from the data attributes. */
            var newYear = $(this).attr('data-year');
            var newMonth = $(this).attr('data-month');
            var newDay = $(this).attr('data-day');

            /** Update the date. */
            changeHighlightedDate($picker, newYear, newMonth, newDay);

            /** If we've been in the "picking months" state on mobile, remove that state so we show the calendar again. */
            if ($datePicker.hasClass('is-pickingMonths')) {
                $datePicker.removeClass('is-pickingMonths');
            }
        });

        /** Change the highlighted year. */
        $yearPicker.on('click', '.js-changeDate', function(event) {
            event.preventDefault();

            /** Get the requested date from the data attributes. */
            var newYear = $(this).attr('data-year');
            var newMonth = $(this).attr('data-month');
            var newDay = $(this).attr('data-day');

            /** Update the date. */
            changeHighlightedDate($picker, newYear, newMonth, newDay);

            /** If we've been in the "picking years" state on mobile, remove that state so we show the calendar again. */
            if ($datePicker.hasClass('is-pickingYears')) {
                $datePicker.removeClass('is-pickingYears');
            }
        });

        /** Switch to the default state. */
        $monthPicker.on('click', '.js-showDayPicker', function() {
            $datePicker.removeClass('is-pickingMonths');
            $datePicker.removeClass('is-pickingYears');
        });

        /** Switch to the is-pickingMonths state. */
        $monthControls.on('click', '.js-showMonthPicker', function() {
            $datePicker.toggleClass('is-pickingMonths');
        });

        /** Switch to the is-pickingYears state. */
        $monthPicker.on('click', '.js-showYearPicker', function() {
            $datePicker.toggleClass('is-pickingYears');
        });

    }

    /** Change the highlighted date. */
    function changeHighlightedDate($picker, newYear, newMonth, newDay) {

        /** All letiables are optional. If not provided, default to the current value. */
        if (typeof newYear === "undefined" || newYear === null) {
            newYear = $picker.get("highlight").year;
        }
        if (typeof newMonth === "undefined" || newMonth === null) {
            newMonth = $picker.get("highlight").month;
        }
        if (typeof newDay === "undefined" || newDay === null) {
            newDay = $picker.get("highlight").date;
        }

        /** Update it. */
        $picker.set('highlight', [newYear, newMonth, newDay]);

    }


    /** Whenever the picker renders, do our own rendering on the custom controls. */
    function updateCustomView($datePicker) {

        /** Get some variables ready. */
        var $monthPicker = $datePicker.find('.ms-DatePicker-monthPicker');
        var $yearPicker = $datePicker.find('.ms-DatePicker-yearPicker');
        var $picker = $datePicker.find('.ms-TextField-field').pickadate('picker');

        /** Set the correct year. */
        $monthPicker.find('.ms-DatePicker-currentYear').text($picker.get('view').year);

        /** Highlight the current month. */
        $monthPicker.find('.ms-DatePicker-monthOption').removeClass('is-highlighted');
        $monthPicker.find('.ms-DatePicker-monthOption[data-month="' + $picker.get('highlight').month + '"]').addClass('is-highlighted');

        /** Generate the grid of years for the year picker view. */

        // Start by removing any existing generated output. */
        $yearPicker.find('.ms-DatePicker-currentDecade').remove();
        $yearPicker.find('.ms-DatePicker-optionGrid').remove();

        // Generate the output by going through the years.
        var startingYear = $picker.get('highlight').year - 11;
        var decadeText = startingYear + " - " + (startingYear + 11);
        var output = '<div class="ms-DatePicker-currentDecade">' + decadeText + '</div>';
        output += '<div class="ms-DatePicker-optionGrid">';
        for (var year = startingYear; year < (startingYear + 12); year++) {
            output += '<span class="ms-DatePicker-yearOption js-changeDate" data-year="' + year + '">' + year + '</span>';
        }
        output += '</div>';

        // Output the title and grid of years generated above.
        $yearPicker.append(output);

        /** Highlight the current year. */
        $yearPicker.find('.ms-DatePicker-yearOption').removeClass('is-highlighted');
        $yearPicker.find('.ms-DatePicker-yearOption[data-year="' + $picker.get('highlight').year + '"]').addClass('is-highlighted');
    }

    /** Scroll the page up so that the field the date picker is attached to is at the top. */
    function scrollUp($datePicker) {
        $('html, body').animate({
            scrollTop: $datePicker.offset().top
        }, 367);
    }

})(jQuery);

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Dropdown Plugin
 *
 * Given .ms-Dropdown containers with generic <select> elements inside, this plugin hides the original
 * dropdown and creates a new "fake" dropdown that can more easily be styled across browsers.
 *
 * @param  {jQuery Object}  One or more .ms-Dropdown containers, each with a dropdown (.ms-Dropdown-select)
 * @return {jQuery Object}  The same containers (allows for chaining)
 */
(function($) {
    $.fn.Dropdown = function() {

        /** Go through each dropdown we've been given. */
        return this.each(function() {

            var $dropdownWrapper = $(this),
                $originalDropdown = $dropdownWrapper.children('.ms-Dropdown-select'),
                $originalDropdownOptions = $originalDropdown.children('option'),
                newDropdownTitle = '',
                newDropdownItems = '',
                newDropdownSource = '';

            /** Go through the options to fill up newDropdownTitle and newDropdownItems. */
            $originalDropdownOptions.each(function(index, option) {

                /** If the option is selected, it should be the new dropdown's title. */
                if (option.selected) {
                    newDropdownTitle = option.text;
                }

                /** Add this option to the list of items. */
                newDropdownItems += '<li class="ms-Dropdown-item' + ((option.disabled) ? ' is-disabled"' : '"') + '>' + option.text + '</li>';

            });

            /** Insert the replacement dropdown. */
            newDropdownSource = '<span class="ms-Dropdown-title">' + newDropdownTitle + '</span><ul class="ms-Dropdown-items">' + newDropdownItems + '</ul>';
            $dropdownWrapper.append(newDropdownSource);

            function _openDropdown(evt) {
                if (!$dropdownWrapper.hasClass('is-disabled')) {

                    /** First, let's close any open dropdowns on this page. */
                    $dropdownWrapper.find('.is-open').removeClass('is-open');

                    /** Stop the click event from propagating, which would just close the dropdown immediately. */
                    evt.stopPropagation();

                    /** Before opening, size the items list to match the dropdown. */
                    var dropdownWidth = $(this).parents(".ms-Dropdown").width();
                    $(this).next(".ms-Dropdown-items").css('width', dropdownWidth + 'px');

                    /** Go ahead and open that dropdown. */
                    $dropdownWrapper.toggleClass('is-open');
                    $('.ms-Dropdown').each(function() {
                        if ($(this)[0] !== $dropdownWrapper[0]) {
                            $(this).removeClass('is-open');
                        }
                    });

                    /** Temporarily bind an event to the document that will close this dropdown when clicking anywhere. */
                    $(document).bind("click.dropdown", function() {
                        $dropdownWrapper.removeClass('is-open');
                        $(document).unbind('click.dropdown');
                    });
                }
            }

            /** Toggle open/closed state of the dropdown when clicking its title. */
            $dropdownWrapper.on('click', '.ms-Dropdown-title', function(event) {
                _openDropdown(event);
            });

            /** Keyboard accessibility */
            $dropdownWrapper.on('keyup', function(event) {
                var keyCode = event.keyCode || event.which;
                // Open dropdown on enter or arrow up or arrow down and focus on first option
                if (!$(this).hasClass('is-open')) {
                    if (keyCode === 13 || keyCode === 38 || keyCode === 40) {
                        _openDropdown(event);
                        if (!$(this).find('.ms-Dropdown-item').hasClass('is-selected')) {
                            $(this).find('.ms-Dropdown-item:first').addClass('is-selected');
                        }
                    }
                } else if ($(this).hasClass('is-open')) {
                    // Up arrow focuses previous option
                    if (keyCode === 38) {
                        if ($(this).find('.ms-Dropdown-item.is-selected').prev().siblings().size() > 0) {
                            $(this).find('.ms-Dropdown-item.is-selected').removeClass('is-selected').prev().addClass('is-selected');
                        }
                    }
                    // Down arrow focuses next option
                    if (keyCode === 40) {
                        if ($(this).find('.ms-Dropdown-item.is-selected').next().siblings().size() > 0) {
                            $(this).find('.ms-Dropdown-item.is-selected').removeClass('is-selected').next().addClass('is-selected');
                        }
                    }
                    // Enter to select item
                    if (keyCode === 13) {
                        if (!$dropdownWrapper.hasClass('is-disabled')) {

                            // Item text
                            var selectedItemText = $(this).find('.ms-Dropdown-item.is-selected').text();

                            $(this).find('.ms-Dropdown-title').html(selectedItemText);

                            /** Update the original dropdown. */
                            $originalDropdown.find("option").each(function(key, value) {
                                if (value.text === selectedItemText) {
                                    $(this).prop('selected', true);
                                } else {
                                    $(this).prop('selected', false);
                                }
                            });
                            $originalDropdown.change();

                            $(this).removeClass('is-open');
                        }
                    }
                }

                // Close dropdown on esc
                if (keyCode === 27) {
                    $(this).removeClass('is-open');
                }
            });

            /** Select an option from the dropdown. */
            $dropdownWrapper.on('click', '.ms-Dropdown-item', function() {
                if (!$dropdownWrapper.hasClass('is-disabled') && !$(this).hasClass('is-disabled')) {

                    /** Deselect all items and select this one. */
                    $(this).siblings('.ms-Dropdown-item').removeClass('is-selected');
                    $(this).addClass('is-selected');

                    /** Update the replacement dropdown's title. */
                    $(this).parents().siblings('.ms-Dropdown-title').html($(this).text());

                    /** Update the original dropdown. */
                    var selectedItemText = $(this).text();
                    $originalDropdown.find("option").each(function(key, value) {
                        if (value.text === selectedItemText) {
                            $(this).prop('selected', true);
                        } else {
                            $(this).prop('selected', false);
                        }
                    });
                    $originalDropdown.change();
                }
            });

        });
    };
})(jQuery);