define([
    'thorax',
    'hbs!templates/common/form/input',
    'views/common/form/form-ele'
], function(Thorax, template, Parent) {
    return Parent.extend({
        name: 'common/form/input',
        template: template,
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
});