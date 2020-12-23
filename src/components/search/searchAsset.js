import React, {useState, useEffect} from "react";
import assetsQueryJS from "persistencejs/transaction/assets/query";
import Helpers from "../../utilities/Helper";
import metasQueryJS from "persistencejs/transaction/meta/query";
import {useTranslation} from "react-i18next";
import Sidebar from "../sidebar/sidebar";
import {useHistory} from "react-router-dom";
import {Summary} from "../summary";
import Icon from "../../icons";

const assetsQuery = new assetsQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)

const SearchAsset = React.memo((props) => {
    const Helper = new Helpers();
    let history = useHistory();
    const {t} = useTranslation();
    const [assetList, setAssetList] = useState([]);
    useEffect(() => {
        if (props.location.data !== undefined) {
            const filterAssetList = assetsQuery.queryAssetWithID(props.location.data.data);
            filterAssetList.then(function (Asset) {
                const parsedAsset = JSON.parse(Asset);
                if (parsedAsset.result.value.assets.value.list !== null) {
                    const assetItems = parsedAsset.result.value.assets.value.list
                    setAssetList(assetItems);
                    assetItems.map((asset, index) => {
                        let immutableProperties = "";
                        let mutableProperties = "";
                        if (asset.value.immutables.value.properties.value.propertyList !== null) {
                            immutableProperties = Helper.ParseProperties(asset.value.immutables.value.properties.value.propertyList);
                        }
                        if (asset.value.mutables.value.properties.value.propertyList !== null) {
                            mutableProperties = Helper.ParseProperties(asset.value.mutables.value.properties.value.propertyList)
                        }
                        let immutableKeys = Object.keys(immutableProperties);
                        let mutableKeys = Object.keys(mutableProperties);
                        Helper.AssignMetaValue(immutableKeys, immutableProperties, metasQuery, 'immutable_asset_search', index);
                        Helper.AssignMetaValue(mutableKeys, mutableProperties, metasQuery, 'mutable_asset_search', index);
                    })
                }
            })
        }
    }, [])

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
                                <Icon viewClass="arrow-icon" icon="arrow"/> Back</p>
                        </div>


                        <div className="list-container">

                            <div className="row card-deck">
                                {
                                    assetList.map((asset, index) => {
                                        let immutableProperties = "";
                                        let mutableProperties = "";

                                        if (asset.value.immutables.value.properties.value.propertyList !== null) {
                                            immutableProperties = Helper.ParseProperties(asset.value.immutables.value.properties.value.propertyList);
                                        }
                                        if (asset.value.mutables.value.properties.value.propertyList !== null) {
                                            mutableProperties = Helper.ParseProperties(asset.value.mutables.value.properties.value.propertyList)
                                        }
                                        let immutableKeys = Object.keys(immutableProperties);
                                        let mutableKeys = Object.keys(mutableProperties);
                                        return (
                                            <div className="col-xl-4 col-lg-6 col-md-6  col-sm-12" key={index}>
                                                <div className="card">
                                                    <p className="sub-title">{t("IMMUTABLES")}</p>
                                                    {immutableKeys !== null ?
                                                        immutableKeys.map((keyName, index1) => {
                                                            if (immutableProperties[keyName] !== "") {
                                                                return (
                                                                    <div key={index + keyName} className="list-item"><p
                                                                        className="list-item-label">{keyName} </p>: <p
                                                                        id={`immutable_asset_search` + index + index1}
                                                                        className="list-item-value"></p></div>)
                                                            } else {
                                                                return (
                                                                    <div key={index + keyName} className="list-item"><p
                                                                        className="list-item-label">{keyName} </p>: <p
                                                                        className="list-item-hash-value">{immutableProperties[keyName]}</p>
                                                                    </div>)
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
                                                                        id={`mutable_asset_search` + index + index1}
                                                                        className="list-item-value"></p></div>)
                                                            } else {
                                                                return (
                                                                    <div key={index + keyName} className="list-item"><p
                                                                        className="list-item-label">{keyName} </p>: <p
                                                                        className="list-item-hash-value">{mutableProperties[keyName]}</p>
                                                                    </div>)
                                                            }
                                                        })
                                                        : ""
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }


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
})

export default SearchAsset;
