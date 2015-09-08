var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var Home = React.createClass({
    render: function () {
        return <p>Landingpage 2</p>;
    }
});

var App = React.createClass({
    render: function () {
        return (
            <div>
                <h1>Light my LED</h1>
                <RouteHandler/>
            </div>
        );
    }
});

var routes = <Route handler={App}>
    <Route name="home" path="/" handler={Home}/>
</Route>;

Router.run(routes, function (Root, state) {
    React.render(<Root/>, document.getElementById('wrapper'));
});