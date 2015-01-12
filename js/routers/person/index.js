define([
    'backbone',
    'views/root',
    'views/login',
    'views/edit-person'
], function(Backbone, RootView, Login, EditPerson) {
    return Backbone.Router.extend({
        routes: {
            "": "index",
            "login": "login",
            "persons": "persons",
            "newPerson": "newPerson"
        },
        index: function() {
            $.removeCookie("user");
            if ($.cookie("user")) {
                this.newPerson();
            } else {
                this.login();
            }
        },
        login: function() {
            new Login().setElement(document.body).render();
        },
        persons: function() {
            RootView.getInstance(document.body).setView(new EditPerson()).render();
        },
        newPerson: function() {
            RootView.getInstance(document.body).setView(new EditPerson()).render();
        }
    });

});