var SerialPort = require('serialport').SerialPort;
var openedPort = false;

var Serial = function (port) {
    this.serialPort = new SerialPort(port.comName, {
        baudrate: 9600,
        parser: serialport.parsers.readline('\n')
    }, false);

    this.serialPort.on('open', function (a) {
        console.log('USB connection opened');
        openedPort = true;
    });

    this.serialPort.on('close', function (a) {
        console.log('USB connection closed');
        openedPort = false;
    });

    this.serialPort.on('data', function (data) {
        console.log('Received: ' + data);
    });

    this.open = function () {
        this.serialPort.open(function (err) {
                if (err) {
                    console.log(err);
                    throw new Error('Could not open USB connection');
                }
            }
        )
    };

    this.isOpen = function () {
        return openedPort;
    };

    this.close = function () {
        this.serialPort.close();
    };

    this.write = function (data, callback) {
        console.log('Sending data...');
        var self = this;
        this.serialPort.write(data, function () {
            self.serialPort.drain(callback);
        });
    };

    return this;
};
module.exports = Serial;