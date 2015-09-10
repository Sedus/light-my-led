var React = require('react');

var Router = require('react-router'),
    Route = Router.Route,
    RouteHandler = Router.RouteHandler,
    DefaultRoute = Router.DefaultRoute,
    NotFoundRoute = Router.NotFoundRoute;

var Bootstrap = require('react-bootstrap'),
    Grid = Bootstrap.Grid,
    Row = Bootstrap.Row,
    Col = Bootstrap.Col;

var home = require('./pages/home/home');
var system = require('./pages/system/system');
var Header = require('./components/header/header');

var App = React.createClass({
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    render: function () {
        return (
            <div>
                <Header/>
                <Grid >
                    <Row>
                        <Col>
                            <RouteHandler/>
                        </Col>
                    </Row>
                </Grid>
            </div>
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