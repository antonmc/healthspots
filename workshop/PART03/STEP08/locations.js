/* COPYRIGHT ANTON MCCONVILLE, IBM 2015 */

/* REQUIRES */

var ibmbluemix = require('ibmbluemix');
var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');

/* CUSTOM MODULES */

var kp = require('./kp');
var sentiment = require('./sentiment');

/* INITIALIZE LOGGER */

var log = ibmbluemix.getLogger();

/* INITIALIZATION */

var KP_KEY = process.env.KP_KEY;

var TWITTER_CREDENTIALS;

function initialize() {
    if (process.env.VCAP_SERVICES) {
        var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
        //        TWITTER_CREDENTIALS = vcapServices.twitterinsights.credentials;
    } else {
        log.warn('VCAP_SERVICES environment variable not set');
    }
}

TWITTER_CREDENTIALS = {
    "username": "51d806f2-0b18-49c7-9035-0dff37654d45",
    "password": "Rm4ctTp44n",
    "host": "cdeservice.mybluemix.net",
    "port": 443,
    "url": "https://51d806f2-0b18-49c7-9035-0dff37654d45:Rm4ctTp44n@cdeservice.mybluemix.net"
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

app.get('/facilitiesAndSentiments', function (request, response) {

    var zipcode = request.query.zipcode;

    log.info('Finding facilities and sentiments for: ' + zipcode);

    response.setHeader('Content-Type', 'application/json');

    kp.getLocations(zipcode, KP_KEY, function (locationData) {

        var numberOfLocations = locationData.length - 1;

        log.info('number of locations: ' + locationData.length);

        var negativeResponseCount = 0;
        var positiveResponseCount = 0;

        locationData.forEach(function (item) {

            response.setHeader('Content-Type', 'application/json');

            sentiment.sendSentimentRequest(item.name, 'positive', TWITTER_CREDENTIALS, function (parsedData) {

                if (parsedData !== 'error') {

                    var positiveResponse = JSON.parse(parsedData);

                    locationData[positiveResponseCount].positive = positiveResponse.search.results;

                    positiveResponseCount++;

                    sentiment.sendSentimentRequest(item.name, 'negative', TWITTER_CREDENTIALS, function (negData) {
                        var negativeResponse = JSON.parse(negData);

                        locationData[negativeResponseCount].negative = negativeResponse.search.results;

                        negativeResponseCount++;

                        if (negativeResponseCount === numberOfLocations) {
                            response.end(JSON.stringify({
                                facilities: locationData
                            }));

                            log.info('Data for ' + numberOfLocations + ' from ' + locationData.length + ' possible locations ');
                        }
                    });

                } else {
                    numberOfLocations = numberOfLocations - 1;
                }
            })
        });
    });
});

/* START THE EXPRESS SERVER */

http.createServer(app).listen(app.get('port'), function () {
    log.info('Express server listening on port ' + app.get('port'));
});