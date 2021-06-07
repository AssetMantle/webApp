import React, {useState} from "react";
import searchIcon from "../../assets/images/searchIcon.svg";
import {Redirect} from "react-router-dom";
import {InputGroup, FormControl} from "react-bootstrap";


const Search = () => {
    const [redirect, setRedirect] = useState(false);
    const [data, setData] = useState("");

    const submitHandler = (e) => {
        const key = e.target.search.value;
        e.preventDefault();
        setData(key);
        setRedirect(true);
    };
    if (redirect) {
        if (window.location.pathname === "/assets" || window.location.pathname === "/Profile" || window.location.pathname === "/AssetView") {
            return <Redirect to={{pathname: '/SearchAsset', data: {data, currentPath: window.location.pathname}}}/>;
        } else if (window.location.pathname === "/identities" || window.location.pathname === "/IdentityView") {
            return <Redirect to={{pathname: '/SearchIdentity', data: {data, currentPath: window.location.pathname}}}/>;
        } else if (window.location.pathname === "/orders" || window.location.pathname === "/marketplace" || window.location.pathname === "/OrderView") {
            return <Redirect to={{pathname: '/SearchOrder', data: {data, currentPath: window.location.pathname}}}/>;
        } else if (window.location.pathname === "/maintainers" ) {
            return <Redirect to={{pathname: '/SearchMaintainer', data: {data, currentPath: window.location.pathname}}}/>;
        }
        setRedirect(false);
    }

    return (
        <form onSubmit={submitHandler}>
            <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1"><img src={searchIcon} alt="searchIcon"/> </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    placeholder="Search Assets, Orders"
                    aria-label="Username"
                    type="text"
                    name="search"
                />
            </InputGroup>
        </form>
    );
};

export default Search;
