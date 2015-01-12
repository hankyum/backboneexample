define([
    'thorax',
    'hbs!templates/common/form/select',
    'views/common/form/form-ele'
], function(Thorax, template, Parent) {
    return Parent.extend({
        name: 'common/form/select',
        template: template,
        events: {
            "change": "renderChild"
        },
        renderChild: function(event) {
            if (event) {
                event.preventDefault();
            }
            if (this.model.has("child")) {
                var form = this.parentForm();
                var child = form.find("select[name='" + this.model.get("child") + "']");
                if (child.length > 0) {
                    child.view().updateData();
                }
            }
        },
        beforeRender: function() {},
        initialize: function() {
            this.listenTo(this.model, "change:vals", this.render, this);
        },
        getData: function() {
            var ref = this.model.get("ref");
            if (typeof ref == 'string') {
                var ary = ref.split("\.");
                var refElement = ary[0];
                var refElementProp = ary[1];
                var refEle = this.parentForm().find("select[name=" + refElement + "]");
                if (refEle.view()) {
                    var val = _.find(refEle.view().model.get("vals"),
                        function(v) {
                            if (v == refEle.val()) {
                                return true;
                            } else if (_.has(v, "id") && v.id == refEle.val()) {
                                return true;
                            } 
                        });
                    if (val && _.has(val, refElementProp)) {
                        return val[refElementProp];
                    }
                }
            }
        },
        updateData: function(data) {
            data = data || this.getData();
            var staticData = this.model.get("valsStatic");
            if (staticData && staticData.length > 0 && data) {
                if (!_.contains(_.pluck(data, "name"), _.pluck(staticData, "name"))) {
                    data = staticData.concat(data);
                }
            }
            if (data) {
                this.model.set("vals", data);
            }
        },
        newVal: function() {
            var val = this.formEl().val();
            var data = this.model.get("vals");
            if (_.some(data, function(v) {
                return _.has(v, "id");
            })) {
                val = _.find(data, function(v) {
                    if (v.id == val) {
                        return true;
                    }
                });
            }
            return val;
        },
        render: function() {
            var model = this.model.toJSON();
            this.$el.html(this.template(model));
            this.updateData();
            this.$('.selectpicker').selectpicker();
            if (this.parentForm().view()) {
                this.parentForm().view().formCheck();
            }
            this.renderChild();
            console.log("Render select for " + model.name);
            return this;
        }
    });
});