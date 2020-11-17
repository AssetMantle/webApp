import React from "react";
import {withRouter} from "react-router-dom";
import {useHistory} from "react-router-dom";
import {Navbar, Nav, NavDropdown} from "react-bootstrap";

const Header = () => {
    const history = useHistory();
    const userTypeToken = localStorage.getItem('mnemonic');
    const userAddress = localStorage.getItem('address');
    const handleRoute = route => () => {
        history.push(route)
    };
    const logout = route => () => {
        localStorage.clear();
        history.push('/');
    }
    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand><Nav.Link onClick={handleRoute("/")}>Asset Mantle</Nav.Link></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link>Mainsite</Nav.Link>
                        <Nav.Link>Explorer</Nav.Link>
                        <Nav.Link>Docs</Nav.Link>
                        <Nav.Link>Dashboard</Nav.Link>
                    </Nav>

                    {
                        userTypeToken == null ?
                            <Nav>
                                <Nav.Link>ContactUs</Nav.Link>
                                <Nav.Link onClick={handleRoute("/LoginAction")}>Login</Nav.Link>

                            </Nav>
                            :
                            <Nav>
                                <Nav.Link>Contact Us</Nav.Link>
                                <NavDropdown className="address" title={userAddress} id="basic-nav-dropdown">
                                    <NavDropdown.Item onClick={logout("/")}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                    }
                </Navbar.Collapse>
            </Navbar>

        </>
    )
}


export default withRouter(Header);
