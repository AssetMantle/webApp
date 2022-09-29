import React, {useEffect, useState} from "react";
import {queryMeta} from "mantlejs/build/transaction/meta/query";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import Icon from "../../../icons";
import GetProperty from "../../../utilities/Helpers/getProperty";
import GetMeta from "../../../utilities/Helpers/getMeta";
import config from "../../../constants/config.json";
import GetID from "../../../utilities/Helpers/getID";
import Copy from "../../../components/copy";
import {Button, Dropdown} from "react-bootstrap";
import {queryIdentities} from "mantlejs/build/transaction/identity/query";
import {IssueIdentity, Nub, Provision, UnProvision} from "../../forms/identities";
import Loader from "../../../components/loader";
import {Define} from "../../forms";
import {defineIdentity} from "mantlejs/build/transaction/identity/define";

const identitiesDefine = new defineIdentity(process.env.REACT_APP_ASSET_MANTLE_API);
const metasQuery = new queryMeta(process.env.REACT_APP_ASSET_MANTLE_API);
const identitiesQuery = new queryIdentities(process.env.REACT_APP_ASSET_MANTLE_API);
const IdentityView = React.memo((props) => {
    const PropertyHelper = new GetProperty();
    const GetMetaHelper = new GetMeta();
    const GetIDHelper = new GetID();
    const {t} = useTranslation();
    let history = useHistory();
    const [loader, setLoader] = useState(true);
    const [externalComponent, setExternalComponent] = useState("");
    const [identityId, setIdentityId] = useState("");
    const [identity, setIdentity] = useState([]);
    const [filteredIdentitiesList, setFilteredIdentitiesList] = useState([]);
    useEffect(() => {
        if (props.location.state !== undefined) {
            const identities = identitiesQuery.queryIdentityWithID(props.location.state.identityID);
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
                            GetMetaHelper.AssignMetaValue(immutableKeys, immutableProperties, metasQuery, 'immutable_identityList_search', index, "identityViewUrlId");
                            GetMetaHelper.AssignMetaValue(mutableKeys, mutableProperties, metasQuery, 'mutable_identityList_search', index, "identityMutableViewUrlId");
                            setLoader(false);
                        });
                    }
                });
            }
        }
    }, []);

    const handleModalData = (formName, identityId, identity) => {
        setExternalComponent(formName);
        setIdentity(identity);
        setIdentityId(identityId);
    };
    const handleBack = () => {
        history.push({
            pathname: props.location.state.currentPath,
            address: props.location.state.userAddress
        });
    };
    return (
        <div>
            {loader ?
                <Loader/>
                : ""
            }
            <div className="accountInfo">
                <div className="row">

                    <div className="col-md-9 card-deck">
                        <div className="dropdown-section">

                            <p className="back-arrow" onClick={handleBack}>
                                <Icon viewClass="arrow-icon" icon="arrow"/> Back</p>
                            <Dropdown>
                                <Dropdown.Toggle id="dropdown-basic">
                                    {t("ACTIONS")}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleModalData("Nub")}>{t("NUB")}</Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={() => handleModalData("DefineIdentity")}>{t("DEFINE_IDENTITY")}
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={() => handleModalData("IssueIdentity")}>{t("ISSUE_IDENTITY")}
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
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
                                if (identity.value.unprovisionedAddressList !== null) {
                                    unProvisionedAddressList = identity.value.unprovisionedAddressList;
                                }

                                let immutableKeys = Object.keys(immutableProperties);
                                let mutableKeys = Object.keys(mutableProperties);
                                return (

                                    <div className="list-container view-container" key={index}>
                                        <div className="row card-deck card-height">
                                            <div className="row">
                                                <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                                                    {immutableKeys !== null ?
                                                        immutableKeys.map((keyName, index1) => {
                                                            if (immutableProperties[keyName] !== "") {
                                                                if (keyName === config.URI) {
                                                                    return (
                                                                        <div className="dummy-image image-sectiont"
                                                                            key={index1}>
                                                                            <div
                                                                                id={`identityViewUrlId` + index + `${index1}`}>

                                                                            </div>
                                                                        </div>
                                                                    );

                                                                }
                                                            }
                                                        })
                                                        : ""
                                                    }
                                                    {mutableKeys !== null ?
                                                        mutableKeys.map((keyName, index1) => {
                                                            if (mutableProperties[keyName] !== "") {
                                                                if (keyName === config.URI) {
                                                                    return (
                                                                        <div className="dummy-image image-sectiont"
                                                                            key={index1}>
                                                                            <div
                                                                                id={`identityMutableViewUrlId` + index + `${index1}`}>

                                                                            </div>
                                                                        </div>
                                                                    );

                                                                }
                                                            }
                                                        })
                                                        : ""
                                                    }
                                                    <div className="property-actions">
                                                        <Button variant="primary" size="sm"
                                                            onClick={() => handleModalData("Provision", identityId)}>{t("PROVISION")}</Button>
                                                        <Button variant="primary" size="sm"
                                                            onClick={() => handleModalData("UnProvision", identityId, identity)}>{t("UN_PROVISION")}</Button>
                                                    </div>

                                                </div>
                                                <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12 asset-data">
                                                    <div className="row">
                                                        <div
                                                            className="col-xl-6 col-lg-6 col-md-12">
                                                            <div className="list-item">
                                                                <p className="list-item-label">{t("IDENTITY_ID")}</p>
                                                                <div className="list-item-value id-section">
                                                                    <div className="flex">
                                                                        <p className="id-string"
                                                                            title={identityId}> {identityId}</p>
                                                                    </div>
                                                                </div>
                                                                <Copy
                                                                    id={identityId}/>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row property-section">
                                                        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                                            <p className="sub-title">{t("IMMUTABLES")}</p>
                                                            {immutableKeys !== null ?
                                                                immutableKeys.map((keyName, index1) => {
                                                                    if (immutableProperties[keyName] !== "" && keyName !== 'style' && keyName !== config.URI) {
                                                                        return (
                                                                            <div key={index + keyName}
                                                                                className="list-item"><p
                                                                                    className="list-item-label">{keyName} </p>
                                                                                <p
                                                                                    id={`immutable_identityList_search` + index + index1}
                                                                                    className="list-item-value"></p>
                                                                            </div>);
                                                                    } else if (keyName !== 'style' && keyName !== config.URI) {
                                                                        return (
                                                                            <div key={index + keyName}
                                                                                className="list-item"><p
                                                                                    className="list-item-label">{keyName} </p>
                                                                                <p
                                                                                    className="list-item-hash-value">{immutableProperties[keyName]}</p>
                                                                            </div>);
                                                                    }
                                                                })
                                                                : ""
                                                            }
                                                        </div>
                                                        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                                            <p className="sub-title">{t("MUTABLES")}</p>
                                                            {mutableKeys !== null ?
                                                                mutableKeys.map((keyName, index1) => {
                                                                    if (mutableProperties[keyName] !== "" && keyName !== config.URI) {
                                                                        return (
                                                                            <div key={index + keyName}
                                                                                className="list-item"><p
                                                                                    className="list-item-label">{keyName} </p>
                                                                                <p
                                                                                    id={`mutable_identityList_search` + index + index1}
                                                                                    className="list-item-value"></p>
                                                                            </div>);
                                                                    } else if (keyName !== config.URI) {
                                                                        return (
                                                                            <div key={index + keyName}
                                                                                className="list-item">
                                                                                <p>{keyName} </p> <p
                                                                                    className="list-item-hash-value">{mutableProperties[keyName]}</p>
                                                                            </div>);
                                                                    }
                                                                })
                                                                : ""
                                                            }
                                                        </div>
                                                    </div>
                                                    <p className="sub-title">provisionedAddressList</p>
                                                    {provisionedAddressList !== null && provisionedAddressList !== "" ?
                                                        provisionedAddressList.map((provisionedAddress, addressKey) => {
                                                            return (<p className="provision-address"
                                                                key={addressKey}>{provisionedAddress}</p>);
                                                        })
                                                        : <p className="provision-address">Empty</p>
                                                    }
                                                    <p className="sub-title">UnProvisionedAddressList</p>
                                                    {unProvisionedAddressList !== null && unProvisionedAddressList !== "" ?
                                                        unProvisionedAddressList.map((unprovisionedAddress, unprovisionedAddressKey) => {
                                                            return (
                                                                <p className="provision-address"
                                                                    key={unprovisionedAddressKey}>{unprovisionedAddress}</p>);
                                                        })
                                                        : <p className="provision-address">Empty</p>
                                                    }
                                                </div>
                                            </div>


                                        </div>
                                    </div>

                                );

                            })
                            : ""
                        }

                    </div>

                </div>
                <div>
                    {externalComponent === 'Provision' ?
                        <Provision setExternalComponent={setExternalComponent} identityId={identityId}/> :
                        null
                    }
                    {externalComponent === 'UnProvision' ?
                        <UnProvision setExternalComponent={setExternalComponent} identityId={identityId}
                            userList={identity}/> :
                        null
                    }
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
        </div>

    );
});
IdentityView.displayName = 'IdentityView';
export default IdentityView;
