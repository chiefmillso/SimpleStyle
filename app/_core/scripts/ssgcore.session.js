/* globals ssgCore,baseComponents,$ */
ssgCore.Session = {};

ssgCore.Session.filter = {

    add: function(filterValue) {
        if (typeof(Storage) !== undefined) {
            sessionStorage.setItem('currentFilter', filterValue);
        }
    },
    get: function() {
        if (typeof(Storage) !== undefined) {
        	return sessionStorage.getItem('currentFilter');
        } else {
            return null;
        }
    },
    remove: function() {
        if (typeof(Storage) !== undefined) {
            sessionStorage.setItem('currentFilter', null);
        }
    }

};

ssgCore.Session.Code = {



};
