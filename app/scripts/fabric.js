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

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Facepile Plugin
 *
 * Adds basic demonstration functionality to .ms-Facepile components.
 *
 * @param  {jQuery Object}  One or more .ms-Facepile components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function($) {
    $.fn.Facepile = function() {

        /** Iterate through each Facepile provided. */
        return this.each(function() {
            $('.ms-PeoplePicker').PeoplePicker();
            $('.ms-Panel').Panel();

            var $Facepile = $(this);
            var $membersList = $(".ms-Facepile-members");
            var $membersCount = $(".ms-Facepile-members > .ms-Facepile-itemBtn").length;
            var $panel = $('.ms-Facepile-panel.ms-Panel');
            var $panelMain = $panel.find(".ms-Panel-main");
            var $picker = $('.ms-PeoplePicker.ms-PeoplePicker--Facepile');
            var $pickerMembers = $picker.find('.ms-PeoplePicker-selectedPeople');
            var $personaCard = $('.ms-Facepile').find('.ms-PersonaCard');


            /** Increment member count and show/hide overflow text */
            var incrementMembers = function() {
                /** Increment person count by one */
                $membersCount += 1;

                /** Display a maxiumum of 5 people */
                $(".ms-Facepile-members").children(":gt(4)").hide();

                /** Display counter after 5 people are present */
                if ($membersCount > 5) {
                    $(".ms-Facepile-itemBtn--overflow").addClass("is-active");

                    var remainingMembers = $membersCount - 5;
                    $(".ms-Facepile-overflowText").text("+" + remainingMembers);
                }
            };

            /** Open panel with people picker */
            $Facepile.on("click", ".js-addPerson", function() {
                $panelMain.css({ display: "block" });
                $panel.toggleClass("is-open")
                    .addClass("ms-Panel-animateIn")
                    .removeClass('ms-Facepile-panel--overflow ms-Panel--right')
                    .addClass('ms-Facepile-panel--addPerson');

                /** Close any open persona cards */
                $personaCard.removeClass('is-active').hide();
            });

            $panel.on("click", ".js-togglePanel", function() {
                $panel.toggleClass("is-open")
                    .addClass("ms-Panel-animateIn");
            });

            /** Open oveflow panel with list of members */
            $Facepile.on("click", ".js-overflowPanel", function() {
                $panelMain.css({ display: "block" });
                $panel.toggleClass("is-open")
                    .addClass("ms-Panel-animateIn")
                    .removeClass('ms-Facepile-panel--addPerson')
                    .addClass('ms-Facepile-panel--overflow ms-Panel--right');
            });

            /** Display person count on page load */
            $(document).ready(function() {
                $(".ms-Facepile-overflowText").text("+" + $membersCount);
            });

            /** Show selected members from PeoplePicker in the Facepile */
            $('.ms-PeoplePicker-result').on('click', function() {
                var $this = $(this);
                var name = $this.find(".ms-Persona-primaryText").html();
                var title = $this.find(".ms-Persona-secondaryText").html();
                var selectedInitials = (function() {
                    var nameArray = name.split(' ');
                    var nameInitials = '';
                    for (var i = 0; i < nameArray.length; i++) {
                        nameInitials += nameArray[i].charAt(0);
                    }

                    return nameInitials.substring(0, 2);
                })();
                var selectedClasses = $this.find('.ms-Persona-initials').attr('class');
                var selectedImage = (function() {
                    if ($this.find('.ms-Persona-image').length) {
                        var selectedImageSrc = $this.find('.ms-Persona-image').attr('src');
                        return '<img class="ms-Persona-image" src="' + selectedImageSrc + '" alt="Persona image">';
                    } else {
                        return '';
                    }
                })();

                var FacepileItem =
                    '<button class="ms-Facepile-itemBtn ms-Facepile-itemBtn--member" title="' + name + '">' +
                    '<div class="ms-Persona ms-Persona--xs">' +
                    '<div class="ms-Persona-imageArea">' +
                    '<div class="' + selectedClasses + '">' + selectedInitials + '</div>' +
                    selectedImage +
                    '</div>' +
                    '<div class="ms-Persona-presence"></div>' +
                    '<div class="ms-Persona-details">' +
                    '<div class="ms-Persona-primaryText">' + name + '</div>' +
                    '<div class="ms-Persona-secondaryText">' + title + '</div>' +
                    '</div>' +
                    '</div>' +
                    '</button>';

                /** Add new item to members list in Facepile */
                $membersList.prepend(FacepileItem);

                /** Increment member count */
                incrementMembers();
            });

            /** Remove members in panel people picker */
            $pickerMembers.on('click', '.js-selectedRemove', function() {
                var memberText = $(this).parent().find('.ms-Persona-primaryText').text();

                var $FacepileMember = $membersList.find(".ms-Persona-primaryText:contains(" + memberText + ")").first();

                if ($FacepileMember) {
                    $FacepileMember.parent().closest('.ms-Facepile-itemBtn').remove();

                    $membersCount -= 1;

                    /** Display a maxiumum of 5 people */
                    $(".ms-Facepile-members").children(":lt(5)").show();

                    /** Display counter after 5 people are present */
                    if ($membersCount <= 5) {
                        $(".ms-Facepile-itemBtn--overflow").removeClass("is-active");
                    } else {
                        var remainingMembers = $membersCount - 5;
                        $(".ms-Facepile-overflowText").text("+" + remainingMembers);
                    }
                }
            });

            /** Show persona card when selecting a Facepile item */
            $membersList.on('click', '.ms-Facepile-itemBtn', function() {
                var selectedName = $(this).find(".ms-Persona-primaryText").html();
                var selectedTitle = $(this).find(".ms-Persona-secondaryText").html();
                var selectedInitials = (function() {
                    var name = selectedName.split(' ');
                    var nameInitials = '';
                    for (var i = 0; i < name.length; i++) {
                        nameInitials += name[i].charAt(0);
                    }

                    return nameInitials.substring(0, 2);
                })();
                var selectedClasses = $(this).find('.ms-Persona-initials').attr('class');
                var selectedImage = $(this).find('.ms-Persona-image').attr('src');
                var $card = $('.ms-PersonaCard');
                var $cardName = $card.find('.ms-Persona-primaryText');
                var $cardTitle = $card.find('.ms-Persona-secondaryText');
                var $cardInitials = $card.find('.ms-Persona-initials');
                var $cardImage = $card.find('.ms-Persona-image');

                /** Close any open persona cards */
                $personaCard.removeClass('is-active');

                /** Add data to persona card */
                $cardName.text(selectedName);
                $cardTitle.text(selectedTitle);
                $cardInitials.text(selectedInitials);
                $cardInitials.removeClass();
                $cardInitials.addClass(selectedClasses);
                $cardImage.attr('src', selectedImage);

                /** Show persona card */
                setTimeout(function() { $personaCard.addClass('is-active'); }, 100);

                /** Align persona card on md and above screens */
                if ($(window).width() > 480) {
                    var itemPosition = $(this).offset().left;
                    var correctedPosition = itemPosition - 26;

                    $personaCard.css({ 'left': correctedPosition });
                } else {
                    $personaCard.css({ 'left': 0, 'top': 'auto', 'position': 'fixed' });
                }
            });

            /** Dismiss persona card when clicking on the document */
            $(document).on('click', function(e) {
                var $memberBtn = $('.ms-Facepile-itemBtn--member');

                if (!$memberBtn.is(e.target) && $memberBtn.has(e.target).length === 0 && !$personaCard.is(e.target) && $personaCard.has(e.target).length === 0) {
                    $personaCard.removeClass('is-active');
                    $personaCard.removeAttr('style');
                } else {
                    $personaCard.addClass('is-active');
                }
            });

        });
    };
})(jQuery);


// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Panel Plugin
 *
 * Adds basic demonstration functionality to .ms-Panel components.
 *
 * @param  {jQuery Object}  One or more .ms-Panel components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function($) {
    $.fn.Panel = function() {

        var pfx = ["webkit", "moz", "MS", "o", ""];

        // Prefix function
        function prefixedEvent(element, type, callback) {
            for (var p = 0; p < pfx.length; p++) {
                if (!pfx[p]) { type = type.toLowerCase(); }
                element.addEventListener(pfx[p] + type, callback, false);
            }
        }

        /** Go through each panel we've been given. */
        return this.each(function() {

            var $panel = $(this);
            var $panelMain = $panel.find(".ms-Panel-main");

            /** Hook to open the panel. */
            $(".ms-PanelAction-close").on("click", function() {

                // Display Panel first, to allow animations
                $panel.addClass("ms-Panel-animateOut");

            });

            $(".ms-PanelAction-open").on("click", function() {

                // Display Panel first, to allow animations
                $panel.addClass("is-open");

                // Add animation class
                $panel.addClass("ms-Panel-animateIn");

            });

            prefixedEvent($panelMain[0], 'AnimationEnd', function(event) {
                if (event.animationName.indexOf('Out') > -1) {

                    // Hide and Prevent ms-Panel-main from being interactive
                    $panel.removeClass('is-open');

                    // Remove animating classes for the next time we open panel
                    $panel.removeClass('ms-Panel-animateIn ms-Panel-animateOut');

                }
            });

            // Pivots for sample page to show variant panel sizes
            $(".panelVariant-item").on("click", function() {
                var className = $(this).find('span').attr('class');

                $(".panelVariant-item").removeClass('is-selected');
                $(this).addClass('is-selected');

                switch (className) {
                    case 'is-default':
                        $('.ms-Panel').removeClass().addClass('ms-Panel');
                        break;
                    case 'is-left':
                        $('.ms-Panel').removeClass().addClass('ms-Panel ms-Panel--left');
                        break;
                    case 'is-lightDismiss':
                        $('.ms-Panel').removeClass().addClass('ms-Panel ms-Panel--lightDismiss');
                        break;
                    case 'is-md':
                        $('.ms-Panel').removeClass().addClass('ms-Panel ms-Panel--md');
                        break;
                    case 'is-lgFixed':
                        $('.ms-Panel').removeClass().addClass('ms-Panel ms-Panel--lg ms-Panel--fixed');
                        break;
                    case 'is-lg':
                        $('.ms-Panel').removeClass().addClass('ms-Panel ms-Panel--lg');
                        break;
                    case 'is-xl':
                        $('.ms-Panel').removeClass().addClass('ms-Panel ms-Panel--xl');
                        break;
                }
            });
        });

    };
})(jQuery);


// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Spinner Component
 *
 * An animating activity indicator.
 *
 */

/**
 * @namespace fabric
 */
var fabric = fabric || {};

/**
 * @param {HTMLDOMElement} target - The element the Spinner will attach itself to.
 */

fabric.Spinner = function(target) {

    var _target = target;
    var eightSize = 0.2;
    var circleObjects = [];
    var animationSpeed = 90;
    var interval;
    var spinner;
    var numCircles;
    var offsetSize;
    var fadeIncrement = 0;
    var parentSize = 20;

    /**
     * @function start - starts or restarts the animation sequence
     * @memberOf fabric.Spinner
     */
    function start() {
        stop();
        interval = setInterval(function() {
            var i = circleObjects.length;
            while (i--) {
                _fade(circleObjects[i]);
            }
        }, animationSpeed);
    }

    /**
     * @function stop - stops the animation sequence
     * @memberOf fabric.Spinner
     */
    function stop() {
        clearInterval(interval);
    }

    //private methods

    function _init() {
        _setTargetElement();
        _setPropertiesForSize();
        _createCirclesAndArrange();
        _initializeOpacities();
        start();
    }

    function _initializeOpacities() {
        var i = 0;
        var j = 1;
        var opacity;
        fadeIncrement = 1 / numCircles;

        for (i; i < numCircles; i++) {
            var circleObject = circleObjects[i];
            opacity = (fadeIncrement * j++);
            _setOpacity(circleObject.element, opacity);
        }
    }

    function _fade(circleObject) {
        var opacity = _getOpacity(circleObject.element) - fadeIncrement;

        if (opacity <= 0) {
            opacity = 1;
        }

        _setOpacity(circleObject.element, opacity);
    }

    function _getOpacity(element) {
        return parseFloat(window.getComputedStyle(element).getPropertyValue("opacity"));
    }

    function _setOpacity(element, opacity) {
        element.style.opacity = opacity;
    }

    function _createCircle() {
        var circle = document.createElement('div');
        circle.className = "ms-Spinner-circle";
        circle.style.width = circle.style.height = parentSize * offsetSize + "px";
        return circle;
    }

    function _createCirclesAndArrange() {

        var angle = 0;
        var offset = parentSize * offsetSize;
        var step = (2 * Math.PI) / numCircles;
        var i = numCircles;
        var circleObject;
        var radius = (parentSize - offset) * 0.5;

        while (i--) {
            var circle = _createCircle();
            var x = Math.round(parentSize * 0.5 + radius * Math.cos(angle) - circle.clientWidth * 0.5) - offset * 0.5;
            var y = Math.round(parentSize * 0.5 + radius * Math.sin(angle) - circle.clientHeight * 0.5) - offset * 0.5;
            spinner.appendChild(circle);
            circle.style.left = x + 'px';
            circle.style.top = y + 'px';
            angle += step;
            circleObject = { element: circle, j: i };
            circleObjects.push(circleObject);
        }
    }

    function _setPropertiesForSize() {
        if (spinner.className.indexOf("large") > -1) {
            parentSize = 28;
            eightSize = 0.179;
        }

        offsetSize = eightSize;
        numCircles = 8;
    }

    function _setTargetElement() {
        //for backwards compatibility
        if (_target.className.indexOf("ms-Spinner") === -1) {
            spinner = document.createElement("div");
            spinner.className = "ms-Spinner";
            _target.appendChild(spinner);
        } else {
            spinner = _target;
        }
    }

    _init();

    return {
        start: start,
        stop: stop
    };
};

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

