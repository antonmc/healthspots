/* COPYRIGHT ANTON MCCONVILLE, IBM 2015 */

/* REQUIRES */

var ibmbluemix = require('ibmbluemix');
var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');

/* CUSTOM MODULES */

var kp = require('./kp');

/* INITIALIZE LOGGER */

var log = ibmbluemix.getLogger();

/* INITIALIZATION */

var KP_KEY = process.env.KP_KEY;

function initialize() {
    if (process.env.VCAP_SERVICES) {
        var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
    } else {
        log.warn('VCAP_SERVICES environment variable not set');
    }
}

/* SET UP EXPRESS */

var app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));

/* SET UP PATHS */

app.get('/', function (request, response) {
    response.sendfile('index.html');
})

/* FECTH KP FACILITY DATA */

app.get('/callback', function (request, response) {});


app.get('/facilities', function (request, response) {

    var zipcode = request.query.zipcode;

    log.info('---------------------------------------------');
    log.info('Request to find facilities for: ' + zipcode);

    response.setHeader('Content-Type', 'application/json');

    kp.getLocations(zipcode, KP_KEY, function (locationData) {
        response.end(JSON.stringify({
            facilities: locationData
        }));
        log.info('---------------------------------------------');
    });
});


/* START THE EXPRESS SERVER */

http.createServer(app).listen(app.get('port'), function () {
    log.info('Express server listening on port ' + app.get('port'));
});