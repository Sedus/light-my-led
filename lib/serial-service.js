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

    SerialService.prototype.setPort = function (portnr) {
        var self = this;
        return new Promise(function (resolve, reject) {
            self.usePort(portnr)
                .then(function () {
                    self.openSerial()
                        .then(function () {
                            resolve(self.port);
                        })
                });
        });
    };

    SerialService.prototype.usePort = function (portnr) {
        var self = this;
        return new Promise(function (resolve, reject) {
            console.log('Set portnr: ' + portnr);
            self.listPorts()
                .then(function (ports) {
                    if (ports.length - 1 < portnr) {
                        throw 'Unknown port number';
                    }
                    return ports;
                })
                .then(function (ports) {
                    var portName = ports[portnr].port.comName;
                    self.redisClient.set('light-my-led-port', portName, function (err) {
                        if (err) {
                            throw err;
                        }
                        console.log('Set port: ' + portName);
                    });
                })
                .then(resolve)
                .catch(reject);
        });
    };

    SerialService.prototype.getStatus = function () {
        var self = this;
        return new Promise(function (resolve) {
            resolve(self.status);
        });
    };

    SerialService.prototype.lightLED = function (seconds) {
        var self = this;
        return new Promise(function (resolve, reject) {
            console.log('Turn on LED for ' + seconds + ' seconds');
            self.serialPort.write(seconds + '\n', function (err, results) {
                self.serialPort.drain();
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    };

    SerialService.prototype.openSerial = function () {
        var self = this;
        return new Promise(function (resolve) {
            return self.checkAndSetPort(self)
                .then(function () {
                    console.log('Checking serialPort');
                    if (!self.serialPort || !self.serialPort.isOpen()) {
                        return self.createSerialPort(self.port)
                            .then(function (serialPort) {
                                self.serialPort = serialPort;
                            })
                    }
                })
                .then(function () {
                    return self.initializeSerialPort(self.serialPort)
                        .bind(self)
                        .then(function () {
                            self.serialPort.open();
                        }
                    )
                }).then(function () {
                    resolve();
                })
        })
    };

    SerialService.prototype.checkAndSetPort = function () {
        var self = this;
        return new Promise(function (resolve) {
            console.log('Checking port');
            self.redisClient.get('light-my-led-port', function (err, port) {
                if (err) {
                    throw err;
                }
                if (!port) {
                    throw {code: 'port_not_set', message: 'No port has been set, please set one first'};
                } else {
                    if (self.port !== port) {
                        console.log('Port changed to: ' + port);
                        self.port = port;
                    }
                    resolve();
                }
            })
        });
    };

    SerialService.prototype.createSerialPort = function (port) {
        return new Promise(function (resolve) {
            console.log('Creating new serialPort');
            var serialPort = new SerialPort(port, {
                    baudrate: 115200,
                    parser: SerialPortFactory.parsers.readline('\n')
                },
                true // open connection immediately
            );

            resolve(serialPort);
        });
    };

    SerialService.prototype.initializeSerialPort = function (serialPort) {
        var self = this;
        return new Promise(function (resolve, reject) {
            if (serialPort) {
                console.log('Setting event listeners on serialPort');

                serialPort.on('close', function (err) {
                    console.log('Connection closed');
                });

                serialPort.on('error', function (err) {
                    console.log(err);
                    throw 'Error on connection to ' + serialPort.path;
                });

                serialPort.on('data', function (data) {
                    var newStatus;
                    if(data.length < 10){
                        console.log(data);
                    }
                    try {
                        newStatus = JSON.parse(data.trim());
                    } catch(err) {
                        console.log(err);
                    } finally {
                        if (newStatus) {
                            // TODO: emit event
                            self.status = newStatus;
                        }
                    }
                });

                resolve();
            } else {
                reject('No port has been set, please set one first');
            }
        });
    };

    factory.SerialService = SerialService;
}

module.exports = new SerialServiceFactory();
