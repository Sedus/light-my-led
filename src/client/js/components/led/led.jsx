var React = require('react');

var led = React.createClass({

    propTypes: {
        color: React.PropTypes.string,
        isOn: React.PropTypes.bool.isRequired,
        onClick: React.PropTypes.func,
        name: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {
            isOn: false
        };
    },

    getImageName: function () {
        return '/images/' + this.props.color + '-' + (this.props.isOn ? 'on' : 'off') + '.png';
    },

    render: function () {
        return (
            <div>
                <span>{this.props.name}</span>
                <img
                    src={this.getImageName()}
                    onClick={this.props.onClick}
                    alt="alt"
                    className="img-circle img-responsive" />
            </div>
        );
    }
});

module.exports = led;