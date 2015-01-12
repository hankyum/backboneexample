define(['handlebars', 'thorax'], function(Handlebars) {

    /**
     * Register a normal handlebars helper
     *
     * Use in any .hbs file via: {{greeting}}
     *
     * View test/helpers/helpers.spec for testing best practices
     *
     */
    // Handlebars.registerHelper('greeting', function() {
    //     return new Handlebars.SafeString('Hello world');
    // });

    /**
     * Register a new block helper that will create and embed a HelperView
     * instance with its template set to the captured block.
     * A helper view is different than a child view. It's context will be that of
     * template in which it is placed.
     *
     * Example usage:
     *
     * In template file:
     *
     * {{#on "incremented"}}{{i}}{{/on}}
     * {{#button trigger="incremented"}}Add again{{/button}}
     *
     * In class of template:
     *
     * events: {
     *   incremented: function() {
     *     ++this.i;
     *   }
     * },
     * initialize: function() {
     *   this.i = 0;
     * }
     *
     * Checkout out test/helpers/view-helpers.spec an example with tests
     *
     */



    Handlebars.registerViewHelper('on', function(eventName, helperView) {
        helperView.parent.on(eventName, function() {
            helperView.render();
        });
    });

    /*
    TODO: need to put currency code in a map
    */
    Handlebars.registerHelper('formatAmount', function(currency, amount) {
        var formatedAmount = new Number(amount);
        var currency;
        switch (currency) {
            case 'USD':
                currency = '&#36;';
                break;
            case 'GBP':
                currency = '&#163;';
                break;
            default:
                currency = '';
        }
        return new Handlebars.SafeString( currency + '' + formatedAmount.toFixed(2));
    });


    Handlebars.registerHelper('date', function(timeStamp) {
        var d = new Date(timeStamp);
        var hour = d.getHours() + 1;
        if(d.getHours() < 10) {
            hour = '0' + d.getHours();
        } 
        var minutes = d.getMinutes();
        if(d.getMinutes() < 10) {
            minutes = '0' + d.getMinutes();
        }
        var seconds = d.getSeconds()
        if(d.getSeconds() < 10) {
            seconds = '0' + d.getSeconds();
        }
        return new Handlebars.SafeString((d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear() 
            + '&nbsp;-&nbsp;' + hour +':'+ minutes + ':' + seconds);
    });

    Handlebars.registerHelper('hasPrivilege', function(priv, options) {
        var hasPrivilege = false;
        $.cookie.json = true;
        if (_.has($.cookie("user").privileges, priv)) {
            hasPrivilege = true;
        }
        return hasPrivilege ? options.fn(this) : options.inverse(this);
    });

    Handlebars.registerHelper('formatFormVal', function(val) {
        if (val === false) {
            val = 'false';
        }
        return val;
    });

    Handlebars.registerHelper("ifCond", function(v1, operator, v2, options) {
        switch (operator) {
            case "==":
                return (v1 == v2) ? options.fn(this) : options.inverse(this);

            case "!=":
                return (v1 != v2) ? options.fn(this) : options.inverse(this);

            case "===":
                return (v1 === v2) ? options.fn(this) : options.inverse(this);

            case "!==":
                return (v1 !== v2) ? options.fn(this) : options.inverse(this);

            case "&&":
                return (v1 && v2) ? options.fn(this) : options.inverse(this);

            case "||":
                return (v1 || v2) ? options.fn(this) : options.inverse(this);

            case "<":
                return (v1 < v2) ? options.fn(this) : options.inverse(this);

            case "<=":
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);

            case ">":
                return (v1 > v2) ? options.fn(this) : options.inverse(this);

            case ">=":
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);

            default:
                return eval("" + v1 + operator + v2) ? options.fn(this) : options.inverse(this);
        }
    });

});
