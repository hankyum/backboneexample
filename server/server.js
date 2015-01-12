require('express-namespace'); // must come before express()

var path = require('path');
var express = require('express');
var http = require("http");
var server = express();
var port = process.env.PORT || 8000;
var liveReloadPort = process.env.LRPORT || 35729;

module.exports = server;

var serverBase = path.resolve(__dirname, '../');
server.set('serverBase', serverBase);

// very loud! To enable: ENABLE_LOGGING=true grunt
if (process.env.ENABLE_LOGGING) {
    server.use(express.logger('dev'));
}
if (!module.parent) {
    require('connect-livereload')({
        port: liveReloadPort
    });
}
server.use(express.bodyParser());
server.use(express.methodOverride());
require('./static')(server); // Must be required before all other routes

var paymentAdmin = "/paymentadmin";
function optConfig(req) {
    var proxyUrl = req.url;
    if (req.path == paymentAdmin) {
        proxyUrl = req.param("url");
    } 
    var opts = {
        host: "localhost",
        port: "8080",
        path: "/" + proxyUrl,
        method: req.method,
        headers: {
            
        }
    }
    return opts;
}

function forwardRequest(req, rep) {
    var bodyStr = JSON.stringify(req.body);
    var opts = optConfig(req);
    if (req.method == 'POST' || req.method == 'PUT') {
        opts.headers['Content-Length'] = Buffer.byteLength(bodyStr);
    }
    console.log('Request OPTIONS: ' + JSON.stringify(opts));
    var forwardReq = http.request(opts, function(res) {
        
        console.log('Http Response STATUS: ' + res.statusCode);
        console.log('Http Response HEADERS: ' + JSON.stringify(res.headers));
        
        res.setEncoding('utf8');
        var output = '';
        res.on('data', function(chunk) {
            output += chunk;
        });
        res.on('end', function() {
            rep.send(JSON.parse(output));
        });
    });
    if (req.method == 'POST' || req.method == 'PUT') {
        console.log("Post Body: " + bodyStr);
        forwardReq.write(bodyStr);
    }
    forwardReq.end();
}

server.get(paymentAdmin, forwardRequest);
server.post(paymentAdmin, forwardRequest);
server.put(paymentAdmin, forwardRequest);

/**
 * While developing your server, a convenient way to prevent having to restart
 * the server is to use nodemon, `npm install nodemon -g`. The following line
 * allows this file to act as a standalone server for such purposes, while also
 * acting as middleware for the grunt-connect task
 */
if (!module.parent) {
    server.listen(port, function() {
        console.log("Express server listening on port " + port);
    });
}
