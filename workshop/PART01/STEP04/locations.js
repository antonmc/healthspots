/* COPYRIGHT ANTON MCCONVILLE, IBM 2015 */

/* REQUIRES */

var ibmbluemix = require('ibmbluemix');
var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');

/* INITIALIZE LOGGER */

var log = ibmbluemix.getLogger();

/* INITIALIZATION */

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


function getKPlocations(zipcode, callback) {

    log.info('Beginning finding facilities for: ' + zipcode);

    var snapshotData = [];

    var options = {
        hostname: 'api.kp.org',
        path: '/v1/locator/facility?zip=' + zipcode,
        method: 'GET',
        headers: {
            'consumer-key': 'zRKjW2Sy9vHoX369uJQnUNvUu3x5mnqv'
        }
    };

    var req = https.request(options, function (res) {

        var body = '';

        res.on('data', function (d) {
            body = body + d;
        });

        res.on('end', function () {

            var payload = JSON.parse(body);

            var snapshotData = [];

            var facilities = payload.KPFacilities;

            if (facilities) {

                facilities.forEach(function (facility) {

                    var snapshot = {
                        "lat": facility.loc[1],
                        "lng": facility.loc[0],
                        "name": facility.official_name,
                        "type": facility.facility_type,
                        "positive": 0,
                        "negative": 0
                    };

                    snapshotData.push(snapshot);
                });
            }

            log.info('Wrapping up finding facilities for: ' + zipcode);

            callback(snapshotData);
        });
    });

    req.end();

    req.on('error', function (e) {
        log.error(e);
    });
}

app.get('/facilities', function (request, response) {

    var zipcode = request.query.zipcode;

    log.info('---------------------------------------------');
    log.info('Request to find facilities for: ' + zipcode);

    response.setHeader('Content-Type', 'application/json');

    getKPlocations(zipcode, function (locationData) {
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