import React from "react";
import {NavLink, useHistory, withRouter} from "react-router-dom";
import {Button, Nav, Navbar} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import logo from '../../assets/images/logo.svg';
import Darktheme from "../darkmode/Darktheme";

const HeaderBeforeLogin = () => {
    const history = useHistory();
    const {t} = useTranslation();
    const handleRoute = route => () => {
        history.push(route);
    };
    const handleModelRoute = (route) => {
        history.push(`/${route}`);
    };

    return (
        <div className="container login-before">
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand><Nav.Link onClick={handleRoute("/")}>
                    <img src={logo} alt="logo"/>
                </Nav.Link></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto ml-auto">
                    </Nav>

                    <Nav>
                        {/*<Nav.Link onClick={() => handleModelRoute("create")}>Create Keys</Nav.Link>*/}
                        <Nav.Link onClick={() => handleModelRoute("signup")}>{t("SIGN_UP")}</Nav.Link>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/marketplace">{t("MARKET_PLACE")}</NavLink>
                        </li>
                        <div className="button-login-section">
                            <Button variant="primary" className="button-double-border"
                                onClick={handleRoute("/login")}>{t("LOGIN")}</Button>
                        </div>

                        <li className="nav-item flex">
                            <Darktheme/>
                        </li>
                    </Nav>

                </Navbar.Collapse>
            </Navbar>
        </div>
    );
};


export default withRouter(HeaderBeforeLogin);
