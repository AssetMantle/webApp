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
import {Button, Form} from "react-bootstrap";

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
    const identityId = localStorage.getItem('identityId');
    const [lastFromID, setLastFromID] = useState("");
    let lastFromIDValue = localStorage.getItem('lastFromID')
    if (lastFromIDValue !== null && document.getElementById(lastFromIDValue) !== null) {
        document.getElementById(lastFromIDValue).checked = true
    }
    useEffect(() => {
        const fetchToIdentities = () => {
            const identities = identitiesQuery.queryIdentityWithID(identityId)
            
            if (identities) {
                identities.then(function (item) {
                    const data = JSON.parse(item);
                    console.log(data,'dataList')
                    const dataList = data.result.value.identities.value.list;
                   
                    if (dataList) {
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
                                GetMetaHelper.AssignMetaValue(immutableKeys, immutableProperties, metasQuery, 'immutable_identityList', index, 'identityUrlId');
                                GetMetaHelper.AssignMetaValue(mutableKeys, mutableProperties, metasQuery, 'mutable_identityList', index, "identityMutableUrlId");
                                setLoader(false)
                            })
                        
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

    const handleFromID = (evt, id, elementID) => {
        let fromIDValue = localStorage.getItem('fromID');
        let lastFromIDValue = localStorage.getItem('lastFromID')
        if (lastFromIDValue !== 'null' && lastFromIDValue !== null) {
            if (document.getElementById(lastFromIDValue).checked === true) {
                document.getElementById(lastFromIDValue).checked = false
                document.getElementById(elementID).checked = true
            }
        }
        localStorage.setItem("fromID", id)
        localStorage.setItem("lastFromID", elementID)
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
                        const identityId = GetIDHelper.GetIdentityID(identity)
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
                                                            className="list-item-value"></p></div>)
                                                    }
                                                    else if (keyName === "identifier") {
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
                                        {mutableKeys !== null ?
                                            mutableKeys.map((keyName, index1) => {
                                                if (mutableProperties[keyName] !== "") {
                                                    if (keyName === config.URI) {
                                                        let imageElement = document.getElementById("identityImage" + identityId + index)
                                                        if (typeof (imageElement) != 'undefined' && imageElement != null) {
                                                            let divd = document.createElement('div');
                                                            divd.id = `identityMutableUrlId` + index + `${index1}`
                                                            divd.className = "assetImage"
                                                            document.getElementById("identityImagUri" + identityId + index).replaceChild(divd, imageElement);
                                                        }
                                                    }
                                                }
                                            })
                                            : ""
                                        }
                                        <Form.Group className="checkbox-fromid">
                                            <Form.Check custom type="checkbox" label="Use FromID"
                                                        name="checkboxURIee"
                                                        id={"checkboxFromID" + index}
                                                        onChange={(evt) => {
                                                            handleFromID(evt, identityId, "checkboxFromID" + index)
                                                        }}
                                            />
                                        </Form.Group>
                                        <Button variant="primary" className="viewButton" size="sm"
                                                onClick={() => handleAsset(identityId)}>View</Button>

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
