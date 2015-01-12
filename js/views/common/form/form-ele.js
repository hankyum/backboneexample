define([
    'thorax'
], function(Thorax) {
    return Thorax.View.extend({
        name: 'common/form/form-ele',
        formModel: null,
        events: {
            "change .val-ele": 'updateEvent'
        },
        updateEvent: function(event) {
            event.preventDefault();
            var val = this.newVal();
            var oldVal = this.modelVal();
            console.log(this.model.get("name") + " val changed from " + JSON.stringify(this.modelVal()) + " to " + JSON.stringify(val));
            this.model.set("val", val);
            this.updateFormModel(val);
        },
        updateFormModel: function(val) {
            val = val || this.newVal();
            var modelName = this.model.get("name");
            if (this.formModel) {
                this.formModel.set(modelName, val);
            }
        },
        formCheck: function() {},
        hasChanged: function() {
            return this.model.get("oldVal") != this.model.get("val");
        },
        formEl: function() {
            return this.$(".val-ele");
        },
        parentForm: function() {
            return this.$el.parentsUntil("form");
        },
        isCheckbox: function() {
            return this.model.get("type") == 'checkbox';
        },
        modelVal: function() {
            return this.model.get("val");
        },
        newVal: function() {
            return this.formEl().val();
        }
    });
});