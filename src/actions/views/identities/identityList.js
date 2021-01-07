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

const IdentityList = React.memo((props) => {
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
                                if (identity.value.immutables.value.properties.value.propertyList !== null) {
                                    immutableProperties = Helper.ParseProperties(identity.value.immutables.value.properties.value.propertyList);
                                }
                                if (identity.value.mutables.value.properties.value.propertyList !== null) {
                                    mutableProperties = Helper.ParseProperties(identity.value.mutables.value.properties.value.propertyList);
                                }
                                let immutableKeys = Object.keys(immutableProperties);
                                let mutableKeys = Object.keys(mutableProperties);
                                Helper.AssignMetaValue(immutableKeys, immutableProperties, metasQuery, 'immutable_identityList', index, 'identityUrlId');
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
                            <div className="col-xl-4 col-lg-6 col-md-6  col-sm-12" key={index}>
                                <div className="card">
                                    <div>
                                        <Button variant="secondary" size="sm"
                                                onClick={() => handleModalData("Provision", identityId)}>{t("PROVISION")}</Button>
                                        <Button variant="secondary" size="sm"
                                                onClick={() => handleModalData("UnProvision", identityId, identity)}>{t("UN_PROVISION")}</Button>
                                    </div>
                                    <div className="id-section">
                                        <p className="id-string" title={identityId}>{identityId}</p>
                                        <Copy
                                        id={identityId}/>
                                    </div>

                                    <p className="sub-title">{t("IMMUTABLES")}</p>
                                    {immutableKeys !== null ?
                                        immutableKeys.map((keyName, index1) => {
                                            if (immutableProperties[keyName] !== "") {
                                                if (keyName === "imgUrl") {
                                                    return (
                                                        <div key={index + keyName}
                                                             id={`identityUrlId` + index + `${index1}`}
                                                             className="assetImage"></div>)
                                                } else {
                                                    return (<div key={index + keyName} className="list-item"><p
                                                        className="list-item-label">{keyName} </p>: <p
                                                        id={`immutable_identityList` + index + `${index1}`}
                                                        className="list-item-value"></p></div>)
                                                }
                                            }else {
                                                return (
                                                    <div key={index + keyName} className="list-item"><p className="list-item-label">{keyName} </p>: <p className="list-item-hash-value">{immutableProperties[keyName]}</p></div>)
                                            }
                                        })
                                        : ""
                                    }
                                    <p className="sub-title">{t("MUTABLES")}</p>
                                    {mutableKeys !== null ?
                                        mutableKeys.map((keyName, index1) => {
                                            if (mutableProperties[keyName] !== "") {
                                                return (<div key={index + keyName} className="list-item"><p className="list-item-label">{keyName} </p>: <p
                                                    id={`mutable_identityList` + index + `${index1}`}  className="list-item-value"></p></div>)
                                            } else {
                                                return (
                                                    <div key={index + keyName} className="list-item"><p>{keyName} </p>: <p className="list-item-hash-value">{mutableProperties[keyName]}</p></div>)
                                            }
                                        })
                                        : ""
                                    }
                                    <p className="sub-title">{t("PROVISION_ADDRESS_LIST")}</p>
                                    {provisionedAddressList !== null && provisionedAddressList !== "" ?
                                        provisionedAddressList.map((provisionedAddress, provisionedAddressKey) => {
                                            return (<p key={provisionedAddressKey} className="provision-address" title={provisionedAddress}>{provisionedAddress}</p>)
                                        })
                                        : <p>--</p>
                                    }
                                    <p className="sub-title">{t("UN_PROVISION_ADDRESS_LIST")}</p>
                                    {unProvisionedAddressList !== null && unProvisionedAddressList !==  "" ?
                                        unProvisionedAddressList.map((unprovisionedAddress, unprovisionedAddressKey) => {
                                            return (<p key={unprovisionedAddressKey}  className="provision-address" title={unprovisionedAddress}>{unprovisionedAddress}</p>)
                                        })
                                        : <p>--</p>
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
})

export default IdentityList
