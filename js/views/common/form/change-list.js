define([
    'thorax',
    'hbs!templates/common/form/change-list'
], function(Thorax, template) {
    return Thorax.View.extend({
        name: 'common/form/change-list',
        template: template
    });
});