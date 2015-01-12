define([
    'jquery',
    'layout-view',
    'hbs!templates/root'
], function($, LayoutView, rootTemplate) {
    var RootView = LayoutView.extend({
        name: 'root',
        template: rootTemplate
    });

    var instance;
    RootView.getInstance = function(target) {
        if (!instance) {
            instance = new RootView();
            instance.setElement(target || document.body);
        }
        return instance;
    };
    return RootView;
});