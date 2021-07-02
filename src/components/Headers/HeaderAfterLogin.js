import React, {useEffect} from "react";
import {withRouter} from "react-router-dom";
import {useHistory} from "react-router-dom";
import {Navbar, Nav, NavDropdown, Button} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {NavLink} from 'react-router-dom';
import logo from '../../assets/images/logo.svg';
import profileIcon from "../../assets/images/profile.svg";
const HeaderAfterLogin = () => {
    const history = useHistory();
    const {t} = useTranslation();
    const userTypeToken = localStorage.getItem('identityId');
    const userAddress = localStorage.getItem('address');

    const handleRoute = route => () => {
        history.push(route);
    };
    const handleModelRoute = (route) => {
        history.push(`/${route}`);
    };

    const logout  = () => {
        console.log(userAddress,'userAddress', userTypeToken, "raju");
        localStorage.removeItem('address');
        localStorage.removeItem('encryptedMnemonic');
        localStorage.removeItem('fromID');
        localStorage.removeItem('lastFromID');
        localStorage.removeItem('identityId');
        localStorage.removeItem('keplerAddress');
        history.push('/');
    };

    useEffect(() => {
        if(userTypeToken !== null  && window.location.pathname === "/"){
            history.push('/profile');
        }
        if (userTypeToken === null) {
            history.push('/Login');
        }
    }, []);
    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="login-after">
                <Navbar.Brand><Nav.Link onClick={handleRoute("/profile")}>
                    <img src={logo} alt="logo"/>
                </Nav.Link></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="search-section ml-auto">


                        {
                            userTypeToken == null ?
                                <Nav>
                                    <Nav.Link onClick={() => handleModelRoute("SignUp")}>{t("SIGNUP")}</Nav.Link>
                                    <div className="button-login-section">
                                        <Button variant="primary" className="button-double-border"
                                            onClick={handleRoute("/Login")}>{t("LOGIN")}</Button>
                                    </div>

                                </Nav>
                                :
                                <Nav className="nav-items">
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/assets">{t("ASSETS")}</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/orders">{t("ORDERS")}</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/marketplace">{t("MARKET_PLACE")}</NavLink>
                                    </li>
                                    <li className="nav-item dropdown profile">
                                        <div className="nav-link dropdown-toggle"
                                            id="profile-nav-dropdown"
                                            role="button" data-toggle="dropdown" aria-haspopup="true"
                                            aria-expanded="false">
                                            <div className="profile-icon">
                                                <p className="address">{userTypeToken}</p>
                                                <img className="thumbnail-image"
                                                    src={profileIcon}
                                                    alt="user pic"
                                                />

                                            </div>
                                        </div>
                                        <div className="dropdown-menu profile-menu"
                                            aria-labelledby="profile-nav-dropdown">
                                            {/* <NavLink className="dropdown-item" to="/identities">{t("IDENTITIES")}</NavLink> */}
                                            <NavLink className="dropdown-item" to="/maintainers">{t("MAINTAINERS")}</NavLink>
                                            <NavLink className="dropdown-item" to="/profile">{t("PROFILE")}</NavLink>
                                            <NavDropdown.Item onClick={logout}>{t("LOGOUT")}</NavDropdown.Item>
                                        </div>

                                    </li>

                                </Nav>
                        }
                    </Nav>

                </Navbar.Collapse>
            </Navbar>
        </>
    );
};


export default withRouter(HeaderAfterLogin);