var fabric = fabric || {};

/**
 * People Picker Plugin
 *
 * Adds basic demonstration functionality to .ms-PeoplePicker components.
 * 
 * @param  {jQuery Object}  One or more .ms-PeoplePicker components
 * @return {jQuery Object}  The same components (allows for chaining)
 */

(function($) {
    $.fn.PeoplePicker = function() {

        /** Iterate through each people picker provided. */
        return this.each(function() {

            var $peoplePicker = $(this);
            var $searchField = $peoplePicker.find(".ms-PeoplePicker-searchField");
            var $results = $peoplePicker.find(".ms-PeoplePicker-results");
            var $selected = $peoplePicker.find('.ms-PeoplePicker-selected');
            var $selectedPeople = $peoplePicker.find(".ms-PeoplePicker-selectedPeople");
            var $selectedCount = $peoplePicker.find(".ms-PeoplePicker-selectedCount");
            var $peopleList = $peoplePicker.find(".ms-PeoplePicker-peopleList");
            var isActive = false;
            var spinner;
            var $personaCard = $('.ms-PeoplePicker').find('.ms-PersonaCard');

            // Run when focused or clicked
            function peoplePickerActive(event) {
                /** Scroll the view so that the people picker is at the top. */
                $('html, body').animate({
                    scrollTop: $peoplePicker.offset().top
                }, 367);

                /** Start by closing any open people pickers. */
                if ($peoplePicker.hasClass('is-active')) {
                    $peoplePicker.removeClass("is-active");
                }

                /** Display a maxiumum of 5 people in Facepile variant */
                if ($peoplePicker.hasClass('ms-PeoplePicker--Facepile') && $searchField.val() === "") {
                    $peopleList.children(":gt(4)").hide();
                }

                /** Animate results and members in Facepile variant. */
                if ($peoplePicker.hasClass('ms-PeoplePicker--Facepile')) {
                    // $results.addClass('ms-u-slideDownIn20');
                    $selectedPeople.addClass('ms-u-slideDownIn20');
                    setTimeout(function() {
                        $results.removeClass('ms-u-slideDownIn20');
                        $selectedPeople.removeClass('ms-u-slideDownIn20');
                    }, 1000);
                }

                isActive = true;

                /** Stop the click event from propagating, which would just close the dropdown immediately. */
                event.stopPropagation();

                /** Before opening, size the results panel to match the people picker. */
                if (!$peoplePicker.hasClass('ms-PeoplePicker--Facepile')) {
                    $results.width($peoplePicker.width() - 2);
                }

                /** Show the $results by setting the people picker to active. */
                $peoplePicker.addClass("is-active");

                /** Temporarily bind an event to the document that will close the people picker when clicking anywhere. */
                $(document).bind("click.peoplepicker", function() {
                    $peoplePicker.removeClass('is-active');
                    if ($peoplePicker.hasClass('ms-PeoplePicker--Facepile')) {
                        $peoplePicker.removeClass('is-searching');
                        $('.ms-PeoplePicker-selected').show();
                        $('.ms-PeoplePicker-searchMore').removeClass('is-active');
                        $searchField.val("");
                    }
                    $(document).unbind('click.peoplepicker');
                    isActive = false;
                });
            }

            /** Set to active when focusing on the input. */
            $peoplePicker.on('focus', '.ms-PeoplePicker-searchField', function(event) {
                peoplePickerActive(event);
            });

            /** Set to active when clicking on the input. */
            $peoplePicker.on('click', '.ms-PeoplePicker-searchField', function(event) {
                peoplePickerActive(event);
            });

            /** Keep the people picker active when clicking within it. */
            $(this).click(function(event) {
                event.stopPropagation();
            });

            /** Add the selected person to the text field or selected list and close the people picker. */
            $results.on('click', '.ms-PeoplePicker-result', function() {
                var $this = $(this);
                var selectedName = $this.find(".ms-Persona-primaryText").html();
                var selectedTitle = $this.find(".ms-Persona-secondaryText").html();
                var selectedInitials = (function() {
                    var name = selectedName.split(' ');
                    var nameInitials = '';

                    for (var i = 0; i < name.length; i++) {
                        nameInitials += name[i].charAt(0);
                    }

                    return nameInitials.substring(0, 2);
                })();
                var selectedClasses = $this.find('.ms-Persona-initials').attr('class');
                var selectedImage = (function() {
                    if ($this.find('.ms-Persona-image').length) {
                        var selectedImageSrc = $this.find('.ms-Persona-image').attr('src');
                        return '<img class="ms-Persona-image" src="' + selectedImageSrc + '" alt="Persona image">';
                    } else {
                        return '';
                    }
                })();

                /** Token html */
                var personaHTML = '<div class="ms-PeoplePicker-persona">' +
                    '<div class="ms-Persona ms-Persona--xs ms-Persona--square">' +
                    '<div class="ms-Persona-imageArea">' +
                    '<div class="' + selectedClasses + '">' + selectedInitials + '</div>' +
                    selectedImage +
                    '</div>' +
                    '<div class="ms-Persona-presence"></div>' +
                    '<div class="ms-Persona-details">' +
                    '<div class="ms-Persona-primaryText">' + selectedName + '</div>' +
                    ' </div>' +
                    '</div>' +
                    '<button class="ms-PeoplePicker-personaRemove">' +
                    '<i class="ms-Icon ms-Icon--x"></i>' +
                    ' </button>' +
                    '</div>';
                /** List item html */
                var personaListItem = '<li class="ms-PeoplePicker-selectedPerson">' +
                    '<div class="ms-Persona ms-Persona--sm">' +
                    '<div class="ms-Persona-imageArea">' +
                    '<div class="' + selectedClasses + '">' + selectedInitials + '</div>' +
                    selectedImage +
                    '</div>' +
                    '<div class="ms-Persona-presence"></div>' +
                    '<div class="ms-Persona-details">' +
                    '<div class="ms-Persona-primaryText">' + selectedName + '</div>' +
                    '<div class="ms-Persona-secondaryText">' + selectedTitle + '</div>' +
                    '</div>' +
                    '</div>' +
                    '<button class="ms-PeoplePicker-resultAction js-selectedRemove"><i class="ms-Icon ms-Icon--x"></i></button>' +
                    '</li>';
                /** Tokenize selected persona if not Facepile or memberslist variants */
                if (!$peoplePicker.hasClass('ms-PeoplePicker--Facepile') && !$peoplePicker.hasClass('ms-PeoplePicker--membersList')) {
                    $searchField.before(personaHTML);
                    $peoplePicker.removeClass("is-active");
                    resizeSearchField($peoplePicker);
                }
                /** Add selected persona to a list if Facepile or memberslist variants */
                else {
                    if (!$selected.hasClass('is-active')) {
                        $selected.addClass('is-active');
                    }
                    /** Prepend persona list item html to selected people list */
                    $selectedPeople.prepend(personaListItem);
                    /** Close the picker */
                    $peoplePicker.removeClass("is-active");
                    /** Get the total amount of selected personas and display that number */
                    var count = $peoplePicker.find('.ms-PeoplePicker-selectedPerson').length;
                    $selectedCount.html(count);
                    /** Return picker back to default state:
                    - Show only the first five results in the people list for when the picker is reopened
                    - Make searchMore inactive
                    - Clear any search field text 
                    */
                    $peopleList.children().show();
                    $peopleList.children(":gt(4)").hide();

                    $('.ms-PeoplePicker-searchMore').removeClass('is-active');
                    $searchField.val("");
                }
            });

            /** Remove the persona when clicking the personaRemove button. */
            $peoplePicker.on('click', '.ms-PeoplePicker-personaRemove', function() {
                $(this).parents('.ms-PeoplePicker-persona').remove();

                /** Make the search field 100% width if all personas have been removed */
                if ($('.ms-PeoplePicker-persona').length === 0) {
                    $peoplePicker.find('.ms-PeoplePicker-searchField').outerWidth('100%');
                } else {
                    resizeSearchField($peoplePicker);
                }
            });

            /** Trigger additional searching when clicking the search more area. */
            $results.on('click', '.js-searchMore', function() {
                var $searchMore = $(this);
                var primaryLabel = $searchMore.find(".ms-PeoplePicker-searchMorePrimary");
                var originalPrimaryLabelText = primaryLabel.html();
                var searchFieldText = $searchField.val();

                /** Change to searching state. */
                $searchMore.addClass("is-searching");
                primaryLabel.html("Searching for " + searchFieldText);

                /** Attach Spinner */
                if (!spinner) {
                    spinner = new fabric.Spinner($searchMore.get(0));
                } else {
                    spinner.start();
                }

                /** Show all results in Facepile variant */
                if ($peoplePicker.hasClass('ms-PeoplePicker--Facepile')) {
                    setTimeout(function() { $peopleList.children().show(); }, 1500);
                }

                /** Return the original state. */
                setTimeout(function() {
                    $searchMore.removeClass("is-searching");
                    primaryLabel.html(originalPrimaryLabelText);
                    spinner.stop();
                }, 1500);
            });

            /** Remove a result using the action icon. */
            $results.on('click', '.js-resultRemove', function(event) {
                event.stopPropagation();
                $(this).parent(".ms-PeoplePicker-result").remove();
            });

            /** Expand a result if more details are available. */
            $results.on('click', '.js-resultExpand', function(event) {
                event.stopPropagation();
                $(this).parent(".ms-PeoplePicker-result").toggleClass("is-expanded");
            });

            /** Remove a selected person using the action icon. */
            $selectedPeople.on('click', '.js-selectedRemove', function(event) {
                event.stopPropagation();
                $(this).parent(".ms-PeoplePicker-selectedPerson").remove();
                var count = $peoplePicker.find('.ms-PeoplePicker-selectedPerson').length;
                $selectedCount.html(count);
                if ($peoplePicker.find('.ms-PeoplePicker-selectedPerson').length === 0) {
                    $selected.removeClass('is-active');
                }
            });

            var filterResults = function(results, currentSuggestion, currentValueExists) {
                return results.find('.ms-Persona-primaryText').filter(function() {
                    if (currentValueExists) {
                        return $(this).text().toLowerCase() === currentSuggestion;
                    } else {
                        return $(this).text().toLowerCase() !== currentSuggestion;
                    }
                }).parents('.ms-PeoplePicker-peopleListItem');
            };

            /** Search people picker items */
            $peoplePicker.on('keyup', '.ms-PeoplePicker-searchField', function(evt) {
                var suggested = [];
                var newSuggestions = [];
                var $pickerResult = $results.find('.ms-Persona-primaryText');

                $peoplePicker.addClass('is-searching');

                /** Hide members */
                $selected.hide();

                /** Show 5 results */
                $peopleList.children(":lt(5)").show();

                /** Show searchMore button */
                $('.ms-PeoplePicker-searchMore').addClass('is-active');

                /** Get array of suggested people */
                $pickerResult.each(function() { suggested.push($(this).text()); });

                /** Iterate over array to find matches and show matching items */
                for (var i = 0; i < suggested.length; i++) {
                    var currentPersona = suggested[i].toLowerCase();
                    var currentValue = evt.target.value.toLowerCase();
                    var currentSuggestion;

                    if (currentPersona.indexOf(currentValue) > -1) {
                        currentSuggestion = suggested[i].toLowerCase();

                        newSuggestions.push(suggested[i]);

                        filterResults($results, currentSuggestion, true).show();
                    } else {
                        filterResults($results, currentSuggestion, false).hide();
                    }
                }

                /** Show members and hide searchmore when field is empty */
                if ($(this).val() === "") {
                    $peoplePicker.removeClass('is-searching');
                    $selected.show();
                    $('.ms-PeoplePicker-searchMore').removeClass('is-active');
                    $selectedPeople.addClass('ms-u-slideDownIn20');
                    setTimeout(function() { $selectedPeople.removeClass('ms-u-slideDownIn20'); }, 1000);
                    $peopleList.children(":gt(4)").hide();
                }
            });

            /** Show persona card when clicking a persona in the members list */
            $selectedPeople.on('click', '.ms-Persona', function() {
                var selectedName = $(this).find(".ms-Persona-primaryText").html();
                var selectedTitle = $(this).find(".ms-Persona-secondaryText").html();
                var selectedInitials = (function() {
                    var name = selectedName.split(' ');
                    var nameInitials = '';

                    for (var i = 0; i < name.length; i++) {
                        nameInitials += name[i].charAt(0);
                    }

                    return nameInitials.substring(0, 2);
                })();
                var selectedClasses = $(this).find('.ms-Persona-initials').attr('class');
                var selectedImage = $(this).find('.ms-Persona-image').attr('src');
                var $card = $('.ms-PersonaCard');
                var $cardName = $card.find('.ms-Persona-primaryText');
                var $cardTitle = $card.find('.ms-Persona-secondaryText');
                var $cardInitials = $card.find('.ms-Persona-initials');
                var $cardImage = $card.find('.ms-Persona-image');

                /** Close any open persona cards */
                $personaCard.removeClass('is-active');

                /** Add data to persona card */
                $cardName.text(selectedName);
                $cardTitle.text(selectedTitle);
                $cardInitials.text(selectedInitials);
                $cardInitials.removeClass();
                $cardInitials.addClass(selectedClasses);
                $cardImage.attr('src', selectedImage);

                /** Show persona card */
                setTimeout(function() {
                    $personaCard.addClass('is-active');
                    setTimeout(function() { $personaCard.css({ 'animation-name': 'none' }); }, 300);
                }, 100);

                /** Align persona card on md and above screens */
                if ($(window).width() > 480) {
                    var itemPositionTop = $(this).offset().top;
                    var correctedPositionTop = itemPositionTop + 10;

                    $personaCard.css({ 'top': correctedPositionTop, 'left': 0 });
                } else {
                    $personaCard.css({ 'top': 'auto' });
                }
            });

            /** Dismiss persona card when clicking on the document */
            $(document).on('click', function(e) {
                var $memberBtn = $('.ms-PeoplePicker-selectedPerson').find('.ms-Persona');

                if (!$memberBtn.is(e.target) && !$personaCard.is(e.target) && $personaCard.has(e.target).length === 0) {
                    $personaCard.removeClass('is-active');
                    setTimeout(function() { $personaCard.removeAttr('style'); }, 300);
                } else {
                    $personaCard.addClass('is-active');
                }
            });
        });
    };

    /** Resize the search field to match the search box */
    function resizeSearchField($peoplePicker) {
        var $searchBox = $peoplePicker.find('.ms-PeoplePicker-searchBox');

        // Where is the right edge of the search box?
        var searchBoxLeftEdge = $searchBox.position().left;
        var searchBoxWidth = $searchBox.outerWidth();
        var searchBoxRightEdge = searchBoxLeftEdge + searchBoxWidth;

        // Where is the right edge of the last persona component?
        var $lastPersona = $searchBox.find('.ms-PeoplePicker-persona:last');
        var lastPersonaLeftEdge = $lastPersona.offset().left;
        var lastPersonaWidth = $lastPersona.outerWidth();
        var lastPersonaRightEdge = lastPersonaLeftEdge + lastPersonaWidth;

        // Adjust the width of the field to fit the remaining space.
        var newFieldWidth = searchBoxRightEdge - lastPersonaRightEdge - 7;

        // Don't let the field get too tiny.
        if (newFieldWidth < 100) {
            newFieldWidth = "100%";
        }

        // Set the width of the search field
        $peoplePicker.find('.ms-PeoplePicker-searchField').outerWidth(newFieldWidth);
    }
})(jQuery);

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * MessageBanner component
 *
 * A component to display error messages
 *
 */

