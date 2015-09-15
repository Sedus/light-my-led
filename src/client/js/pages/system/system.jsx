var React = require('react');

var Link = require('react-router').Link;

var Bootstrap = require('react-bootstrap'),
    Row = Bootstrap.Row,
    Col = Bootstrap.Col;

var Led = require('./../../components/led/led');
var SystemStore = require('./../../stores/SystemStore');
var AppDispatcher = require('./../../dispatchers/appDispatcher');

function getAllComponents() {
    return SystemStore.getAllComponents();
}

var system = React.createClass({
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    getInitialState: function () {
        return {
            isOn: false,
            components: getAllComponents()
        };
    },

    componentDidMount: function () {
        SystemStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        SystemStore.removeChangeListener(this._onChange);
    },

    _onChange: function () {
        this.setState(getAllComponents());
    },

    toggleState: function (component) {
        AppDispatcher.dispatch({
            eventName: 'toggleState',
            component: component
        });
    },

    render: function () {
        return (
            <div>
                {this.state.components.map(function (component, i) {
                    return (
                        <Row key={component.name}>
                            <Col>
                                <Led
                                    name={component.name}
                                    onClick={this.toggleState.bind(this, component)}
                                    color={component.color}
                                    isOn={component.isOn}/>
                            </Col>
                        </Row>
                    );
                }, this)
                }
            </div>
        );
    }
});

module.exports = system;