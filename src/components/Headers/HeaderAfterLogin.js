import React, {useState, useEffect} from 'react';
import {withRouter} from "react-router-dom";
import {useHistory} from "react-router-dom";
import {Navbar, Nav, NavDropdown, Button} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {NavLink} from 'react-router-dom';
// import profileIcon from "../../assets/images/profile.svg";
import Icon from '../../icons';
import AddIdentity from '../../containers/forms/identities/AddIdentity';
import Darktheme from "../darkmode/Darktheme";
const HeaderAfterLogin = () => {
    const history = useHistory();
    const {t} = useTranslation();
    const userTypeToken = localStorage.getItem('userName');
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

    let userList = JSON.parse(localStorage.getItem("userList"));
    // useEffect(() => {
    //     if(userTypeToken !== null  && window.location.pathname === "/"){
    //         history.push('/profile');
    //     }
    //     if (userTypeToken === null) {
    //         history.push('/');
    //     }
    // },[]);

    const handleAddIdentity = () => {
        setExternalComponent('identityLogin');
    };

    const removeIdentityHandler = (removeItem) =>{
        if(userList !== null){
            if(userList.length === 1){
                return false;
            }
            else {
                const result = userList.filter(id => id !== removeItem);
                if(result.length === 1){
                    console.log(result, "reasult");
                    const identityList = localStorage.getItem("identityList");
                    const idList = JSON.parse(identityList);
                    for (let i = 0; i <= idList.length; i++) {
                        for(let key in idList[i]) {
                            if(key === result[0]){
                                console.log(idList[i][key]);
                                localStorage.setItem("identityId", idList[i][key]);
                                localStorage.setItem("userName", result[0]);
                                localStorage.setItem('userList', JSON.stringify(result));
                                window.location.reload();
                            }
                        }
                    }

                }

            }
        }
        // window.location.reload();
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
    const changeIdentityHandler = (name) =>{
        const identityList = localStorage.getItem("identityList");
        const idList = JSON.parse(identityList);

        if(localStorage.getItem('userName') !== name) {
            for (let i = 0; i <= idList.length; i++) {
                for(let key in idList[i]) {
                    if(key === name){
                        localStorage.setItem("identityId", idList[i][key]);
                        localStorage.setItem("userName", name);
                        window.location.reload();
                    }
                }
            }

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
                <Icon
                    viewClass="add-user"
                    icon="user"/>
                <p className="address">{userTypeToken}</p>


            </div>
        </div>
    );
    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="login-after container-fluid">
                <Navbar.Brand><Nav.Link onClick={handleRoute("/marketplace")} className="header-logo">
                </Nav.Link></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav-login"/>
                <Navbar.Collapse id="responsive-navbar-nav-login">
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
                                        <NavLink className="nav-link" to="/mint">{t("CREATE_NFT")}</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/assets">{t("ASSETS")}</NavLink>
                                    </li>
                                    {/*<li className="nav-item">*/}
                                    {/*    <NavLink className="nav-link" to="/orders">{t("ORDERS")}</NavLink>*/}
                                    {/*</li>*/}
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/marketplace">{t("MARKET_PLACE")}</NavLink>
                                    </li>
                                    {/*<li className="nav-item">*/}
                                    {/*    <NavLink className="nav-link" to="/maintainers">{t("MAINTAINERS")}</NavLink>*/}
                                    {/*</li>*/}
                                    {/*<li className="nav-item">*/}
                                    {/*    <NavLink className="nav-link" to="/profile">{t("PROFILE")}</NavLink>*/}
                                    {/*</li>*/}
                                    <li className="profile-section">
                                        <NavDropdown title={dropdownTitle} id="basic-nav-dropdown" className="profile-dropdown">
                                            <div className="profile-dropdown-menu"
                                                aria-labelledby="profile-nav-dropdown">
                                                <div className="address-list">
                                                    { userList !== null ?
                                                        userList.map((id, index) => {
                                                            if(localStorage.getItem('userName') === id){
                                                                return(
                                                                    <div key={index} className="address-item active" onClick={handleRoute("/profile")}>
                                                                        <div className="icon-section">
                                                                            <Icon
                                                                                viewClass="user"
                                                                                icon="user"/>
                                                                            <p className="address" >{id}</p>
                                                                        </div>
                                                                        {/*<span className="cross-icon" onClick={()=> removeIdentityHandler(id)}>*/}
                                                                        {/*    <Icon*/}
                                                                        {/*        viewClass="cross"*/}
                                                                        {/*        icon="cross"/>*/}
                                                                        {/*</span>*/}

                                                                    </div>
                                                                );
                                                            }
                                                            else {
                                                                return(
                                                                    <div key={index} className="address-item">
                                                                        <div className="icon-section">
                                                                            <Icon
                                                                                viewClass="user"
                                                                                icon="user"/>
                                                                            <p className="address" title={id} onClick={()=>changeIdentityHandler(id)}>{id}</p>
                                                                        </div>
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

                                                <p onClick={handleAddIdentity} className="add-id">
                                                    <div className="icon-section">
                                                        <Icon
                                                            viewClass="add-user"
                                                            icon="add-user"/>{t("ADD_USER")}
                                                    </div>
                                                </p>
                                                {/*<p  className="add-id">*/}
                                                {/*    <div className="icon-section">*/}
                                                {/*        <Icon*/}
                                                {/*            viewClass="add-user"*/}
                                                {/*            icon="user"/>{t("PROFILE")}*/}
                                                {/*    </div>*/}
                                                {/*</p>*/}
                                                <p onClick={logout} className="logout">
                                                    <div className="icon-section">
                                                        <Icon
                                                            viewClass="logout"
                                                            icon="logout"/>{t("LOGOUT")}
                                                    </div>
                                                </p>
                                            </div>
                                        </NavDropdown>
                                    </li>
                                    <li className="nav-item flex">
                                        <Darktheme/>
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
