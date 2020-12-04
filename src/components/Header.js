import React, {useEffect, useState} from "react";
import {withRouter} from "react-router-dom";
import {useHistory} from "react-router-dom";
import {Navbar, Nav, NavDropdown, Button, Modal} from "react-bootstrap";
import { useTranslation } from "react-i18next";

const Header = () => {
    const history = useHistory();
    const { t } = useTranslation();

    const userTypeToken = localStorage.getItem('mnemonic');
    const userAddress = localStorage.getItem('address');
    const [externalComponent, setExternalComponent] = useState("");
    const handleRoute = route => () => {
        history.push(route)
    };
    const handleModelRoute = (route) => {
        history.push(`/${route}`);
    };
    const handleClose = () => {
        setShow(false)
    };
    const logout = route => () => {
        localStorage.clear();
        history.push('/');
    }
    useEffect(() => {
        const userAddress = localStorage.getItem('address');
        if (userAddress === null) {
            history.push('/LoginAction');
        }
    }, [])
    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand><Nav.Link onClick={handleRoute("/")}>{t("TITLE")}</Nav.Link></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto ml-auto">
                        <Nav.Link>{t("MAIN_SITE")}</Nav.Link>
                        <Nav.Link>{t("EXPLORER")}</Nav.Link>
                        <Nav.Link>{t("DOCS")}</Nav.Link>
                        <Nav.Link>{t("DASHBOARD")}</Nav.Link>
                        <Nav.Link>{t("CONTACT_US")}</Nav.Link>
                    </Nav>

                    {
                        userTypeToken == null ?
                            <Nav>
                                <Nav.Link onClick={() => handleModelRoute("SignUp")}>{t("SIGNUP")}</Nav.Link>
                                <div className="button-login-section">
                                <Button variant="primary" className="button-double-border" onClick={handleRoute("/LoginAction")}>{t("LOGIN")}</Button>
                                </div>

                            </Nav>
                            :
                            <Nav>
                                <NavDropdown className="address" title={userAddress} id="basic-nav-dropdown">
                                    <NavDropdown.Item onClick={logout("/")}>{t("LOGOUT")}</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                    }
                </Navbar.Collapse>
            </Navbar>
        </>
    )
}


export default withRouter(Header);
