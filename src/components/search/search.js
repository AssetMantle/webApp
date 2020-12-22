import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import searchIcon from "../../assets/images/searchIcon.svg"
import assetsQueryJS from "persistencejs/transaction/assets/query";
import identitiesQueryJS from "persistencejs/transaction/identity/query";
import maintainersQueryJS from "persistencejs/transaction/maintainers/query";
import ordersQueryJS from "persistencejs/transaction/orders/query";
import { Redirect } from "react-router-dom";
import {InputGroup, FormControl} from "react-bootstrap";


const identitiesQuery = new identitiesQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const ordersQuery = new ordersQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const assetsQuery = new assetsQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const maintainersQuery = new maintainersQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)

const Search = () => {
    const {t} = useTranslation();
    const [redirect, setRedirect] = useState(false);
    const [data, setData] = useState("");
    const [searchInput, setSearchInput] = useState("")
    const [showSearch, setShowSearch] = useState(false)
    const endPoints = [ {
        path: 'assets',
    }, {
        path: 'orders',
    }, {
        path: 'identities',
    }, {
        path: 'maintainers',
    }, {
        path: 'marketplace',
    }];

   const submitHandler = (e) => {
       const key = e.target.search.value;
       e.preventDefault();
       setData(key);
       setRedirect(true);
    }
    if(redirect) {
        if (window.location.pathname === "/assets") {
            return <Redirect to={{pathname: '/SearchAsset',  data: {data} }}/>
        }else if (window.location.pathname === "/identities") {
            return <Redirect to={{pathname: '/SearchIdentity',  data: {data} }}/>
        }else if (window.location.pathname === "/orders" || window.location.pathname === "/marketplace") {
            return <Redirect to={{pathname: '/SearchOrder',  data: {data} }}/>
        }else if (window.location.pathname === "/maintainers") {
            return <Redirect to={{pathname: '/SearchMaintainer',  data: {data} }}/>
        }
        setRedirect(false);
    }
    const onSearchChange = (e) =>{
        setSearchInput(e.target.value)
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
                onChange={onSearchChange}
            />
        </InputGroup>
        </form>
    );
}

export default Search
