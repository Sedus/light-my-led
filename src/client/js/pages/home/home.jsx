var React = require('react');
var Link = require('react-router').Link;

var home = React.createClass({
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    render: function () {
        return (
            <div>
                <h1>Welcome to Light my LED</h1>

                <p>
                    This project is a demonstration on how to interact with an Arduino using a webapplication. The Arduino has 2 LED lights
                    connected. One light will go on when data from the serial connection is received. The other LED will go on for a
                    period of time when the Arduino receives the command to let it shine.
                </p>

                <p>
                    Furthermore, every second, the Arduino will send a status message to the Raspberry Pi, so the Pi knows the state of the LED
                    light at all times. It doesn't have to ask for it, it will just receive it.
                </p>

                <p>About this webapplication:</p>
                <ol>
                    <li>It is written in ReactJS</li>
                    <li>It uses Gulp as a build tool</li>
                    <li>It is served by Reactify</li>
                    <li>It uses a websocket to update the status on screen</li>
                </ol>

                <p>About the API</p>
                <ol>
                    <li>It is written in NodeJS</li>
                    <li>It runs from a Raspberry Pi model B</li>
                    <li>It uses Reactify to serve the API and the static client</li>
                    <li>It is using a serial USB connection to communicate with the Arduino</li>
                </ol>
            </div>);
    }
});

module.exports = home;