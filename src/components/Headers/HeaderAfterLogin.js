import React, {useEffect} from 'react';
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
    // const [identityIDList, setIdentityIDList] = useState(JSON.parse(localStorage.getItem("identityIDList")));

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
    // console.log(idList, "idList");
    // if(identityIDList !== null){
    //     console.log(JSON.parse(localStorage.getItem("identityIDList")), "identityIDList");
    //     setIdentityIDList(JSON.parse(idList));
    // }

    useEffect(() => {

        if(userTypeToken !== null  && window.location.pathname === "/"){
            history.push('/profile');
        }
        if (userTypeToken === null) {
            history.push('/Login');
        }
    },[]);

    const handleAddIdentity = () =>{
        history.push('/identityLogin');
    };

    const changeIdentityHandler = (id) =>{
        localStorage.setItem("identityId", id);
        window.location.reload();
    };

    const dropdownTitle = (
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
                                                    {
                                                        identityIDList.map((id, index) => <p key={index} className="address" onClick={()=>changeIdentityHandler(id)}>{id}</p>)
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
        </>
    );
};


export default withRouter(HeaderAfterLogin);