/**
 * @namespace fabric
 */
var fabric = fabric || {};
/**
 *
 * @param {HTMLElement} container - the target container for an instance of MessageBanner
 * @constructor
 */
fabric.MessageBanner = function(container) {
    this.container = container;
    this.init();
};

fabric.MessageBanner.prototype = (function() {

    var _clipper;
    var _bufferSize;
    var _textContainerMaxWidth = 700;
    var _clientWidth;
    var _textWidth;
    var _initTextWidth;
    var _chevronButton;
    var _errorBanner;
    var _actionButton;
    var _closeButton;
    var _bufferElementsWidth = 88;
    var _bufferElementsWidthSmall = 35;
    var SMALL_BREAK_POINT = 480;

    /**
     * sets styles on resize
     */
    var _onResize = function() {
        _clientWidth = _errorBanner.offsetWidth;
        if (window.innerWidth >= SMALL_BREAK_POINT) {
            _resizeRegular();
        } else {
            _resizeSmall();
        }
    };

    /**
     * resize above 480 pixel breakpoint
     */
    var _resizeRegular = function() {
        if ((_clientWidth - _bufferSize) > _initTextWidth && _initTextWidth < _textContainerMaxWidth) {
            _textWidth = "auto";
            _chevronButton.className = "ms-MessageBanner-expand";
            _collapse();
        } else {
            _textWidth = Math.min((_clientWidth - _bufferSize), _textContainerMaxWidth) + "px";
            if (_chevronButton.className.indexOf("is-visible") === -1) {
                _chevronButton.className += " is-visible";
            }
        }
        _clipper.style.width = _textWidth;
    };

    /**
     * resize below 480 pixel breakpoint
     */
    var _resizeSmall = function() {
        if (_clientWidth - (_bufferElementsWidthSmall + _closeButton.offsetWidth) > _initTextWidth) {
            _textWidth = "auto";
            _collapse();
        } else {
            _textWidth = (_clientWidth - (_bufferElementsWidthSmall + _closeButton.offsetWidth)) + "px";
        }
        _clipper.style.width = _textWidth;
    };
    /**
     * caches elements and values of the component
     */
    var _cacheDOM = function(context) {
        _errorBanner = context.container;
        _clipper = context.container.querySelector('.ms-MessageBanner-clipper');
        _chevronButton = context.container.querySelector('.ms-MessageBanner-expand');
        _actionButton = context.container.querySelector('.ms-MessageBanner-action');
        _bufferSize = _actionButton.offsetWidth + _bufferElementsWidth;
        _closeButton = context.container.querySelector('.ms-MessageBanner-close');
    };

    /**
     * expands component to show full error message
     */
    var _expand = function() {
        var icon = _chevronButton.querySelector('.ms-Icon');
        _errorBanner.className += " is-expanded";
        icon.className = "ms-Icon ms-Icon--chevronsUp";
    };

    /**
     * collapses component to only show truncated message
     */
    var _collapse = function() {
        var icon = _chevronButton.querySelector('.ms-Icon');
        _errorBanner.className = "ms-MessageBanner";
        icon.className = "ms-Icon ms-Icon--chevronsDown";
    };

    var _toggleExpansion = function() {
        if (_errorBanner.className.indexOf("is-expanded") > -1) {
            _collapse();
        } else {
            _expand();
        }
    };

    /**
     * hides banner when close button is clicked
     */
    var _hideBanner = function() {
        if (_errorBanner.className.indexOf("hide") === -1) {
            _errorBanner.className += " hide";
            setTimeout(function() {
                _errorBanner.className = "ms-MessageBanner is-hidden";
            }, 500);
        }
    };

    /**
     * shows banner if the banner is hidden
     */
    var _showBanner = function() {
        _errorBanner.className = "ms-MessageBanner";
    };

    /**
     * sets handlers for resize and button click events
     */
    var _setListeners = function() {
        window.addEventListener('resize', _onResize, false);
        _chevronButton.addEventListener("click", _toggleExpansion, false);
        _closeButton.addEventListener("click", _hideBanner, false);
    };

    /**
     * initializes component
     */
    var init = function() {
        _cacheDOM(this);
        _setListeners();
        _clientWidth = _errorBanner.offsetWidth;
        _initTextWidth = _clipper.offsetWidth;
        _onResize(null);
    };

    return {
        init: init,
        showBanner: _showBanner
    };
}());