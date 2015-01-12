define([
    'thorax',
    'hbs!templates/edit-person',
    'views/common/form/form-helper',
    'models/person'
], function(Thorax, template, FormHelper, FormConfig) {
    return FormHelper.extend({
        name: 'edit-person',
        template: template,
        initialize: function(options) {
            this.model = new Thorax.Model();
        },
        events: {
            /* "click .sub-config-button": function(event) {
                event.preventDefault();
            },
            "click .btn-new-sub": "createSubConfig",
            "click .back-btn": function(event) {
                event.preventDefault();
                this.$el.slideUp();
            }*/
        },
        validator: function() {
            return this.$el.parentsUntil("form").data('bootstrapValidator');
        },
        isValid: function() {
            return this.validator().isValid();
        },
        genateConfigChanges: function() {
            var changes = [];
            _.each(this.formModles, function(m) {
                if (m.get("oldVal") != m.get("val")) {
                    changes.push({
                        "fieldname": m.get("name"),
                        "oldvalue": m.get("oldVal"),
                        "newvalue": m.get("val")
                    })
                }
            })
            _.each(this.subConfigs.subModels, function(v, k) {
                _.each(v, function(m) {
                    if (m.get("oldVal") != m.get("val")) {
                        changes.push({
                            "fieldname": k + "." + m.get("name"),
                            "oldvalue": m.get("oldVal"),
                            "newvalue": m.get("val")
                        })
                    }
                })
            })
            return changes;
        },
        save: function() {
            waitingDialog.show();
            this.applyChanges();
            this.saveSubConfigs();
            var model = this.model;
            var update = {
                configuration: model.toJSON(),
                configchanges: JSON.stringify(this.genateConfigChanges())
            };
            console.log("Update  with content:\r\n" + JSON.stringify(this.genateConfigChanges()));
            $.ajax({
                url: "/person/" + this.model.get("id"),
                type: 'POST',
                data: update,
                success: function(data) {
                    waitingDialog.hide();
                    console.log("Save Response Data: Success ");
                    // + JSON.stringify(data));
                    if (data.result == 'SUCCESS') {
                        model.parse(data.configuration);
                    } else {
                        alert("Change not saved.");
                    }
                }
            });
        },
        create: function() {
            this.applyChanges();
            var newConfig = {
                configuration: this.model.toJSON()
            };
            console.log("Create  with content:\r\n" + JSON.stringify(newConfig));
            waitingDialog.show();
            $.ajax({
                url: "/person",
                type: 'PUT',
                data: newConfig,
                success: function(data) {
                    console.log("Create Response Data: " + JSON.stringify(data));
                    if (data.result == 'SUCCESS') {
                        model.parse(data.configuration);
                    } else {
                        alert("Create failed.");
                    }
                    waitingDialog.hide();
                }
            });
        }
        /*,
        saveSubConfigs: function() {
            this.model.set("subconfigurations", this.subConfigs.collection.toJSON());
        },
        createSubConfig: function() {
            this.subConfigs.newSubConfig(this.model);
        }*/
        ,
        wizard: function() {
            var view = this;
            var wizardEle = $("#config-edit-wizard");
            var topEle = wizardEle.find(".show-on-top");
            var changeList = this.$(this.changeListEl);
            var subEdit = this.$(".subConfigEdit");
            wizardEle.wizard();
            wizardEle.on('actionclicked.fu.wizard', function(evt, data) {
                if (data.step == 3 && data.direction == 'next') {
                    topEle.hide();
                }
                if (data.step == 4 && data.direction == 'previous') {
                    topEle.show();
                }
                if (data.step == 4 && data.direction == 'next') {
                    if (subEdit.html() == '') {
                        evt.preventDefault();
                    }
                }
                if (data.step < 3) {
                    topEle.show();
                }
            });
            wizardEle.on('changed.fu.wizard', function(evt, data) {
                if (data.step <= 3) {
                    topEle.show();
                    changeList.show();
                } else {
                    topEle.hide();
                    changeList.hide();
                }
                if (data.step == 5) {
                    view.$(".btn-next").hide();
                } else {
                    view.$(".btn-next").show();
                }
            });
        }
        /*,
        renderSubConfig: function() {
            var el = this.$(".sub-configs");
            var subConfig = this.model.get("subconfigurations");
            if (subConfig) {
                this.subConfigs.setCollection(new Thorax.Collection(subConfig));
                this.subConfigs.setElement(el).render();
            }
        }*/
        ,
        formCheck: function() {
            if (this.model.has("id")) {
                this.$(".criteria :input").prop("disabled", true);
                this.$(".notEditable :input").prop("disabled", true);
                this.$(":input[name=state]").prop("disabled", true);
            }
        },
        render: function() {
            var view = this;
            this.$el.html(this.template(this.model.toJSON()));
            this.renderConfigs(FormConfig);
            // this.renderSubConfig();
            this.formCheck();

            /*var editBtn = targetEl.find(".save-btn");
            if (editBtn.length > 0) {
                this.enableValidate();
                editBtn.click(function(event) {
                    view.validator().validate();
                    if (view.isValid()) {
                        if (view.model.has("id")) {
                            view.save(event);
                        } else {
                            view.create(event);
                        }
                    } else {
                        alert("Please insure you input valid values!");
                    }
                });
            } else {
                this.$("input").prop("disabled", true);
                this.$("select").prop("disabled", true);
            }
           
            this.listChanges();*/
            this.$("input[type='checkbox']").bootstrapSwitch({
                handleWidth: 16
            });
            this.wizard();
            return this;
        }
    });
});