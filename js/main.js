require([
    'jquery',
    'backbone',
    'views/root',
    'routers/person/index',
    'helpers',
    'jquery-ui', 
    'jquery-cookie',
    'bootstrap',
    'fuelux',
    'bootstrap-switch',
    'bootstrap-select',
    'bootstrapvalidator',
    'wait'
], function($, Backbone, RootView, Router) {
    $(function() {
        Backbone.history.start({
            pushState: false,
            root: 'persons',
            silent: true
        });

        // RootView may use link or url helpers which
        // depend on Backbone history being setup
        // so need to wait to loadUrl() (which will)
        // actually execute the route
        RootView.getInstance(document.body);

        // Initialize your routers here
        new Router();

        // This will trigger your routers to start
        Backbone.history.loadUrl();
    });
});