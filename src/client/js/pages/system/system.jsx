var React = require('react');

var system = React.createClass({
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    render: function () {
        return <div>System overview</div>;
    }
});

module.exports = system;