/**
 * Close the USB connection when sending data is complete otherwise data gets garbled!!!
 *
 * @type {exports|module.exports}
 * @private
 */
var _ = require('lodash');
var SerialPort = require('serialport');
var redis = require('redis');
var client = client = redis.createClient();
//var Serial = require('./serial');

client.on("connect", function () {
    console.log("Connected to Redis");
});

client.on("error", function (err) {
    console.log("Error " + err);
});

function SerialServiceFactory() {
    var factory = this;

    function SerialService() {
        var self = this;
        console.log('SerialService created');
    }

    SerialService.prototype.listPorts = function (callback) {
        console.log('List all ports');
        SerialPort.list(function (err, ports) {
            if (err) {
                return callback(err);
            }
            callback(null, ports.map(function (port, index) {
                return {nr: index, port: port};
            }));
        });
    };

    SerialService.prototype.setPort = function (port, callback) {
        console.log('Using port ' + port);
        client.set('LmLPort', port, redis.print);
        callback();
    };

    SerialService.prototype.isLEDOn = function (callback) {
        console.log('Checking LED status');
        client.get('LmLPort', function (err, port) {
            if (!port) {
                return callback({code: 400, message: 'Please set the port first'});
            } else {
                // TODO: is port connected?
                // TODO: check status of the light
            }
            callback(err);
        });
    };

    SerialService.prototype.lightLED = function (seconds, callback) {
        console.log('Turn on LED for ' + seconds + ' seconds');
        callback();
    };

    factory.SerialService = SerialService;

    /*
     var port, serial;


     // List available ports
     // Choose a port to connect to
     // give the number of seconds the LED needs to shine.

     SerialPort.list(function (err, ports) {
     port = _.find(ports, function (port) {
     return port.comName === '/dev/cu.usbmodemfa131';
     });
     if (!port) {
     throw new Error('No USB connection');
     } else {
     console.log(port);
     serial = new Serial(port);
     serial.open();
     }
     });

     function write(number) {
     serial.send(number);
     serial.close();
     }

     */
}

module.exports = new SerialServiceFactory();