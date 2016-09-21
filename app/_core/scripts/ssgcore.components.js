/* globals ssgCore,ssg,$,Handlebars,baseComponents,Prism */

(function() {
    ssgCore = ssgCore || {};
    ssgCore.components = ssgCore.components || {};

    ssgCore.components.cssBuilder = function(data) {

        var folder = [
            { "name": "Office 365", "id": "framework-office-365", "enabled": false },
            { "name": "Office UI Fabric", "id": "framework-fabric", "enabled": false },
            { "name": "Foundation", "id": "framework-foundation", "enabled": false },
            { "name": "Bootstrap", "id": "framework-bootstrap", "enabled": false },
            { "name": "Kendo UI", "id": "framework-kendoui", "enabled": false },
            { "name": "jQuery UI", "id": "framework-jqueryui", "enabled": false }
        ];

        $("#ssg-css").append("<ul><li class=ssg-css-header>Frameworks</li><li class=ssg-css-items><ul></ul></li></ul>");

        for (var i = 0; i < folder.length; i++) {
            var folderName = folder[i].name;
            var id = folder[i].id;
            var elId = "ssg-css-" + id;
            var enabled = ssgCore.Session.frameworks.get(id, folder[i].enabled);
            var checked = enabled ? "checked " : "";
            $('#ssg-css .ssg-css-items > ul').append(
                '<li id=' + elId + ' class=ssg-css-item>' +
                '<label for="' + elId + '-checkbox">' +
                folderName +
                '<input id="' + elId + '-checkbox" type="checkbox" data-link="' + id + '" ' + checked + '>' +
                '</label></li>'
            );
        }

        $("#ssg-css input").each(ssgCore.Events.enableFramework);
    };
})();