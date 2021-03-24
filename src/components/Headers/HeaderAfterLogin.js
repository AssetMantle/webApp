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
        localStorage.removeItem('mnemonic');
        localStorage.removeItem('address');
        localStorage.removeItem('fromID');
        localStorage.removeItem('lastFromID');
        history.push('/');
    }

    useEffect(() => {
        const userAddress = localStorage.getItem('address');
        if(userTypeToken !== null  && window.location.pathname === "/"){
            history.push('/identities');
        }
        if (userAddress === null) {
            history.push('/Login');
        }
    }, [])
    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="login-after">
                <Navbar.Brand><Nav.Link onClick={handleRoute("/identities")}>
                    <img src={logo} alt="logo"/>
                </Nav.Link></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="search-section mr-auto">
                        {window.location.pathname !== "/SearchAsset" && window.location.pathname !== "/SearchIdentity" && window.location.pathname !== "/SearchOrder" & window.location.pathname !== "/SearchMaintainer" ?
                            <Search/>
                        :""
                        }

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
                                            <p className="address">{userAddress}</p>
                                            <img className="thumbnail-image"
                                                 src={profileIcon}
                                                 alt="user pic"
                                            />

                                        </div>
                                    </div>
                                    <div className="dropdown-menu profile-menu"
                                         aria-labelledby="profile-nav-dropdown">
                                        <NavLink className="dropdown-item" to="/identities">{t("IDENTITIES")}</NavLink>
                                        <NavLink className="dropdown-item" to="/maintainers">{t("MAINTAINERS")}</NavLink>
                                        <NavLink className="dropdown-item" to="/Profile">{t("PROFILE")}</NavLink>
                                        <NavDropdown.Item onClick={logout("/")}>{t("LOGOUT")}</NavDropdown.Item>
                                    </div>

                                </li>

                            </Nav>
                    }
                </Navbar.Collapse>
            </Navbar>
        </>
    )
}


export default withRouter(HeaderAfterLogin);
