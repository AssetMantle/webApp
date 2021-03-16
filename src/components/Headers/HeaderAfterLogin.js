import React, {useEffect, useState} from "react";
import {withRouter} from "react-router-dom";
import {useHistory} from "react-router-dom";
import {Navbar, Nav, NavDropdown, Button} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {Search} from "../../components/search";
import {NavLink} from 'react-router-dom';
import logo from '../../assets/images/logo.svg'
import profileIcon from "../../assets/images/profile.svg"
import Icon from "../../icons";
const HeaderAfterLogin = () => {
    const history = useHistory();
    const {t} = useTranslation();
    const [userName, setuserName] = useState(false);
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
        history.push('/marketplace');
    }

    useEffect(() => {
        const name = localStorage.getItem('name');
        setuserName(name);
        const userAddress = localStorage.getItem('address');
        if(userTypeToken !== null  && window.location.pathname === "/"){
            history.push('/marketplace');
        }
        if (userAddress === null) {
            history.push('/Login');
        }
    }, [])
    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="login-after container">
                <Navbar.Brand><Nav.Link onClick={handleRoute("/marketplace")}>
                    <img src={logo} alt="logo"/>
                </Nav.Link></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav">
                    {/*<Nav className="search-section mr-auto">*/}
                    {/*    {window.location.pathname !== "/SearchAsset" && window.location.pathname !== "/SearchIdentity" && window.location.pathname !== "/SearchOrder" & window.location.pathname !== "/SearchMaintainer" ?*/}
                    {/*        <Search/>*/}
                    {/*    :""*/}
                    {/*    }*/}

                    {/*</Nav>*/}

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
                            <>
                            <Nav className="nav-items mr-auto">
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/marketplace">{t("MARKET_PLACE")}</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/assets">Collections</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/orders">{t("ORDERS")}</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/faq">{t("FAQ")}</NavLink>
                                </li>

                            </Nav>
                            <Nav className="nav-items ml-auto">
                                <li className="nav-item dropdown profile">
                                    <div className="nav-link dropdown-toggle"
                                         id="profile-nav-dropdown"
                                         role="button" data-toggle="dropdown" aria-haspopup="true"
                                         aria-expanded="false">
                                        <div className="profile-icon profile-navlink">
                                            <Icon viewClass="arrow-icon" icon="profile"/>
                                        </div>
                                    </div>
                                    <div className="dropdown-menu profile-menu"
                                         aria-labelledby="profile-nav-dropdown">
                                        {/*<NavLink className="dropdown-item" to="/identities">{t("IDENTITIES")}</NavLink>*/}
                                        {/*<NavLink className="dropdown-item" to="/maintainers">{t("MAINTAINERS")}</NavLink>*/}
                                        <li className="dropdown-item" >@{userName}</li>
                                        <NavDropdown.Item onClick={logout("/")}>{t("LOGOUT")}</NavDropdown.Item>
                                    </div>

                                </li>

                            </Nav>
                            </>
                    }
                </Navbar.Collapse>
            </Navbar>
        </>
    )
}


export default withRouter(HeaderAfterLogin);
