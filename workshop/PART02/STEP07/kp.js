var ibmbluemix = require('ibmbluemix');
var https = require('https');

log = ibmbluemix.getLogger();

module.exports = {

    getLocations: function (zipcode, key, callback) {

        log.info('Beginning finding facilities for: ' + zipcode);

        var snapshotData = [];

        var options = {
            hostname: 'api.kp.org',
            path: '/v1/locator/facility?zip=' + zipcode,
            method: 'GET',
            headers: {
                'consumer-key': key
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
}