var React = require('react');
var Led = require('./../../components/led/led');
var Link = require('react-router').Link;

var system = React.createClass({
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    getInitialState: function () {
        return {
            isOn: false
        };
    },

    toggleState: function () {
        console.log(this.state.isOn);
        this.setState({
            isOn: !this.state.isOn
        });
    },

    render: function () {
        return (
            <div>
                <Led onClick={this.toggleState} color='red' isOn={this.state.isOn}/>
            </div>
        );
    }
});

module.exports = system;