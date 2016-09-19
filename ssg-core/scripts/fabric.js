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