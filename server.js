var restify = require('restify'),
    SerialService = require('./lib/serial-service').SerialService,
    service = new SerialService();

/**
 * List all available TTY ports
 */
function retrievePorts(req, res, next) {
    service.listPorts()
        .then(function (ports) {
            res.json(200, ports);
            next();
        })
        .catch(function (err) {
            next(err);
        });
}

/**
 *  Set the port to use
 */
function usePort(req, res, next) {
    var portnr = req.body.port;
    service.setPort(portnr)
        .then(function (portName) {
            res.send(200, 'Using port: ' + portName);
            next();
        })
        .catch(function (err) {
            next(err);
        })
}

function status(req, res, next) {
    service.getStatus()
        .then(function (ledStatus) {
            res.send(200, ledStatus);
            next();
        })
        .catch(function (err) {
            next(err);
        });
}

function light(req, res, next) {
    var seconds = req.body.seconds;
    service.lightLED(seconds, function (err) {
        if (err) {
            return next({message: err});
        } else {
            res.send(200, 'LED will shine for ' + seconds + ' seconds');
            return next();
        }
    });
}

var server = restify.createServer();
server.use(restify.bodyParser());

server.get('/ports', retrievePorts);
server.put('/port', usePort);
server.get('/status', status);
server.post('/light', light);

server.get(/.*/, restify.serveStatic({
    directory: './static',
    default: 'index.html'
}));

server.listen(8081, function () {
    console.log('%s listening at %s', server.name, server.url);
});