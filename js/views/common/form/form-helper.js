define([
    'thorax',
    'hbs!templates/common/form/form-helper',
    'views/common/form/input',
    'views/common/form/checkbox',
    'views/common/form/select',
    'views/common/form/change-list'
], function(Thorax, template, Input, Checkbox, Select, ChangeList) {

    var CheckBoxModel = Thorax.Model.extend({
        defaults: {
            vals: [true, false],
            type: 'checkbox'
        }
    });

    var CachedSelectView = Select.extend({
        getData: function(key) {
            key = key || this.model.get("prop");
            if ($("body").data("cacheKey-" + key)) {
                return $("body").data("cacheKey-" + key);
            }
            return [];
        }
    });

    var processData = function(key, data) {
        $("body").data("cacheKey-" + key, data);
    };

    var cacheModles = [];

    return Thorax.View.extend({
        name: 'common/form/form-helper',
        submitBtn: '.save-btn',
        changeListEl: '.change-list',
        template: template,
        createRow: function(con) {
            var row = $("<div class='form-group'><div class='row'/></div>");
            con.append(row);
            row = row.find(".row");
            return row;
        },
        validatorConfig: {},
        formModles: [],
        renderConfigs: function(configs) {
            this.formModles = [];
            this.validatorConfig = {};
            for (var el in configs) {
                var conf = configs[el];
                this.renderFormEl(conf.eles, conf.cols, el);
            }
        },
        renderFormEl: function(configs, eleEachRow, targetEle) {
            var container = this.$(targetEle);
            if (!container || container.length == 0) {
                container = this.$el;
            }
            var i = 0;
            var row = null;
            var view = this;
            for (var k in configs) {
                if (i % eleEachRow === 0) {
                    row = this.createRow(container);
                }
                row.append(this.createFormEleView(configs[k]).render().$el);
                i++;
            }
            _.each(cacheModles, function(m) {
                view.cacheData(m);
            })
        },
        createFormEleView: function(config) {
            var FormView = Input;
            var FormModel = Thorax.Model;
            if (_.has(config, "validators")) {
                this.validatorConfig[config.name] = config;
                _.each(config.validators, function(v, k) {
                    if (!_.has(v, "message")) {
                        if (k == "notEmpty") {
                            v.message = config.label + " can't be empty.";
                        }
                    }
                });
            }
            if (config.type == 'checkbox') {
                FormModel = CheckBoxModel;
                FormView = Checkbox;
            } else if (config.type == 'select') {
                FormView = Select;
                if (config.url) {
                    FormView = CachedSelectView;
                }
                if ($.isArray(config.range)) {
                    var vals = [];
                    for (var v = config.range[0]; v <= config.range[1]; v++) {
                        vals.push(v);
                    }
                    config.vals = vals;
                } else if (typeof config.ref == 'string') {
                    var ary = config.ref.split("\.");
                    var refName = ary[0];
                    var refProp = ary[1];
                    if (this.model) {
                        var modelVal = this.model.get(refName);
                        if (modelVal && _.has(modelVal, refProp)) {
                            config.vals = modelVal[refProp];
                        }
                    }
                }
            }
            var eleModel = new FormModel(config);
            if (this.model && this.model.has(config.name)) {
                var data = this.model.toJSON();
                var val = data[config.name];
                if (val && _.has(val, "id")) {
                    val = val.id;
                }
                eleModel.set("val", val);
                eleModel.set("oldVal", val);
            }
            if (eleModel.has("url")) {
                cacheModles.push(eleModel);
            }
            this.formModles.push(eleModel);
            return new FormView({
                model: eleModel,
                formModel: this.model,
            });
        },
        cacheData: function(model) {
            if (model.get("url")) {
                $.getJSON(model.get("url"), function(data) {
                    console.log("success");
                    console.log("Fetch model :" + model.get("prop"))
                    var vals = null;
                    if ($.isArray(data)) {
                        vals = data;
                    } else {
                        //TODO process data
                        vals = data[model.get("prop")];
                    }
                    processData(model.get("prop"), vals);
                    model.set("vals", vals);
                }).always(function(obj) {
                    // console.log("complete" + JSON.stringify(obj));
                });
            }
        },
        formCheck: function() {},
        validator: function() {
            return this.$el.parentsUntil("form").data('bootstrapValidator');
        },
        isValid: function() {
            return this.validator().isValid();
        },
        enableValidate: function() {
            var view = this;
            this.$el.parentsUntil("form").bootstrapValidator({
                feedbackIcons: {
                    required: 'glyphicon glyphicon-asterisk',
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                submitButtons: view.submitBtn,
                fields: view.validatorConfig
            });
        },
        listChanges: function() {
            if (this.model.has("id")) {
                new ChangeList({
                    collection: new Thorax.Collection(this.formModles)
                }).setElement(this.$(this.changeListEl)).render();
            }
        },
        applyChanges: function() {
            var subEles = this.$(".val-ele");
            $.each(subEles, function(i, el) {
                $(this).view().updateFormModel();
            });
        }
    });
});