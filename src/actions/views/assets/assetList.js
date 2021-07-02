import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import {querySplits} from "persistencejs/build/transaction/splits/query";
import {queryAssets} from "persistencejs/build/transaction/assets/query";
import {queryMeta} from "persistencejs/build/transaction/meta/query";
import {useTranslation} from "react-i18next";
import {Button} from "react-bootstrap";
import Loader from "../../../components/loader";
import config from "../../../constants/config.json";
import FilterHelpers from "../../../utilities/Helpers/filter";
import GetMeta from "../../../utilities/Helpers/getMeta";
import GetProperty from "../../../utilities/Helpers/getProperty";
import GetID from "../../../utilities/Helpers/getID";
import {MakeOrder} from "../../forms/orders";
import {SendSplit} from "../../forms/assets";

const metasQuery = new queryMeta(process.env.REACT_APP_ASSET_MANTLE_API);
const assetsQuery = new queryAssets(process.env.REACT_APP_ASSET_MANTLE_API);
const splitsQuery = new querySplits(process.env.REACT_APP_ASSET_MANTLE_API);

const AssetList = React.memo(() => {
    const PropertyHelper = new GetProperty();
    const FilterHelper = new FilterHelpers();
    const GetMetaHelper = new GetMeta();
    const GetIDHelper = new GetID();
    const {t} = useTranslation();
    let history = useHistory();
    const [assetList, setAssetList] = useState([]);
    const [loader, setLoader] = useState(true);
    const [splitList, setSplitList] = useState([]);
    const identityId = localStorage.getItem('identityId');
    const [externalComponent, setExternalComponent] = useState("");
    const [ownerId, setOwnerId] = useState("");
    const [ownableId, setOwnableId] = useState("");

    useEffect(() => {
        const fetchAssets = () => {
            const splits = splitsQuery.querySplitsWithID("all");
            splits.then(function (splitsItem) {
                const splitData = JSON.parse(splitsItem);
                const splitList = splitData.result.value.splits.value.list;
                if (splitList) {
                    const filterSplitsByIdentities = FilterHelper.FilterSplitsByIdentity(identityId, splitList);
                    if (filterSplitsByIdentities.length) {
                        setSplitList(filterSplitsByIdentities);
                        filterSplitsByIdentities.map((split, index) => {
                            const ownableID = GetIDHelper.GetIdentityOwnableId(split);
                            const filterAssetList = assetsQuery.queryAssetWithID(ownableID);
                            filterAssetList.then(function (Asset) {
                                const parsedAsset = JSON.parse(Asset);
                                if (parsedAsset.result.value.assets.value.list !== null) {
                                    const assetId = GetIDHelper.GetAssetID(parsedAsset.result.value.assets.value.list[0]);
                                    if (ownableID === assetId) {
                                        setAssetList(assetList => [...assetList, parsedAsset]);
                                        let immutableProperties = "";
                                        let mutableProperties = "";
                                        if (parsedAsset.result.value.assets.value.list[0].value.immutables.value.properties.value.propertyList !== null) {
                                            immutableProperties = PropertyHelper.ParseProperties(parsedAsset.result.value.assets.value.list[0].value.immutables.value.properties.value.propertyList);
                                        }
                                        if (parsedAsset.result.value.assets.value.list[0].value.mutables.value.properties.value.propertyList !== null) {
                                            mutableProperties = PropertyHelper.ParseProperties(parsedAsset.result.value.assets.value.list[0].value.mutables.value.properties.value.propertyList);
                                        }
                                        let immutableKeys = Object.keys(immutableProperties);
                                        let mutableKeys = Object.keys(mutableProperties);
                                        GetMetaHelper.AssignMetaValue(immutableKeys, immutableProperties, metasQuery, 'immutable_asset', index, 'assetUrlId');
                                        GetMetaHelper.AssignMetaValue(mutableKeys, mutableProperties, metasQuery, 'mutable_asset', index, 'assetMutableUrlId');
                                        setLoader(false);
                                    } else {
                                        setLoader(false);
                                    }
                                } else {
                                    setLoader(false);
                                }
                            });
                        });
                    } else {
                        setLoader(false);
                    }
                } else {
                    setLoader(false);
                }
            });
        };
        fetchAssets();
    }, []);

    const handleModalData = (formName, assetOwnerId, ownableId) => {
        setOwnerId(assetOwnerId);
        setExternalComponent(formName);
        setOwnableId(ownableId);
    };

    const handleAsset = (assetid) => {
        if (assetid !== "stake") {
            history.push({
                pathname: '/AssetView',
                state: {
                    assetID: assetid,
                    currentPath: window.location.pathname,
                    splitList: splitList
                }
            }
            );
        }
    };
    return (
        <div className="list-container">
            {loader ?
                <Loader/>
                : ""
            }

            <div className="row card-deck">
                {splitList.length ?
                    splitList.map((split, index) => {
                        const ownableID = GetIDHelper.GetIdentityOwnableId(split);

                        let ownableId = split.value.id.value.ownableID.value.idString;
                        let ownerId = split.value.id.value.ownerID.value.idString;
                        return (
                            <div className="col-xl-3 col-lg-4 col-md-6  col-sm-12" key={index}>
                                <div className="card asset-card">
                                    <div id={"assetImagUri" + ownerId + index} className="image-container">
                                        <div id={"assetImage" + ownerId + index} className="dummy-image">
                                        </div>
                                    </div>
                                    <div className="info-section">
                                        {ownableId !== "stake" ?
                                            <>
                                                <div className="list-item">
                                                    <p className="list-item-label">{t("ASSET_ID")}:</p>
                                                    <div className="list-item-value id-section">
                                                        <p className="id-string" title={ownableId}> {ownableId}</p>
                                                    </div>
                                                </div>

                                            </>
                                            :
                                            <div className="list-item">
                                                <p className="list-item-label">{t("ASSET_ID")}:</p>
                                                <p className="list-item-value" title={ownableId}>{ownableId}</p>
                                            </div>

                                        }

                                        <div className="list-item">
                                            <p className="list-item-label">{t("OWNER_ID")}:</p>
                                            <div className="list-item-value id-section">
                                                <p className="id-string" title={ownerId}> {ownerId}</p>
                                            </div>
                                        </div>

                                        {ownableId === "stake" ?
                                            <div className="button-group">
                                                <Button variant="primary" size="sm"
                                                    onClick={() => handleModalData("MakeOrder",  ownerId, ownableID)}>{t("MAKE")}</Button>
                                                <Button variant="primary" size="sm"
                                                    onClick={() => handleModalData("SendSplit",  ownerId, ownableID)}>{t("SEND_SPLITS")}</Button>
                                            </div>
                                            : ""
                                        }

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
                                                        mutableProperties = PropertyHelper.ParseProperties(asset.result.value.assets.value.list[0].value.mutables.value.properties.value.propertyList);
                                                    }
                                                    let immutableKeys = Object.keys(immutableProperties);
                                                    let mutableKeys = Object.keys(mutableProperties);
                                                    return (
                                                        <div key={assetIndex}>
                                                            {immutableKeys !== null ?
                                                                immutableKeys.map((keyName, index1) => {
                                                                    if (immutableProperties[keyName] !== "") {
                                                                        if (keyName === config.URI) {
                                                                            let imageElement = document.getElementById("assetImage" + ownerId + index);
                                                                            if (typeof (imageElement) != 'undefined' && imageElement != null) {
                                                                                let divd = document.createElement('div');
                                                                                divd.id = `assetUrlId` + index + `${index1}`;
                                                                                divd.className = "assetImage";
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
                                                                                </div>);
                                                                        }
                                                                        else if (keyName === "identifier") {
                                                                            return (
                                                                                <div key={index + keyName}
                                                                                    className="list-item"><p
                                                                                        className="list-item-label">{keyName} : </p>
                                                                                    <p
                                                                                        id={`immutable_asset` + index + `${index1}`}
                                                                                        className="list-item-value"></p>
                                                                                </div>);
                                                                        }
                                                                    } else {
                                                                        return (
                                                                            <div key={index + keyName}
                                                                                className="list-item"><p
                                                                                    className="list-item-label">{keyName} : </p>
                                                                                <p
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
                                                                            let imageElement = document.getElementById("assetImage" + ownerId + index);
                                                                            if (typeof (imageElement) != 'undefined' && imageElement != null) {
                                                                                let divd = document.createElement('div');
                                                                                divd.id = `assetMutableUrlId` + index + `${index1}`;
                                                                                divd.className = "assetImage";
                                                                                document.getElementById("assetImagUri" + ownerId + index).replaceChild(divd, imageElement);
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                                : ""
                                                            }

                                                        </div>
                                                    );
                                                }
                                            })
                                        }
                                        {ownableId !== "stake" ?
                                            <Button variant="primary" className="viewButton" size="sm"
                                                onClick={() => handleAsset(ownableId)}>View</Button>
                                            :""
                                        }
                                    </div>
                                </div>
                            </div>
                        );
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
AssetList.displayName = 'AssetList';
export default AssetList;
