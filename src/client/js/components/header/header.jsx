var React = require('react');

var Bootstrap = require('react-bootstrap'),
    Navbar = Bootstrap.Navbar,
    Nav = Bootstrap.Nav,
    NavItem = Bootstrap.NavItem,
    NavDropdown = Bootstrap.NavDropdown,
    MenuItem = Bootstrap.MenuItem,
    Link = Bootstrap.Link;

var RouterBootstrap = require('react-router-bootstrap'),
    NavItemLink = RouterBootstrap.NavItemLink;

var Header = React.createClass({

    render: function () {
        return (
            <Navbar brand='Light my LED'>
                <Nav>
                    <NavItemLink to='home'>Home</NavItemLink>
                    <NavItemLink to='system'>System</NavItemLink>
                </Nav>
            </Navbar>
        );
    }
});

module.exports = Header;