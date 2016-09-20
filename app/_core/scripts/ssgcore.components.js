/* globals ssgCore,ssg,$,Handlebars,baseComponents,Prism */



ssgCore.components.cssBuilder = function(data) {

    var folder = [{ "name": "Office 365" }];

    for (var i = 0; i < folder.length; i++) {

        $('#ssg-css').append(
            '<ul><li id=ssg-' + folder[i].name + ' class=ssg-css-header>' +
            folder[i].name +
            '</li><ul id=ssg-' + folder[i].name + '-items class=ssg-css-items></ul></ul>'
        );
    }
};