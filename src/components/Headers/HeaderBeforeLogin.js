import React , {useEffect} from "react";
import {NavLink, useHistory, withRouter} from "react-router-dom";
import {Button, Nav, Navbar} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import Darktheme from "../darkmode/Darktheme";
import Icon from "../../icons";

const HeaderBeforeLogin = () => {
    const history = useHistory();
    const {t} = useTranslation();
    const handleRoute = route => () => {
        history.push(route);
    };
    const handleModelRoute = (route) => {
        history.push(`/${route}`);
    };
    useEffect(() => {
        const localTheme = window.localStorage.getItem('theme');
        if(localTheme === 'light'){
            if (document.getElementById('root').classList.contains('dark-mode')) {
                document.getElementById('root').classList.add('light-mode');
                document.getElementById('root').classList.remove('dark-mode');
            }
        }
        else{
            if (document.getElementById('root').classList.contains('light-mode')) {
                document.getElementById('root').classList.add('dark-mode');
                document.getElementById('root').classList.remove('light-mode');
            }
        }

    }, []);
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <div className="container login-before">
                <Navbar.Brand><Nav.Link onClick={handleRoute("/marketplace")} className="header-logo">
                </Nav.Link></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav">
                    <Icon viewClass="menu-icon" icon="menu"/>
                </Navbar.Toggle>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto ml-auto">
                    </Nav>

                    <Nav>
                        <Nav.Link onClick={() => handleModelRoute("signup")}>{t("SIGN_UP")}</Nav.Link>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/marketplace">{t("MARKET_PLACE")}</NavLink>
                        </li>
                        <div className="button-login-section">
                            <Button variant="primary" className="button-double-border"
                                onClick={handleRoute("/login")}>{t("LOGIN")}</Button>
                        </div>

                        <li className="nav-item flex">
                            <div className="nav-link">
                                <Darktheme/>
                            </div>
                        </li>
                    </Nav>

                </Navbar.Collapse>
            </div>

        </Navbar>
    );
};


export default withRouter(HeaderBeforeLogin);
