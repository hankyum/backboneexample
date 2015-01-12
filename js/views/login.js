define([
    'thorax',
    'hbs!templates/login'
], function(Thorax, template, EditView) {
    var users = {
        "admin": {
            name: "Admin",
            id: "admin",
            privileges: {
                "new": {},
                "edit": {}
            }
        },
        "view": {
            name: "Viewer",
            id: "view",
            privileges: {}
        }
    };

    return Thorax.View.extend({
        name: 'login',
        template: template,
        events: {
            "submit": function(event) {
                event.preventDefault();
                var user = users[this.$("input[name=userName]").val()];
                if (_.isObject(user)) {
                    this.login(user);
                } else {
                    alert("User name/ Password no correct!\r\n Avaliable test users: \r\n1. admin with new edit privileges.\r\n2. view just query.");
                }
            },
            "click #testView": function(event) {
                event.preventDefault();
                this.login(users["view"]);
            },
            "click #testAdmin": function(event) {
                event.preventDefault();
                this.login(users["admin"]);
            }
        },
        login: function(user) {
            $.cookie.json = true;
            $.removeCookie("user");
            $.cookie("user", user);
            document.location.hash = "#newPerson";
        }
    });
});