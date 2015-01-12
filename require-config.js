/**
 * This is the main entry point for requirejs in this application. This file is
 * used as the second stop in the require.config chain by the following
 * initial require.config calls:
 *
 * - tasks/requirejs.js, used by grunt-contrib-requirejs for production builds
 * - test/index.html used by mocha in the browser and mocha_phantomjs
 * - test/main.karma.js used by the karma test runner
 * - public/index.html used by you while you develop your app
 *
 * In all cases, this file is the __second__ link of the requirejs configuration
 * chain, which is why it does not have a `baseUrl`. The job of this file
 * is to set up paths shared by all consumers of requirejs in this app.
 *
 * When running tests, test/main.js is the next stop, where more paths are
 * defined that are test specific
 *
 */

/**
 * If using karma, change the base path to /base/ which is where karma's built
 * in server serves files from. The file must be included in the files karma
 * is being told to serve in order for requirejs to pick it up. To include
 * and additional file add the file or glob a directory where the file exists
 * in the karma configuration files array. Make sure include is set to false.
 * We don't want to include the file on the page b/c requirejs will take of that
 * and ensure async happens correctly.
 */

var pathPrefix;
if (window.__karma__) {
    pathPrefix = '/base/';
} else {
    pathPrefix = '../';
}

var defaultPaths = {
    'coffee-script': pathPrefix + 'bower_components/coffee-script/index',
    "bootstrapvalidator": pathPrefix + 'bower_components/bootstrapvalidator/dist/js/bootstrapValidator',
    'jquery-cookie': pathPrefix + 'bower_components/jquery-cookie/jquery.cookie',
    'cs': pathPrefix + 'bower_components/require-cs/cs',
    'text': pathPrefix + 'bower_components/text/text',
    'hbs': pathPrefix + 'bower_components/requirejs-hbs/hbs',
    'localstorage': pathPrefix + 'bower_components/backbone.localStorage/backbone.localStorage',
    'wait': 'wait'
};

function generatePath(component, hasDist) {
    var replace = "{component}";
    var template = pathPrefix + 'bower_components/' + replace + (hasDist ? '/dist/js/' : '/') + replace;
    var path = template.replace(new RegExp(replace, 'g'), component);
    return path;
}

function generatePathes(config, hasDist) {
    for (var k in config) {
        var v = config[k];
        if (typeof v == 'string') {
            defaultPaths[v] = generatePath(v, hasDist);
        }
    }
}

//With dist path
generatePathes([
    'bootstrap',
    'fuelux',
    'moment',
    'bootstrap-switch',
    'bootstrap-select'
], true);
//Don't have dist path
generatePathes([
    'underscore',
    'handlebars',
    'backbone',
    'thorax',
    'jquery',
    'jquery-ui',
    'moment'
], false);

require.config({
    deps: ['main'],
    paths: defaultPaths,
    shim: {
        'handlebars': {
            exports: 'Handlebars',
            deps: ['jquery', 'underscore', 'jquery-cookie']
        },
        'backbone': {
            exports: 'Backbone',
            deps: ['jquery', 'underscore']
        },
        'thorax': {
            exports: 'Thorax',
            deps: ['handlebars', 'backbone']
        },
        'localstorage': {
            deps: ['backbone']
        },
        'underscore': {
            exports: '_'
        },
        'jquery-ui': ['jquery'],
        'jquery-cookie': ['jquery'],
        'bootstrap': ['jquery'],
        'bootstrap-switch': ['jquery'],
        'bootstrapvalidator': ['jquery', 'bootstrap'],
        'bootstrap-select': ['jquery'],
        'fuelux': ['jquery', 'bootstrap', 'moment'],
        'wait': ['jquery']
    }
});