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
            self.openSerial(self)
                .return(self.status);
        });
    };

    SerialService.prototype.lightLED = function (seconds) {
        var self = this;
        this.openSerial()
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

    SerialService.prototype.openSerial = function () {
        var self = this;
        return new Promise(function (resolve) {
            checkAndSetPort(self)
                .then(function () {
                    if (!self.serialPort || !self.serialPort.isOpen()) {
                        return createSerialPort(self.port)
                            .then(function (serialPort) {
                                self.serialPort = serialPort;
                            })
                    }
                })
                .then(function(a) {
                    initializeSerialPort(self.serialPort)
                })
                .catch(function (err) {
                    console.error(err);
                })
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

    function createSerialPort(port) {
        return new Promise(function (resolve) {
            var serialPort = new SerialPort(port, {
                    baudrate: 115200,
                    parser: SerialPortFactory.parsers.readline('\r')
                },
                true, // open connection immediately
                function (err) {
                    if (err) {
                        throw err;
                    }
                    resolve(serialPort);
                });
        });
    }

    function initializeSerialPort(serialPort) {
        return new Promise(function (resolve) {
            if (serialPort) {
                serialPort.on('open', function (err) {
                    console.log('Arduino connection opened ' + self.serialPort.path);
                });

                serialPort.on('close', function (err) {
                    console.log('Arduino connection closed');
                });

                serialPort.on('error', function (err) {
                    console.log(err);
                    throw 'Error on connection to ' + self.port;
                });

                serialPort.on('data', function (data) {
                    console.log('data');
                    //When a new line of text is received from Arduino over USB
                    var tmp;
                    try {
                        tmp = JSON.parse(data.trim());
                    } finally {
                        if (tmp) {
                            // TODO: emit event
                            //self.status = tmp;
                            console.log(self.status);
                        }
                    }
                });
                resolve();
            } else {
                throw 'No port has been set, please set one first';
            }
        });
    }

    factory.SerialService = SerialService;
}

module.exports = new SerialServiceFactory();
