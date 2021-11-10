import React, {useState} from "react";
import {Button, DropdownButton, Dropdown, FormControl, InputGroup} from "react-bootstrap";
import {useDispatch} from "react-redux";
import * as search from "../../../../store/actions/search";
import * as filterOrders from "../../../../store/actions/filterOrders";
import Icon from "../../../../icons";
import {useTranslation} from "react-i18next";
const Search = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    // const searchResult = useSelector((state) => state.search.searchResult);
    // console.log(searchResult, "searchResult");
    // base64url.decode(order['totalData'][key])
    const [dropDownValue, setDropdownValue] = useState('all');
    const changeHandler=(evt)=>{
        dispatch(search.fetchSearchResult(evt.target.value));
    };

    const clearSearch=()=>{
        dispatch(search.fetchSearchResult(''));
        document.getElementById('searchField').value='';
    };

    const handleDropdown = (value) =>{
        dispatch(filterOrders.fetchFilterOrders(value));
        setDropdownValue(value);
    };

    return (
        <div className="search-section mt-3">
            <InputGroup>
                <FormControl
                    placeholder="Search by name"
                    aria-label="Search"
                    id="searchField"
                    onChange={changeHandler}
                />
                <div className="clear-button-section">
                    <Button variant="outline-secondary" className="m-0" id="button-addon2" onClick={clearSearch}>
                        <Icon viewClass="arrow-icon" icon="cross"/>
                    </Button>
                </div>
            </InputGroup>
            <DropdownButton
                variant="outline-secondary"
                title={dropDownValue}
                className="hidden"
                id="input-group-dropdown-2"
                align="end"
            >
                <Dropdown.Item
                    value="all"onClick={()=>handleDropdown("all")}>{t('All')}</Dropdown.Item>
                <Dropdown.Item
                    value="arts"onClick={()=>handleDropdown("arts")}>{t('ARTS')}</Dropdown.Item>
                <Dropdown.Item value="virtual" onClick={()=>handleDropdown("virtual")}>{t('VIRTUAL_CARDS')}</Dropdown.Item>
                <Dropdown.Item value="3d" onClick={()=>handleDropdown("3d")}>{t('3D')}</Dropdown.Item>
                <Dropdown.Item value="music" onClick={()=>handleDropdown("music")}>{t('MUSIC')}</Dropdown.Item>
                <Dropdown.Item value="collectibles" onClick={()=>handleDropdown("collectibles")}>{t('COLLECTIBLES')}</Dropdown.Item>
            </DropdownButton>
        </div>
    );
};

export default Search;
