import React from "react";
import {useTranslation} from "react-i18next";
import searchIcon from "../../assets/images/searchIcon.svg"
import {InputGroup, FormControl} from "react-bootstrap";

const Search = () => {
    const {t} = useTranslation();
    return (
        <InputGroup>
            <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1"><img src={searchIcon} alt="searchIcon"/> </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
                placeholder="Search Assets, Orders"
                aria-label="Username"
                aria-describedby="basic-addon1"
            />
        </InputGroup>
    );
}

export default Search
