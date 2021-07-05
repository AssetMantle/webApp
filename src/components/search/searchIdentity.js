import React, {useState, useEffect} from "react";
import {queryMeta} from "persistencejs/build/transaction/meta/query";
import {useTranslation} from "react-i18next";
import Sidebar from "../sidebar/sidebar";
import {Summary} from "../summary";
import {queryIdentities} from "persistencejs/build/transaction/identity/query";
import Copy from "../copy";
import {useHistory} from "react-router-dom";
import Icon from "../../icons";
import GetProperty from "../../utilities/Helpers/getProperty";
import GetMeta from "../../utilities/Helpers/getMeta";
import GetID from "../../utilities/Helpers/getID";

const identitiesQuery = new queryIdentities(process.env.REACT_APP_ASSET_MANTLE_API);
const metasQuery = new queryMeta(process.env.REACT_APP_ASSET_MANTLE_API);

const SearchIdentity = React.memo((props) => {
    const PropertyHelper = new GetProperty();
    const GetMetaHelper = new GetMeta();
    const GetIDHelper = new GetID();
    const {t} = useTranslation();
    let history = useHistory();
    const [filteredIdentitiesList, setFilteredIdentitiesList] = useState([]);
    useEffect(() => {
        if (props.location.data !== undefined) {
            const identities = identitiesQuery.queryIdentityWithID(props.location.data.data);
            if (identities) {
                identities.then(function (item) {
                    const data = JSON.parse(item);
                    const dataList = data.result.value.identities.value.list;
                    if (dataList.length) {
                        setFilteredIdentitiesList(dataList);
                        dataList.map((identity, index) => {
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
                            GetMetaHelper.AssignMetaValue(immutableKeys, immutableProperties, metasQuery, 'immutable_identityList_search', index);
                            GetMetaHelper.AssignMetaValue(mutableKeys, mutableProperties, metasQuery, 'mutable_identityList_search', index);
                        });
                    }
                });
            }
        }
    }, []);

    return (
        <div className="content-section">
            <Sidebar/>
            <div className="accountInfo">
                <div className="row">
                    <div className="col-md-9 card-deck">
                        <div className="dropdown-section">
                            <h4>Search Results
                                : {props.location.data !== undefined ? props.location.data.data : ""}</h4>
                            <p className="back-arrow" onClick={() => history.push(props.location.data.currentPath)}>
                                <Icon viewClass="arrow-icon" icon="arrow"/>Back</p>
                        </div>
                        <div className="list-container">
                            <div className="row card-deck">
                                {filteredIdentitiesList.length ?
                                    filteredIdentitiesList.map((identity, index) => {
                                        let immutableProperties = "";
                                        let mutableProperties = "";
                                        let provisionedAddressList = "";
                                        let unProvisionedAddressList = "";
                                        const identityId = GetIDHelper.GetIdentityID(identity);
                                        if (identity.value.immutables.value.properties.value.propertyList !== null) {
                                            immutableProperties = PropertyHelper.ParseProperties(identity.value.immutables.value.properties.value.propertyList);
                                        }
                                        if (identity.value.mutables.value.properties.value.propertyList !== null) {
                                            mutableProperties = PropertyHelper.ParseProperties(identity.value.mutables.value.properties.value.propertyList);
                                        }
                                        if (identity.value.provisionedAddressList !== null) {
                                            provisionedAddressList = identity.value.provisionedAddressList;
                                        }
                                        if (identity.value.provisionedAddressList !== null) {
                                            unProvisionedAddressList = identity.value.unprovisionedAddressList;
                                        }
                                        let immutableKeys = Object.keys(immutableProperties);
                                        let mutableKeys = Object.keys(mutableProperties);
                                        return (
                                            <div className="col-xl-3 col-lg-4 col-md-6  col-sm-12" key={index}>
                                                <div className="card">
                                                    <div className="info-section">
                                                        <div className="list-item">
                                                            <p className="list-item-label">{t("IDENTITY_ID")}:</p>
                                                            <div className="list-item-value id-section">
                                                                <div className="flex">
                                                                    <p className="id-string" title={identityId}> {identityId}</p>
                                                                </div>
                                                            </div>
                                                            <Copy
                                                                id={identityId}/>
                                                        </div>


                                                        <p className="sub-title">{t("IMMUTABLES")}</p>
                                                        {immutableKeys !== null ?
                                                            immutableKeys.map((keyName, index1) => {
                                                                if (immutableProperties[keyName] !== "") {
                                                                    return (
                                                                        <div key={index + keyName} className="list-item"><p
                                                                            className="list-item-label">{keyName} </p>: <p
                                                                            id={`immutable_identityList_search` + index + index1}
                                                                            className="list-item-value"></p></div>);
                                                                } else {
                                                                    return (
                                                                        <div key={index + keyName} className="list-item"><p
                                                                            className="list-item-label">{keyName} </p>: <p
                                                                            className="list-item-hash-value">{immutableProperties[keyName]}</p>
                                                                        </div>);
                                                                }
                                                            })
                                                            : ""
                                                        }
                                                        <p className="sub-title">{t("MUTABLES")}</p>
                                                        {mutableKeys !== null ?
                                                            mutableKeys.map((keyName, index1) => {
                                                                if (mutableProperties[keyName] !== "") {
                                                                    return (
                                                                        <div key={index + keyName} className="list-item"><p
                                                                            className="list-item-label">{keyName} </p>: <p
                                                                            id={`mutable_identityList_search` + index + index1}
                                                                            className="list-item-value"></p></div>);
                                                                } else {
                                                                    return (
                                                                        <div key={index + keyName} className="list-item">
                                                                            <p>{keyName} </p>: <p
                                                                                className="list-item-hash-value">{mutableProperties[keyName]}</p>
                                                                        </div>);
                                                                }
                                                            })
                                                            : ""
                                                        }
                                                        <p className="sub-title">provisionedAddressList</p>
                                                        {provisionedAddressList !== null && provisionedAddressList !== "" ?
                                                            provisionedAddressList.map((provisionedAddress, addressKey) => {
                                                                return (<p key={addressKey}>{provisionedAddress}</p>);
                                                            })
                                                            : <p>Empty</p>
                                                        }
                                                        <p className="sub-title">UnProvisionedAddressList</p>
                                                        {unProvisionedAddressList !== null && unProvisionedAddressList !== "" ?
                                                            unProvisionedAddressList.map((unprovisionedAddress, unprovisionedAddressKey) => {
                                                                return (
                                                                    <p key={unprovisionedAddressKey}>{unprovisionedAddress}</p>);
                                                            })
                                                            : <p>Empty</p>
                                                        }
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
                        <Summary/>
                    </div>
                </div>
            </div>
        </div>

    );
});
SearchIdentity.displayName = 'SearchIdentity';
export default SearchIdentity;
