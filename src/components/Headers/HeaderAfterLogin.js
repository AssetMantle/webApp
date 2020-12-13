import React, {useEffect} from "react";
import {withRouter} from "react-router-dom";
import {useHistory} from "react-router-dom";
import {Navbar, Nav, NavDropdown, Button} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {Search} from "../../components/search";
import {NavLink} from 'react-router-dom';
import logo from '../../assets/images/logo.svg'
import profileIcon from "../../assets/images/profile.svg"

const HeaderAfterLogin = () => {
    const history = useHistory();
    const {t} = useTranslation();
    const userTypeToken = localStorage.getItem('mnemonic');
    const userAddress = localStorage.getItem('address');
    const handleRoute = route => () => {
        history.push(route)
    };
    const handleModelRoute = (route) => {
        history.push(`/${route}`);
    };

    const logout = route => () => {
        localStorage.clear();
        history.push('/');
    }
    useEffect(() => {
        const userAddress = localStorage.getItem('address');
        if (userAddress === null) {
            history.push('/Login');
        }
    }, [])
    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand><Nav.Link onClick={handleRoute("/")}>
                    <img src={logo} alt="logo"/>
                </Nav.Link></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="search-section ml-auto mr-auto">
                        <Search/>
                    </Nav>

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
                            <Nav>
                                <NavLink className="nav-link" to="/assets">{t("ASSETS")}</NavLink>
                                <NavLink className="nav-link" to="/identities">{t("IDENTITIES")}</NavLink>
                                <NavLink className="nav-link" to="/orders">{t("ORDERS")}</NavLink>
                                <NavLink className="nav-link" to="/maintainers">{t("MAINTAINERS")}</NavLink>
                                <NavLink className="nav-link" to="/marketplace">{t("MARKET_PLACE")}</NavLink>
                                <NavDropdown title={
                                    <div className="profile-icon">
                                        <p className="address">{userAddress}</p>
                                        <img className="thumbnail-image"
                                             src={profileIcon}
                                             alt="user pic"
                                        />


                                    </div>
                                }

                                             id="basic-nav-dropdown">
                                    <NavDropdown.Item onClick={logout("/")}>{t("LOGOUT")}</NavDropdown.Item>
                                </NavDropdown>

                            </Nav>
                    }
                </Navbar.Collapse>
            </Navbar>
        </>
    )
}


export default withRouter(HeaderAfterLogin);
