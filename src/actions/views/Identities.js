import React, {useState, useEffect} from "react";
import identitiesQueryJS from "persistencejs/transaction/identity/query";
import identitiesDefineJS from "persistencejs/transaction/identity/define";
import Helpers from "../../utilities/Helper";
import metasQueryJS from "persistencejs/transaction/meta/query";
import {Dropdown, Modal, Button} from "react-bootstrap";
import {Define} from "../forms";
import {Nub, IssueIdentity, Provision, UnProvision} from "../forms/identities";
import {useTranslation} from "react-i18next";

const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const identitiesQuery = new identitiesQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const identitiesDefine = new identitiesDefineJS(process.env.REACT_APP_ASSET_MANTLE_API)

const Identities = () => {
    const Helper = new Helpers();
    const {t} = useTranslation();
    const [externalComponent, setExternalComponent] = useState("");
    const [identityId, setIdentityId] = useState("");
    const [identity, setIdentity] = useState([]);
    const [filteredIdentitiesList, setFilteredIdentitiesList] = useState([]);
    const userAddress = localStorage.getItem('address');
    useEffect(() => {
        const fetchToIdentities = () => {
            const identities = identitiesQuery.queryIdentityWithID("all")
            identities.then(function (item) {
                const data = JSON.parse(item);
                const dataList = data.result.value.identities.value.list;
                if (dataList) {
                    const filterIdentities = Helper.FilterIdentitiesByProvisionedAddress(dataList, userAddress);
                    setFilteredIdentitiesList(filterIdentities);
                    filterIdentities.map((identity, index) => {
                        let immutableProperties = "";
                        let mutableProperties = "";
                        const identityId = Helper.GetIdentityID(identity)
                        if (identity.value.immutables.value.properties.value.propertyList !== null) {
                            immutableProperties = Helper.ParseProperties(identity.value.immutables.value.properties.value.propertyList);
                        }
                        if (identity.value.mutables.value.properties.value.propertyList !== null) {
                            mutableProperties = Helper.ParseProperties(identity.value.mutables.value.properties.value.propertyList);
                        }
                        let immutableKeys = Object.keys(immutableProperties);
                        let mutableKeys = Object.keys(mutableProperties);
                        Helper.AssignMetaValue(immutableKeys, immutableProperties, metasQuery, 'immutable_identityList', index);
                        Helper.AssignMetaValue(mutableKeys, mutableProperties, metasQuery, 'mutable_identityList', index);
                    })
                }
            })
        }
        fetchToIdentities();
    }, []);

    const handleModalData = (formName, identityId, identity) => {
        setExternalComponent(formName)
        setIdentity(identity);
        setIdentityId(identityId)
    }

    return (
        <div className="container">
            <div className="accountInfo">
                <div className="row row-cols-1 row-cols-md-2 card-deck">
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {t("ACTIONS")}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleModalData("Nub")}>{t("NUB")}</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleModalData("DefineIdentity")}>{t("DEFINE_IDENTITY")}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleModalData("IssueIdentity")}>{t("ISSUE_IDENTITY")}
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    {filteredIdentitiesList.length ?
                        filteredIdentitiesList.map((identity, index) => {
                        let immutableProperties = "";
                        let mutableProperties = "";
                        let provisionedAddressList = "";
                        let unProvisionedAddressList = "";
                        const identityId = Helper.GetIdentityID(identity)
                        if (identity.value.immutables.value.properties.value.propertyList !== null) {
                            immutableProperties = Helper.ParseProperties(identity.value.immutables.value.properties.value.propertyList);
                        }
                        if (identity.value.mutables.value.properties.value.propertyList !== null) {
                            mutableProperties = Helper.ParseProperties(identity.value.mutables.value.properties.value.propertyList);
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
                            <div className="col-md-6" key={index}>
                                <div className="card">
                                    <div>
                                        <Button variant="secondary"
                                                onClick={() => handleModalData("Provision", identityId)}>{t("PROVISION")}</Button>
                                        <Button variant="secondary"
                                                onClick={() => handleModalData("UnProvision", identityId, identity)}>{t("UN_PROVISION")}</Button>
                                    </div>
                                    <a href="#">{identityId}</a>
                                    <p>{t("IMMUTABLES")}</p>
                                    {immutableKeys !== null ?
                                        immutableKeys.map((keyName, index1) => {
                                            if (immutableProperties[keyName] !== "") {
                                                return (<a key={index + keyName}><b>{keyName} </b>: <span
                                                    id={`immutable_identityList` + index + `${index1}`}></span></a>)
                                            } else {
                                                return (
                                                    <a key={index + keyName}><b>{keyName} </b>: <span>{immutableProperties[keyName]}</span></a>)
                                            }
                                        })
                                        : ""
                                    }
                                    <p>{t("MUTABLES")}</p>
                                    {mutableKeys !== null ?
                                        mutableKeys.map((keyName, index1) => {
                                            if (mutableProperties[keyName] !== "") {
                                                return (<a key={index + keyName}><b>{keyName} </b>: <span
                                                    id={`mutable_identityList` + index + `${index1}`}></span></a>)
                                            } else {
                                                return (
                                                    <a key={index + keyName}><b>{keyName} </b>: <span>{mutableProperties[keyName]}</span></a>)
                                            }
                                        })
                                        : ""
                                    }
                                    <h5>provisionedAddressList</h5>
                                    {provisionedAddressList !== null ?
                                        provisionedAddressList.map((provisionedAddress, addressKey) => {
                                            return (<p key={addressKey}>{provisionedAddress}</p>)
                                        })
                                        : ""
                                    }
                                    <h5>UnProvisionedAddressList</h5>
                                    {unProvisionedAddressList !== null ?
                                        unProvisionedAddressList.map((unprovisionedAddress, unprovisionedAddressKey) => {
                                            return (<p key={unprovisionedAddressKey}>{unprovisionedAddress}</p>)
                                        })
                                        : ""
                                    }
                                </div>
                            </div>
                        )
                    })
                    :<p>{t("IDENTITIES_NOT_FOUND")}</p>}
                </div>
            </div>
            <div>
                {externalComponent === 'Nub' ?
                    <Nub setExternalComponent={setExternalComponent} /> :
                    null
                }
                {externalComponent === 'DefineIdentity' ?
                    <Define setExternalComponent={setExternalComponent} ActionName={identitiesDefine} FormName={'Define Identity'}/> :
                    null
                }
                {externalComponent === 'IssueIdentity' ?

                    <IssueIdentity setExternalComponent={setExternalComponent} /> :
                    null
                }

                {externalComponent === 'Provision' ?
                    <Provision setExternalComponent={setExternalComponent} identityId={identityId}/> :
                    null
                }
                {externalComponent === 'UnProvision' ?
                    <UnProvision setExternalComponent={setExternalComponent} identityId={identityId} identityIdList={identity}/> :
                    null
                }
            </div>
        </div>
    );
}
export default Identities