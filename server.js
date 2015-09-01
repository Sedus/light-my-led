var restify = require('restify'),
    SerialService = require('./lib/serial-service').SerialService,
    service = new SerialService();

/**
 * List all available TTY ports
 */
function retrievePorts(req, res, next) {
    service.listPorts(function (err, ports) {
        if (!err) {
            res.json(200, ports);
        }
        next(err);
    });
}

/**
 *  Set the port to use
 */
function usePort(req, res, next) {
    var port = req.body.port;
    service.listPorts(function (err, ports) {
        if (err) {
            res.send(500, err);
        } else if (ports.length - 1 < port) {
            res.send(500, 'Unknown port number');
        } else {
            var portName = ports[port].port.comName;
            service.setPort(portName, function (err) {
                if (!err) {
                    res.send(200, 'Using port: ' + portName);
                } else {
                    res.send(500, err);
                }
            })
        }
    });
}

function isLEDOn(req, res, next) {
    service.isLEDOn(function (err, status) {
        if (err) {
            res.send(400, err);
        } else {
            res.send(200, 'The LED is currently ' + status);
        }
        return next();
    });
}

function light(req, res, next) {
    var seconds = req.params.seconds;
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
server.get('/light', isLEDOn);
server.post('/light/:seconds', light);

server.listen(8081, function () {
    console.log('%s listening at %s', server.name, server.url);
});