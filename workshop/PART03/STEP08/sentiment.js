var ibmbluemix = require('ibmbluemix');
var https = require('https');
log = ibmbluemix.getLogger();

module.exports = {

    buildSentimentQuery: function (term, strain, credentials) {

        var sentiments = [];
        sentiments['positive'] = "%20AND%20sentiment%3Apositive";
        sentiments['negative'] = "%20AND%20sentiment%3Anegative";

        var sentimentURL = "https://" + credentials.username + ":" + credentials.password + "@" + credentials.host + ":443" + "/api/v1/messages/count?q=" + "(" + term + ")" + sentiments[strain];

        return sentimentURL;
    },

    sendSentimentRequest: function (query, mood, credentials, callback) {

        var queryAddress = this.buildSentimentQuery(query, mood, credentials);

        var request = https.request(queryAddress, function (response) {

            var data = '';

            response.on('data', function (d) {
                data += d;
            });

            response.on('end', function () {

                try {
                    callback(data);
                } catch (e) {
                    callback('error');
                    log.warn("Problems finding sentiments for: " + query);
                }
            });
        });

        request.end();

        request.on('error', function (e) {
            log.error("TwitterInsight Query error: " + e);
        });
    }
}