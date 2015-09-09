var React = require('react');
var Router = require('react-router');
var Bootstrap = require('react-bootstrap');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
var Grid = Bootstrap.Grid;
var Row = Bootstrap.Row;
var Col = Bootstrap.Col;
var home = require('./pages/home/home');
var system = require('./pages/system/system');

var App = React.createClass({
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    render: function () {
        return (
            <Grid >
                <Row>
                    <Col>
                        <h1>Light my LED</h1>
                        <RouteHandler/>
                    </Col>
                </Row>
            </Grid>
        );
    }
});

var routes = <Route handler={App}>
    <DefaultRoute name="home" handler={home}/>
    <Route name="system" path="/system" handler={system}/>
    <NotFoundRoute handler={home}/>
</Route>;

Router.run(routes, Router.HashLocation, (Root) => {
    React.render(<Root/>, document.body);
});