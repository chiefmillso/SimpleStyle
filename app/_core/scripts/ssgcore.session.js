/* globals ssgCore,baseComponents,$ */
ssgCore.Session = {};

ssgCore.Session.filter = {

    add: function(filterValue) {
        if (typeof Storage !== undefined) {
            sessionStorage.setItem('currentFilter', filterValue);
        }
    },
    get: function() {
        if (typeof Storage !== undefined) {
            return sessionStorage.getItem('currentFilter');
        } else {
            return null;
        }
    },
    remove: function() {
        if (typeof Storage !== undefined) {
            sessionStorage.setItem('currentFilter', null);
        }
    }

};

ssgCore.Session.frameworks = {
        add: function(frameworkId) {
            if (typeof Storage !== undefined) {
                var key = "[" + frameworkId + "]";
                var frameworks = (sessionStorage.getItem('currentFrameworks') || "").split(';');
                if (frameworks.indexOf(key) === -1) {
                    frameworks.push(key);
                }
                var val = frameworks.join(";");
                sessionStorage.setItem('currentFrameworks', val);
            }
        },
        get: function(frameworkId, defaultValue) {
            if (typeof defaultValue === undefined) {
                defaultValue = false;
            }
            if (typeof Storage !== undefined) {
                var key = "[" + frameworkId + "]";
                var s = sessionStorage.getItem('currentFrameworks');
                if (s === null) {
                    return defaultValue;
                }
                var frameworks = (s || "").split(';');
                return frameworks.indexOf(key) !== -1;
            } else {
                return defaultValue;
            }
        },
        remove: function(frameworkId) {
            if (typeof Storage !== undefined) {
                var key = "[" + frameworkId + "]";
                var frameworks = (sessionStorage.getItem('currentFrameworks') || "").split(';');
                var i = frameworks.indexOf(key);
                if (i !== -1) {
                    frameworks = frameworks.splice(i, 1);
                }
                var val = frameworks.join(";");
                sessionStorage.setItem('currentFrameworks', val);
            }
        }
    },

    ssgCore.Session.uiOptions = {

        add: function(filterValue) {

            if (typeof Storage !== undefined) {
                if (sessionStorage.getItem('uiOptions') === null) {
                    sessionStorage.setItem('uiOptions', '');
                }

                var currentUiOptions = sessionStorage.getItem('uiOptions');

                // Check if current uiOptions are set to isolate
                if (currentUiOptions.indexOf('isolate') !== -1) {
                    sessionStorage.setItem('uiOptions', '');
                    currentUiOptions = '';
                }

                // remove current field value if it can be found
                if (currentUiOptions.indexOf(filterValue) === -1) {
                    currentUiOptions += ' ' + filterValue;
                } else {
                    currentUiOptions = currentUiOptions.replace(filterValue, '');
                }

                currentUiOptions = currentUiOptions.trim();

                sessionStorage.setItem('uiOptions', currentUiOptions);

            }

        },
        get: function() {
            if (typeof Storage !== undefined) {
                return sessionStorage.getItem('uiOptions');
            } else {
                return null;
            }
        },
        remove: function() {
            if (typeof Storage !== undefined) {
                sessionStorage.removeItem('uiOptions');
                sessionStorage.setItem('uiOptions', '');
            }
        }

    };

ssgCore.Session.Code = {

};