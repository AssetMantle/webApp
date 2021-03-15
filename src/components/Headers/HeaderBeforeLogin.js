import React, {useEffect} from "react";
import {NavLink, withRouter} from "react-router-dom";
import {useHistory} from "react-router-dom";
import {Navbar, Nav, NavDropdown, Button} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import logo from '../../assets/images/logo.svg'
import Icon from "../../icons";

const HeaderBeforeLogin = () => {
    const history = useHistory();
    const {t} = useTranslation();
    const handleRoute = route => () => {
        history.push(route)
    };
    const handleModelRoute = (route) => {
        history.push(`/${route}`);
    };
    //
    // useEffect(() => {
    //     const userAddress = localStorage.getItem('address');
    //     if (userAddress === null) {
    //         history.push('/Login');
    //     }
    // }, [])
    return (
        <div className="container login-before">
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand><Nav.Link onClick={handleRoute("/marketplace")}>
                    <img src={logo} alt="logo"/>
                </Nav.Link></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <NavLink className="nav-link" to="/marketplace">{t("MARKET_PLACE")}</NavLink>
                        <NavLink className="nav-link" to="/faq">{t("FAQ")}</NavLink>
                        {/*<Nav.Link>{t("DOCS")}</Nav.Link>*/}
                        {/*<Nav.Link>{t("DASHBOARD")}</Nav.Link>*/}
                        {/*<Nav.Link>{t("CONTACT_US")}</Nav.Link>*/}
                    </Nav>

                    <Nav>
                        <div className="button-login-section profile-navlink">
                            <p onClick={handleRoute("/Login")}> <Icon viewClass="arrow-icon" icon="profile"/> </p>
                        </div>
                    </Nav>

                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}


export default withRouter(HeaderBeforeLogin);
