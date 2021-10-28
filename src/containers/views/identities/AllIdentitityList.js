import React, { useState, useEffect } from "react";
import {queryIdentities} from "persistencejs/build/transaction/identity/query";
import {queryMeta} from "persistencejs/build/transaction/meta/query";
import { useTranslation } from "react-i18next";
import Loader from "../../../components/loader";
import config from "../../../constants/config.json";
import GetProperty from "../../../utilities/Helpers/getProperty";
import FilterHelpers from "../../../utilities/Helpers/filter";
import GetMeta from "../../../utilities/Helpers/getMeta";
import GetID from "../../../utilities/Helpers/getID";
import { useHistory } from "react-router-dom";
import {Button, Dropdown} from 'react-bootstrap';
import { Summary } from "../../../components/summary";
import Sidebar from '../../../components/sidebar/sidebar';
import {IssueIdentity, Nub} from '../../forms/identities';
import {Define} from '../../forms';
import {defineIdentity} from 'persistencejs/build/transaction/identity/define';

const metasQuery = new queryMeta(process.env.REACT_APP_ASSET_MANTLE_API);
const identitiesQuery = new queryIdentities(process.env.REACT_APP_ASSET_MANTLE_API);
const identitiesDefine = new defineIdentity(process.env.REACT_APP_ASSET_MANTLE_API);
const AllIdentityList = React.memo((props) => {
    const PropertyHelper = new GetProperty();
    const FilterHelper = new FilterHelpers();
    const GetMetaHelper = new GetMeta();
    const GetIDHelper = new GetID();
    const { t } = useTranslation();
    let history = useHistory();
    const [loader, setLoader] = useState(true);
    const [filteredIdentitiesList, setFilteredIdentitiesList] = useState([]);
    const [userToken, setUserToken] = useState('');
    const [externalComponent, setExternalComponent] = useState("");
    const [identityId, setIdentityId] = useState("");
    const [identity, setIdentity] = useState([]);

    let userAddress;
    userAddress = props.location.address;
    if(userAddress !== undefined){
        localStorage.setItem('address', userAddress);
    }else {
        userAddress =  localStorage.getItem('address');
    }
    useEffect(() => {
        setUserToken(localStorage.getItem('identityId'));
        const fetchToIdentities = () => {
            const identities = identitiesQuery.queryIdentityWithID("all");
            if (identities) {
                identities.then(function (item) {
                    const data = JSON.parse(item);
                    const dataList = data.result.value.identities.value.list;
                    if (dataList) {
                        const filterIdentities = FilterHelper.FilterIdentitiesByProvisionedAddress(dataList, userAddress);

                        if (filterIdentities.length) {
                            setFilteredIdentitiesList(filterIdentities);
                            filterIdentities.map((identity, index) => {
                                let immutableProperties = "";
                                let mutableProperties = "";
                                if (identity.value.immutables.value.properties.value.propertyList !== null) {
                                    immutableProperties = PropertyHelper.ParseProperties(identity.value.immutables.value.properties.value.propertyList);
                                }
                                if (identity.value.mutables.value.properties.value.propertyList !== null) {
                                    mutableProperties = PropertyHelper.ParseProperties(identity.value.mutables.value.properties.value.propertyList);
                                }
                                let immutableKeys = Object.keys(immutableProperties);
                                let mutableKeys = Object.keys(mutableProperties);
                                GetMetaHelper.AssignMetaValue(immutableKeys, immutableProperties, metasQuery, 'immutable_identityList', index, 'identityUrlId');
                                GetMetaHelper.AssignMetaValue(mutableKeys, mutableProperties, metasQuery, 'mutable_identityList', index, "identityMutableUrlId");
                                setLoader(false);
                            });
                        } else {
                            setLoader(false);
                        }
                    } else {
                        setLoader(false);
                    }
                });
            } else {
                setLoader(false);
            }
        };
        fetchToIdentities();
    }, []);


    const handleAsset = (id) => {
        if (id !== "stake") {
            history.push({
                pathname: '/identity/view',
                state: {
                    identityID: id,
                    currentPath: window.location.pathname,
                    userAddress:userAddress
                }
            }
            );
        }
    };

    const handleModalData = (formName) => {
        setExternalComponent(formName);
        setIdentity(identity);
        setIdentityId(identityId);
    };

    return (
        <div>
            {userToken ?
                <Sidebar/>
                : ""}
            <div className="accountInfo">
                <div className="row">
                    <div className="col-md-9 card-deck">
                        {userToken ?
                            <div className="dropdown-section">
                                <h4>Identities</h4>
                                <Dropdown>
                                    <Dropdown.Toggle id="dropdown-basic">
                                        {t("ACTIONS")}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item
                                            onClick={() => handleModalData("Nub")}>{t("NUB")}</Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={() => handleModalData("DefineIdentity")}>{t("DEFINE_IDENTITY")}
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={() => handleModalData("IssueIdentity")}>{t("ISSUE_IDENTITY")}
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            : ""
                        }
                        <div className="list-container">
                            {loader ?
                                <Loader />
                                : ""
                            }
                            <div className="row card-deck">
                                {filteredIdentitiesList.length ?
                                    filteredIdentitiesList.map((identity, index) => {
                                        let immutableProperties = "";
                                        let mutableProperties = "";
                                        const identityId = GetIDHelper.GetIdentityID(identity);
                                        if (identity.value.immutables.value.properties.value.propertyList !== null) {
                                            immutableProperties = PropertyHelper.ParseProperties(identity.value.immutables.value.properties.value.propertyList);
                                        }
                                        if (identity.value.mutables.value.properties.value.propertyList !== null) {
                                            mutableProperties = PropertyHelper.ParseProperties(identity.value.mutables.value.properties.value.propertyList);
                                        }
                                        let immutableKeys = Object.keys(immutableProperties);
                                        let mutableKeys = Object.keys(mutableProperties);
                                        return (
                                            <div className="col-xl-3 col-lg-4 col-md-6  col-sm-12" key={index}>
                                                <div className="card identity-card">
                                                    <div id={"identityImagUri" + identityId + index} className="image-container">
                                                        <div id={"identityImage" + identityId + index} className="dummy-image image-box">

                                                        </div>
                                                    </div>

                                                    <div className="info-section">
                                                        <div className="list-item">
                                                            <p className="list-item-label">{t("IDENTITY_ID")}:</p>
                                                            <div className="list-item-value id-section">
                                                                <p className="id-string" title={identityId}> {identityId}</p>
                                                            </div>
                                                        </div>

                                                        {immutableKeys !== null ?
                                                            immutableKeys.map((keyName, index1) => {
                                                                if (immutableProperties[keyName] !== "") {
                                                                    if (keyName === config.URI) {
                                                                        let imageElement = document.getElementById("identityImage" + identityId + index);
                                                                        if (typeof (imageElement) != 'undefined' && imageElement != null) {
                                                                            let divd = document.createElement('div');
                                                                            divd.id = `identityUrlId` + index + `${index1}`;
                                                                            divd.className = "assetImage";
                                                                            document.getElementById("identityImagUri" + identityId + index).replaceChild(divd, imageElement);
                                                                        }
                                                                    } else if (keyName === "style") {
                                                                        return (<div key={index + keyName} className="list-item"><p
                                                                            className="list-item-label"></p> <p
                                                                            id={`immutable_identityList` + index + `${index1}`}
                                                                            className="list-item-value"></p></div>);
                                                                    }
                                                                    else if (keyName === "identifier") {
                                                                        return (<div key={index + keyName} className="list-item"><p
                                                                            className="list-item-label">{keyName}: </p> <p
                                                                            id={`immutable_identityList` + index + `${index1}`}
                                                                            className="list-item-value"></p></div>);
                                                                    }
                                                                } else {
                                                                    return (
                                                                        <div key={index + keyName} className="list-item"><p
                                                                            className="list-item-label">{keyName}: </p> <p
                                                                            className="list-item-hash-value">{immutableProperties[keyName]}</p>
                                                                        </div>);
                                                                }
                                                            })
                                                            : ""
                                                        }
                                                        {mutableKeys !== null ?
                                                            mutableKeys.map((keyName, index1) => {
                                                                if (mutableProperties[keyName] !== "") {
                                                                    if (keyName === config.URI) {
                                                                        let imageElement = document.getElementById("identityImage" + identityId + index);
                                                                        if (typeof (imageElement) != 'undefined' && imageElement != null) {
                                                                            let divd = document.createElement('div');
                                                                            divd.id = `identityMutableUrlId` + index + `${index1}`;
                                                                            divd.className = "assetImage";
                                                                            document.getElementById("identityImagUri" + identityId + index).replaceChild(divd, imageElement);
                                                                        }
                                                                    }
                                                                }
                                                            })
                                                            : ""
                                                        }
                                                        <Button variant="primary" className="viewButton" size="sm"
                                                            onClick={() => handleAsset(identityId)}>View</Button>

                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                    : <p className="empty-list">{t("IDENTITIES_NOT_FOUND")}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 summary-section">
                        <Summary />
                    </div>

                </div>
            </div>
            <div>
                {externalComponent === 'Nub' ?
                    <Nub setExternalComponent={setExternalComponent}/> :
                    null
                }
                {externalComponent === 'DefineIdentity' ?
                    <Define setExternalComponent={setExternalComponent} ActionName={identitiesDefine}
                        FormName={'Define Identity'}/> :
                    null
                }
                {externalComponent === 'IssueIdentity' ?

                    <IssueIdentity setExternalComponent={setExternalComponent}/> :
                    null
                }
            </div>
        </div>
    );
});
AllIdentityList.displayName = 'AllIdentityList';
export default AllIdentityList;
