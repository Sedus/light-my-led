/**
 * Close the USB connection when sending data is complete otherwise data gets garbled!!!
 *
 * @type {exports|module.exports}
 * @private
 */
var Promise = require('bluebird');
var SerialPortFactory = require('serialport');
var SerialPort = SerialPortFactory.SerialPort;
var redis = require('redis');

function SerialServiceFactory() {
    var factory = this;
    // Name of the port (needed for connecting)
    var port;
    // Actual connection to the port
    var serialPort;

    function SerialService() {
        // Holds the current status
        this.status = {led: {status: 'unknown'}};

        this.redisClient = redis.createClient();

        this.redisClient.on("connect", function () {
            console.log("Connected to Redis");
        });

        this.redisClient.on("error", function (err) {
            console.log("Error " + err);
        });

        console.log('SerialService created');
    }

    SerialService.prototype.listPorts = function () {
        return new Promise(function (resolve, reject) {
            console.log('List all ports');
            SerialPortFactory.list(function (err, ports) {
                if (err) {
                    reject(err);
                }
                resolve(ports.map(function (port, index) {
                    return {nr: index, port: port};
                }));
            });
        });
    };

    SerialService.prototype.setPort = function (port) {
        var self = this;
        return new Promise(function (resolve, reject) {
            console.log('Set port ' + port);
            self.redisClient.set('light-my-led-port', port, function (err) {
                if (err) {
                    reject(err);
                }
                resolve();
            })
        })
    };

    SerialService.prototype.getStatus = function () {
        var self = this;
        return new Promise(function (resolve) {
            console.log('Retrieving status');
            checkAndSetSerial(self)
                .then(function () {
                    resolve(self.status);
                })
        });
    };

    SerialService.prototype.lightLED = function (seconds) {
        var self = this;
        checkAndSetSerial(self)
            .then(function () {
                console.log('Turn on LED for ' + seconds + ' seconds');
                self.serialPort.write(seconds, function () {
                    self.serialPort.drain(callback);
                });
            })
            .catch(function (err) {
                reject(err);
            })
    };

    function checkAndSetPort(self) {
        return new Promise(function (resolve) {
            self.redisClient.get('light-my-led-port', function (err, port) {
                if (err) {
                    throw err;
                }
                if (!port) {
                    throw {code: 'port_not_set', message: 'No port has been set, please set one first'};
                } else {
                    self.port = port;
                    resolve();
                }
            })
        });
    }

    function checkAndSetSerial(self) {
        return new Promise(function (resolve) {
            checkAndSetPort(self)
                .then(function () {
                    self.serialPort = new SerialPort(self.port, {
                            baudrate: 115200,
                            parser: SerialPortFactory.parsers.readline('\r')
                        },
                        true, // open connection immediately
                        function (err) {
                            if (err) {
                                throw err;
                            }
                        });
                })
                .then(self.initializeSerialPort)
        })
    }

    SerialService.prototype.initializeSerialPort = function () {
        return new Promise(function (resolve) {
            var self = this;
            if (self.serialPort) {
                self.serialPort.on('open', function (err) {
                    console.log('Arduino connection opened ' + self.serialPort.path);
                });

                self.serialPort.on('close', function (err) {
                    console.log('Arduino connection closed');
                });

                self.serialPort.on('error', function (err) {
                    console.log(err);
                    throw 'Error on connection to ' + self.port;
                });

                self.serialPort.on('data', function (data) {
                    console.log('data');
                    //When a new line of text is received from Arduino over USB
                    var tmp;
                    try {
                        tmp = JSON.parse(data.trim());
                    } finally {
                        if (tmp) {
                            self.status = tmp;
                            console.log(self.status);
                        }
                    }
                });
                resolve();
            } else {
                throw {code: 'port_not_set', message: 'No port has been set, please set one first'};
            }
        });
    };

    factory.SerialService = SerialService;
}

module.exports = new SerialServiceFactory();