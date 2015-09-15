/* HEALTHSPOTS COPYRIGHT ANTON MCCONVILLE, IBM 2015 */

/* REQUIRES */

var ibmbluemix = require('ibmbluemix');
var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');

/* INITIALIZE LOGGER */

var log = ibmbluemix.getLogger();

/* SET UP EXPRESS */

var app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));

http.createServer(app).listen(app.get('port'), function () {
    log.info('Express server listening on port ' + app.get('port'));
});