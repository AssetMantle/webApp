import React, {useState, useEffect} from "react";
import identitiesQueryJS from "persistencejs/transaction/identity/query";
import metasQueryJS from "persistencejs/transaction/meta/query";
import {useTranslation} from "react-i18next";
import Loader from "../../../components/loader"
import config from "../../../constants/config.json"
import GetProperty from "../../../utilities/Helpers/getProperty";
import FilterHelpers from "../../../utilities/Helpers/filter";
import GetMeta from "../../../utilities/Helpers/getMeta";
import GetID from "../../../utilities/Helpers/getID";
import {useHistory} from "react-router-dom";

const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const identitiesQuery = new identitiesQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)

const IdentityList = React.memo((props) => {
    const PropertyHelper = new GetProperty();
    const FilterHelper = new FilterHelpers();
    const GetMetaHelper = new GetMeta();
    const GetIDHelper = new GetID();
    const {t} = useTranslation();
    let history = useHistory();
    const [loader, setLoader] = useState(true)
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
                                GetMetaHelper.AssignMetaValue(mutableKeys, mutableProperties, metasQuery, 'mutable_identityList', index);
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


    const handleAsset = (id) => {
        if (id !== "stake") {
            history.push({
                    pathname: '/IdentityView',
                    state: {
                        identityID: id,
                        currentPath: window.location.pathname,
                    }
                }
            );
        }
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
                        const identityId = GetIDHelper.GetIdentityID(identity)
                        if (identity.value.immutables.value.properties.value.propertyList !== null) {
                            immutableProperties = PropertyHelper.ParseProperties(identity.value.immutables.value.properties.value.propertyList);
                        }
                        let immutableKeys = Object.keys(immutableProperties);
                        return (
                            <div className="col-xl-3 col-lg-4 col-md-6  col-sm-12" key={index}>
                                <div className="card" onClick={() => handleAsset(identityId)}>
                                    <div id={"identityImagUri" + identityId + index}>
                                        <div id={"identityImage" + identityId + index} className="dummy-image">

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
                                                        let imageElement = document.getElementById("identityImage" + identityId + index)
                                                        if (typeof (imageElement) != 'undefined' && imageElement != null) {
                                                            let divd = document.createElement('div');
                                                            divd.id = `identityUrlId` + index + `${index1}`
                                                            divd.className = "assetImage"
                                                            document.getElementById("identityImagUri" + identityId + index).replaceChild(divd, imageElement);
                                                        }
                                                    } else {
                                                        return (<div key={index + keyName} className="list-item"><p
                                                            className="list-item-label">{keyName}: </p> <p
                                                            id={`immutable_identityList` + index + `${index1}`}
                                                            className="list-item-value"></p></div>)
                                                    }
                                                } else {
                                                    return (
                                                        <div key={index + keyName} className="list-item"><p
                                                            className="list-item-label">{keyName}: </p> <p
                                                            className="list-item-hash-value">{immutableProperties[keyName]}</p>
                                                        </div>)
                                                }
                                            })
                                            : ""
                                        }

                                    </div>
                                </div>
                            </div>
                        )
                    })
                    : <p className="empty-list">{t("IDENTITIES_NOT_FOUND")}</p>}
            </div>

        </div>
    );
})

export default IdentityList
