define([
    'thorax',
    'hbs!templates/common/form/checkbox',
    'views/common/form/form-ele'
], function(Thorax, template, Parent) {
    return Parent.extend({
        name: 'common/form/input',
        template: template,
        updateStat: function() {
            var conf = this.model.toJSON();
            if (this.model.has("val") && conf.val == conf.vals[0]) {
                this.formEl().prop("checked", true);
            }
        },
        newVal: function() {
            if (this.formEl().is(":checked")) {
                return this.model.get("vals")[0];
            }
            return this.model.get("vals")[1];
        },
        render: function() {
            var view = this;
            this.$el.html(this.template(this.model.toJSON()));
            this.updateStat();
            this.$(':input').on('switchChange.bootstrapSwitch', function(event, state) {
                view.updateEvent(event);
            });
            return this;
        }
    });
});