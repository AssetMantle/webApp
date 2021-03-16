import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import splitsQueryJS from "persistencejs/transaction/splits/query";
import assetsQueryJS from "persistencejs/transaction/assets/query";
import metasQueryJS from "persistencejs/transaction/meta/query";
import identitiesQueryJS from "persistencejs/transaction/identity/query";
import {useTranslation} from "react-i18next";
import {Button} from "react-bootstrap";
import Loader from "../../../components/loader"
import config from "../../../constants/config.json"
import FilterHelpers from "../../../utilities/Helpers/filter";
import GetMeta from "../../../utilities/Helpers/getMeta";
import GetProperty from "../../../utilities/Helpers/getProperty";
import GetID from "../../../utilities/Helpers/getID";
import {MakeOrder} from "../../forms/orders";
import {SendSplit} from "../../forms/assets";

const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const identitiesQuery = new identitiesQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const assetsQuery = new assetsQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const splitsQuery = new splitsQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)

const AssetList = React.memo((props) => {
    const PropertyHelper = new GetProperty();
    const FilterHelper = new FilterHelpers();
    const GetMetaHelper = new GetMeta();
    const GetIDHelper = new GetID();
    const {t} = useTranslation();
    let history = useHistory();
    const [assetList, setAssetList] = useState([]);
    const [loader, setLoader] = useState(true)
    const [splitList, setSplitList] = useState([]);
    const userAddress = localStorage.getItem('address');
    const [externalComponent, setExternalComponent] = useState("");
    const [ownerId, setOwnerId] = useState("");
    const [ownableId, setOwnableId] = useState("");

    useEffect(() => {
        const fetchAssets = () => {
            const identities = identitiesQuery.queryIdentityWithID("all")
            if (identities) {
                identities.then(function (item) {
                    const data = JSON.parse(item);
                    const dataList = data.result.value.identities.value.list;
                    if (dataList) {
                        const filterIdentities = FilterHelper.FilterIdentitiesByProvisionedAddress(dataList, userAddress)
                        const splits = splitsQuery.querySplitsWithID("all")
                        splits.then(function (splitsItem) {
                            const splitData = JSON.parse(splitsItem);
                            const splitList = splitData.result.value.splits.value.list;
                            if (splitList) {
                                const filterSplitsByIdentities = FilterHelper.FilterSplitsByIdentity(filterIdentities, splitList)
                                if (filterSplitsByIdentities.length) {
                                    setSplitList(filterSplitsByIdentities)
                                    filterSplitsByIdentities.map((split, index) => {
                                        const ownableID = GetIDHelper.GetIdentityOwnableId(split)
                                        const classificationID = ownableID.substr(0,ownableID.indexOf('|'));
                                        const filterAssetList = assetsQuery.queryAssetWithID(ownableID);
                                        filterAssetList.then(function (Asset) {
                                            const parsedAsset = JSON.parse(Asset);
                                            if (parsedAsset.result.value.assets.value.list !== null) {
                                                const assetId = GetIDHelper.GetAssetID(parsedAsset.result.value.assets.value.list[0]);
                                                if (ownableID === assetId) {
                                                    if (classificationID === config.AssetClassificationID) {
                                                        setAssetList(assetList => [...assetList, parsedAsset]);
                                                        let immutableProperties = "";
                                                        let mutableProperties = "";
                                                        if (parsedAsset.result.value.assets.value.list[0].value.immutables.value.properties.value.propertyList !== null) {
                                                            immutableProperties = PropertyHelper.ParseProperties(parsedAsset.result.value.assets.value.list[0].value.immutables.value.properties.value.propertyList);
                                                        }
                                                        if (parsedAsset.result.value.assets.value.list[0].value.mutables.value.properties.value.propertyList !== null) {
                                                            mutableProperties = PropertyHelper.ParseProperties(parsedAsset.result.value.assets.value.list[0].value.mutables.value.properties.value.propertyList)
                                                        }
                                                        let immutableKeys = Object.keys(immutableProperties);
                                                        let mutableKeys = Object.keys(mutableProperties);
                                                        GetMetaHelper.AssignMetaValue(immutableKeys, immutableProperties, metasQuery, 'immutable_asset', index, 'assetUrlId');
                                                        GetMetaHelper.AssignMetaValue(mutableKeys, mutableProperties, metasQuery, 'mutable_asset', index, 'assetMutableUrlId');
                                                        setLoader(false)
                                                    } else {
                                                        setLoader(false)
                                                    }
                                                } else {
                                                    setLoader(false)
                                                }
                                            } else {
                                                setLoader(false)
                                            }
                                        })
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
                })
            } else {
                setLoader(false)
            }
        }
        fetchAssets();
    }, []);

    const handleModalData = (formName, assetOwnerId, ownableId) => {
        setOwnerId(assetOwnerId)
        setExternalComponent(formName)
        setOwnableId(ownableId)
    }

    const handleAsset = (assetid) => {
        if (assetid !== "stake") {
            history.push({
                    pathname: '/AssetView',
                    state: {
                        assetID: assetid,
                        makerOwnableID: assetid.substr(assetid.indexOf('|')+ 1),
                        currentPath: window.location.pathname,
                        splitList: splitList
                    }
                }
            );
        }
    }
    return (
        <div className="list-container container">
            {loader ?
                <Loader/>
                : ""
            }

            <div className="row card-deck">
                {splitList.length ?
                    splitList.map((split, index) => {
                        const ownableID = GetIDHelper.GetIdentityOwnableId(split)

                        let ownableId = split.value.id.value.ownableID.value.idString;
                        let ownerId = split.value.id.value.ownerID.value.idString;
                        let stake = split.value.split;
                        if(ownableId !== "stake") {
                            const classificationID = ownableID.substr(0,ownableID.indexOf('|'));
                            if (classificationID === config.AssetClassificationID) {
                                return (
                                    <div className="col-xl-3 col-lg-4 col-md-6  col-sm-12" key={index}>
                                        <div className="card asset-card" onClick={() => handleAsset(ownableId)}>
                                            <div id={"assetImagUri" + ownerId + index} className="image-container">
                                                <div id={"assetImage" + ownerId + index} className="dummy-image">
                                                </div>
                                            </div>
                                            <div className="info-section">
                                                {
                                                    assetList.map((asset, assetIndex) => {
                                                        const assetItemId = GetIDHelper.GetAssetID(asset.result.value.assets.value.list[0]);
                                                        if (ownableID === assetItemId) {
                                                            let immutableProperties = "";
                                                            let mutableProperties = "";
                                                            if (asset.result.value.assets.value.list[0].value.immutables.value.properties.value.propertyList !== null) {
                                                                immutableProperties = PropertyHelper.ParseProperties(asset.result.value.assets.value.list[0].value.immutables.value.properties.value.propertyList);
                                                            }
                                                            if (asset.result.value.assets.value.list[0].value.mutables.value.properties.value.propertyList !== null) {
                                                                mutableProperties = PropertyHelper.ParseProperties(asset.result.value.assets.value.list[0].value.mutables.value.properties.value.propertyList)
                                                            }
                                                            let immutableKeys = Object.keys(immutableProperties);
                                                            let mutableKeys = Object.keys(mutableProperties);
                                                            return (
                                                                <div key={assetIndex}>
                                                                    {immutableKeys !== null ?
                                                                        immutableKeys.map((keyName, index1) => {
                                                                            if (immutableProperties[keyName] !== "") {
                                                                                if (keyName === config.URI) {
                                                                                    let imageElement = document.getElementById("assetImage" + ownerId + index)
                                                                                    if (typeof (imageElement) != 'undefined' && imageElement != null) {
                                                                                        let divd = document.createElement('div');
                                                                                        divd.id = `assetUrlId` + index + `${index1}`
                                                                                        divd.className = "assetImage"
                                                                                        document.getElementById("assetImagUri" + ownerId + index).replaceChild(divd, imageElement);
                                                                                    }
                                                                                } else if (keyName === "style") {
                                                                                    return (
                                                                                        <div key={index + keyName}
                                                                                             className="list-item"><p
                                                                                            className="list-item-label"></p>
                                                                                            <p
                                                                                                id={`immutable_asset` + index + `${index1}`}
                                                                                                className="list-item-value"></p>
                                                                                        </div>)
                                                                                } else if (keyName === "description") {
                                                                                    return (
                                                                                        <div key={index + keyName}
                                                                                             className="card-item">
                                                                                            <p
                                                                                                id={`immutable_asset` + index + `${index1}`}
                                                                                                className="description asset"></p>
                                                                                        </div>)
                                                                                } else if (keyName === "ArtistName") {
                                                                                    return (<div key={index + keyName}
                                                                                                 className="card-view-list">
                                                                                        <p className="card-view-value author"
                                                                                           id={`immutable_asset` + index + index1}></p>
                                                                                    </div>)
                                                                                }
                                                                            } else {
                                                                                return (
                                                                                    <div key={index + keyName}
                                                                                         className="list-item"><p
                                                                                        className="list-item-label">{keyName} : </p>
                                                                                        <p
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
                                                                                    let imageElement = document.getElementById("assetImage" + ownerId + index)
                                                                                    if (typeof (imageElement) != 'undefined' && imageElement != null) {
                                                                                        let divd = document.createElement('div');
                                                                                        divd.id = `assetMutableUrlId` + index + `${index1}`
                                                                                        divd.className = "assetImage"
                                                                                        document.getElementById("assetImagUri" + ownerId + index).replaceChild(divd, imageElement);
                                                                                    }
                                                                                } else if (keyName === "ArtistName") {
                                                                                    return (<div key={index + keyName}
                                                                                                 className="card-view-list">
                                                                                        <p className="card-view-value author"
                                                                                           id={`mutable_asset` + index + index1}></p>
                                                                                    </div>)
                                                                                }
                                                                            }
                                                                        })
                                                                        : ""
                                                                    }

                                                                </div>
                                                            )
                                                        }
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        }
                    })
                    : <p className="empty-list">{t("ASSETS_NOT_FOUND")}</p>}
            </div><div>
            {
                externalComponent === 'MakeOrder' ?
                    <MakeOrder setExternalComponent={setExternalComponent} ownerId={ownerId}
                               ownableId={ownableId}/> :
                    null
            }
            {
                externalComponent === 'SendSplit' ?
                    <SendSplit setExternalComponent={setExternalComponent} ownerId={ownerId}
                               ownableId={ownableId}/> :
                    null
            }
        </div>
        </div>
    );
});

export default AssetList;
