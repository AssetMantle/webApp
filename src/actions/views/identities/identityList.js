import React, {useState, useEffect} from "react";
import identitiesQueryJS from "persistencejs/transaction/identity/query";
import Helpers from "../../../utilities/Helper";
import metasQueryJS from "persistencejs/transaction/meta/query";
import {Button} from "react-bootstrap";
import {Provision, UnProvision} from "../../forms/identities";
import {useTranslation} from "react-i18next";
import Loader from "../../../components/loader"
import Copy from "../../../components/copy"

const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const identitiesQuery = new identitiesQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)

const IdentityList = () => {
    const Helper = new Helpers();
    const {t} = useTranslation();
    const [loader, setLoader] = useState(true)
    const [externalComponent, setExternalComponent] = useState("");
    const [identityId, setIdentityId] = useState("");
    const [identity, setIdentity] = useState([]);
    const [filteredIdentitiesList, setFilteredIdentitiesList] = useState([]);
    const userAddress = localStorage.getItem('address');
    useEffect(() => {
        const fetchToIdentities = () => {
            const identities = identitiesQuery.queryIdentityWithID("all")
            if (identities) {
                identities.then(function (item) {
                    const data = JSON.parse(item);
                    const dataList = data.result.value.identities.value.list;
                    if (dataList) {
                        const filterIdentities = Helper.FilterIdentitiesByProvisionedAddress(dataList, userAddress);
                        if (filterIdentities.length) {
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
                                setLoader(false)
                            })
                        } else {
                            setLoader(false)
                        }
                    } else {
                        setLoader(false)
                    }
                })
            } else {
                setLoader(false)
            }
        }
        fetchToIdentities();
    }, []);

    const handleModalData = (formName, identityId, identity) => {
        setExternalComponent(formName)
        setIdentity(identity);
        setIdentityId(identityId)
    }

    return (
        <div className="list-container">
            {loader ?
                <Loader/>
                : ""
            }
            <div className="row card-deck">
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
                            <div className="col-md-4 col-sm-12" key={index}>
                                <div className="card">
                                    <div>
                                        <Button variant="secondary"
                                                onClick={() => handleModalData("Provision", identityId)}>{t("PROVISION")}</Button>
                                        <Button variant="secondary"
                                                onClick={() => handleModalData("UnProvision", identityId, identity)}>{t("UN_PROVISION")}</Button>
                                    </div>
                                    <div className="id-section">
                                        <p className="id" title={identityId}>{identityId}</p>
                                        <Copy
                                        id={identityId}/>
                                    </div>

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
                    : <p className="empty-list">{t("IDENTITIES_NOT_FOUND")}</p>}
            </div>
            <div>
                {externalComponent === 'Provision' ?
                    <Provision setExternalComponent={setExternalComponent} identityId={identityId}/> :
                    null
                }
                {externalComponent === 'UnProvision' ?
                    <UnProvision setExternalComponent={setExternalComponent} identityId={identityId}
                                 identityIdList={identity}/> :
                    null
                }
            </div>
        </div>
    );
}
export default IdentityList