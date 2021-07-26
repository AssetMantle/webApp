import React, {useEffect, useState} from 'react';
import {withRouter} from "react-router-dom";
import {useHistory} from "react-router-dom";
import {Navbar, Nav, NavDropdown, Button} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {NavLink} from 'react-router-dom';
import logo from '../../assets/images/logo.svg';
import profileIcon from "../../assets/images/profile.svg";
import Icon from '../../icons';
import AddIdentity from '../../actions/forms/identities/AddIdentity';
const HeaderAfterLogin = () => {
    const history = useHistory();
    const {t} = useTranslation();
    const userTypeToken = localStorage.getItem('identityId');
    const [externalComponent, setExternalComponent] = useState("");
    const handleRoute = route => () => {
        history.push(route);
    };
    const handleModelRoute = (route) => {
        history.push(`/${route}`);
    };

    const logout  = () => {
        localStorage.clear();
        history.push('/');
    };

    let identityIDList = JSON.parse(localStorage.getItem("identityIDList"));
    useEffect(() => {
        if(userTypeToken !== null  && window.location.pathname === "/"){
            history.push('/profile');
        }
        if (userTypeToken === null) {
            history.push('/');
        }
    },[]);

    const handleAddIdentity = () => {
        setExternalComponent('identityLogin');
    };

    const removeIdentityHandler = (removeItem) =>{
        if(identityIDList !== null){
            if(identityIDList.length === 1){
                return false;
            }
            else {
                const result = identityIDList.filter(id => id !== removeItem);
                if(result.length === 1){
                    localStorage.setItem("identityId", result[0]);
                }
                localStorage.setItem('identityIDList', JSON.stringify(result));
            }
        }
        window.location.reload();
    };

    const changeIdentityHandler = (id) =>{
        if(localStorage.getItem('identityId') !== id) {
            localStorage.setItem("identityId", id);
            window.location.reload();
        }else {
            return false;
        }
    };

    const dropdownTitle = (
        <div className="dropdown-toggle"
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
    );
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
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/maintainers">{t("MAINTAINERS")}</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/profile">{t("PROFILE")}</NavLink>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <NavDropdown title={dropdownTitle} id="basic-nav-dropdown" className="profile-dropdown">
                                            <div className="profile-dropdown-menu"
                                                aria-labelledby="profile-nav-dropdown">
                                                <div className="address-list">
                                                    { identityIDList !== null ?
                                                        identityIDList.map((id, index) => {
                                                            if(localStorage.getItem('identityId') === id){
                                                                return(
                                                                    <div key={index} className="address-item active">
                                                                        <p className="address" title={id} onClick={()=>changeIdentityHandler(id)}>{id}</p>
                                                                        <span className="cross-icon" onClick={()=> removeIdentityHandler(id)}>
                                                                            <Icon
                                                                                viewClass="cross"
                                                                                icon="cross"/>
                                                                        </span>

                                                                    </div>
                                                                );
                                                            }
                                                            else {
                                                                return(
                                                                    <div key={index} className="address-item">
                                                                        <p className="address" title={id} onClick={()=>changeIdentityHandler(id)}>{id}</p>
                                                                        <span className="cross-icon" onClick={()=> removeIdentityHandler(id)}>
                                                                            <Icon
                                                                                viewClass="cross"
                                                                                icon="cross"/>
                                                                        </span>

                                                                    </div>
                                                                );
                                                            }

                                                        })
                                                        : ""
                                                    }
                                                </div>

                                                <p onClick={handleAddIdentity} className="add-id">Add Identity</p>
                                                <p onClick={logout} className="logout">{t("LOGOUT")}</p>
                                            </div>
                                        </NavDropdown>
                                    </li>

                                </Nav>
                        }
                    </Nav>

                </Navbar.Collapse>
            </Navbar>

            {
                externalComponent === 'identityLogin' ?
                    <AddIdentity setExternalComponent={setExternalComponent} pageName="profile"/> :
                    null
            }
        </>
    );
};


export default withRouter(HeaderAfterLogin);
