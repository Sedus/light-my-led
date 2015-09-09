var React = require('react');

var home = React.createClass({
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    render: function () {
        return <div>
            <p>Home</p>
        </div>;
    }
});

module.exports = home;