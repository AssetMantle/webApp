import React, {useState, useEffect} from "react";
import splitsQueryJS from "persistencejs/transaction/splits/query";
import assetsQueryJS from "persistencejs/transaction/assets/query";
import {Button} from "react-bootstrap";
import metasQueryJS from "persistencejs/transaction/meta/query";
import identitiesQueryJS from "persistencejs/transaction/identity/query";
import {MutateAsset, BurnAsset, SendSplit} from "../../forms/assets";
import {MakeOrder} from "../../forms/orders";
import {useTranslation} from "react-i18next";
import Loader from "../../../components/loader"
import Copy from "../../../components/copy";
import config from "../../../constants/config.json"
import FilterHelpers from "../../../utilities/Helpers/filter";
import GetMeta from "../../../utilities/Helpers/getMeta";
import GetProperty from "../../../utilities/Helpers/getProperty";
import GetID from "../../../utilities/Helpers/getID";
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
    const [externalComponent, setExternalComponent] = useState("");
    const [ownerId, setOwnerId] = useState("");
    const [ownableId, setOwnableId] = useState("");
    const [assetList, setAssetList] = useState([]);
    const [loader, setLoader] = useState(true)
    const [splitList, setSplitList] = useState([]);
    const [mutateProperties, setMutateProperties] = useState({});
    const [asset, setAsset] = useState({});
    const userAddress = localStorage.getItem('address');

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
                                                        mutableProperties = PropertyHelper.ParseProperties(parsedAsset.result.value.assets.value.list[0].value.mutables.value.properties.value.propertyList)
                                                    }
                                                    let immutableKeys = Object.keys(immutableProperties);
                                                    let mutableKeys = Object.keys(mutableProperties);
                                                    GetMetaHelper.AssignMetaValue(immutableKeys, immutableProperties, metasQuery, 'immutable_asset', index, 'assetUrlId');
                                                    GetMetaHelper.AssignMetaValue(mutableKeys, mutableProperties, metasQuery, 'mutable_asset', index);
                                                    setLoader(false)
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

    const handleModalData = (formName, mutableProperties1, asset1, assetOwnerId, ownableId) => {
        setMutateProperties(mutableProperties1)
        setAsset(asset1)
        setOwnerId(assetOwnerId)
        setExternalComponent(formName)
        setOwnableId(ownableId)
    }

    return (
        <div className="list-container">
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
                        return (
                            <div className="col-xl-4 col-lg-6 col-md-6  col-sm-12" key={index}>
                                <div className="card">
                                    {ownableId !== "stake" ?
                                        <>
                                        <div className="list-item">
                                            <p className="list-item-label">{t("ASSET_ID")}</p>
                                            <div className="list-item-value id-section">
                                                <p className="id-string" title={ownableId}>: {ownableId}</p>
                                                <Copy
                                                    id={ownableId}/>
                                            </div>
                                        </div>

                                        </>
                                        :
                                        <div className="list-item">
                                            <p className="list-item-label">{t("OWNABLE_ID")}</p>
                                            <p className="list-item-value" title={ownableId}>{ownableId}</p>
                                        </div>

                                    }

                                    <div className="list-item">
                                        <p className="list-item-label">{t("OWNER_ID")}</p>
                                        <div className="list-item-value id-section">
                                            <p className="id-string" title={ownerId}>: {ownerId}</p>
                                            <Copy
                                                id={ownerId}/>
                                        </div>
                                    </div>

                                    <div className="list-item">
                                        <p className="list-item-label">{t("STAKE")}</p>
                                        <p className="list-item-value id-string" title={stake}>{stake}</p>
                                    </div>

                                    <div className="button-group">
                                        <Button variant="secondary" size="sm"
                                                onClick={() => handleModalData("MakeOrder", "", "", ownerId, ownableID)}>{t("MAKE")}</Button>
                                        <Button variant="secondary" size="sm"
                                                onClick={() => handleModalData("SendSplit", "", "", ownerId, ownableID)}>{t("SEND_SPLITS")}</Button>
                                    </div>
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
                                                        <div>
                                                            <Button variant="secondary" size="sm"
                                                                    onClick={() => handleModalData("MutateAsset", mutableProperties, asset)}>{t("MUTATE_ASSET")}
                                                            </Button>
                                                            <Button variant="secondary" size="sm"
                                                                    onClick={() => handleModalData("BurnAsset", "", asset, ownerId, ownableID)}>{t("BURN_ASSET")}
                                                            </Button>

                                                        </div>

                                                        <p className="sub-title">{t("IMMUTABLES")}</p>
                                                        {immutableKeys !== null ?
                                                            immutableKeys.map((keyName, index1) => {
                                                                if (immutableProperties[keyName] !== "") {
                                                                    if (keyName === config.URI) {
                                                                        return (
                                                                            <div key={index + keyName} id={`assetUrlId` + index + `${index1}`}
                                                                                 className="assetImage"></div>)
                                                                    } else {
                                                                        return (
                                                                            <div key={index + keyName}
                                                                                 className="list-item"><p
                                                                                className="list-item-label">{keyName} </p>: <p
                                                                                id={`immutable_asset` + index + `${index1}`}
                                                                                className="list-item-value"></p></div>)
                                                                    }
                                                                } else {
                                                                    return (
                                                                        <div key={index + keyName}
                                                                             className="list-item"><p
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
                                                                        <div key={index + keyName}
                                                                             className="list-item"><p
                                                                            className="list-item-label">{keyName} </p>: <p
                                                                            id={`mutable_asset` + index + `${index1}`}
                                                                            className="list-item-value"></p></div>)
                                                                } else {
                                                                    return (
                                                                        <div key={index + keyName}
                                                                             className="list-item"><p
                                                                            className="list-item-label">{keyName} </p>: <p
                                                                            className="list-item-hash-value">{mutableProperties[keyName]}</p>
                                                                        </div>)
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
                        )
                    })
                    : <p className="empty-list">{t("ASSETS_NOT_FOUND")}</p>}
                    </div>
                    <div>

                {externalComponent === 'MutateAsset' ?
                    <MutateAsset setExternalComponent={setExternalComponent} mutatePropertiesList={mutateProperties}
                    asset={asset}/> :
                    null
                }
                {
                    externalComponent === 'BurnAsset' ?
                    <BurnAsset setExternalComponent={setExternalComponent} ownerId={ownerId} ownableId={ownableId}/> :
                    null
                }
                {
                    externalComponent === 'MakeOrder' ?
                    <MakeOrder setExternalComponent={setExternalComponent} ownerId={ownerId} ownableId={ownableId}/> :
                    null
                }
                {
                    externalComponent === 'SendSplit' ?
                    <SendSplit setExternalComponent={setExternalComponent} ownerId={ownerId} ownableId={ownableId}/> :
                    null
                }
                    </div>
                    </div>
                    );
                });

export default AssetList;
