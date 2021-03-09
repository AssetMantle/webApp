import React, {useState, useEffect} from "react";
import assetsQueryJS from "persistencejs/transaction/assets/query";
import metasQueryJS from "persistencejs/transaction/meta/query";
import {useTranslation} from "react-i18next";
import Sidebar from "../../../components/sidebar/sidebar";
import {useHistory} from "react-router-dom";
import {Summary} from "../../../components/summary";
import GetProperty from "../../../utilities/Helpers/getProperty";
import GetMeta from "../../../utilities/Helpers/getMeta";
import config from "../../../constants/config.json";
import GetID from "../../../utilities/Helpers/getID";
import Copy from "../../../components/copy";
import {Button, Dropdown} from "react-bootstrap";
import Icon from "../../../icons";
import {BurnAsset, MintAsset, MutateAsset, SendSplit, UnWrap, Wrap} from "../../forms/assets";
import {MakeOrder} from "../../forms/orders";
import {Define} from "../../forms";
import AssetDefineJS from "persistencejs/transaction/assets/define";

const assetsQuery = new assetsQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const assetDefine = new AssetDefineJS(process.env.REACT_APP_ASSET_MANTLE_API)

const AssetView = React.memo((props) => {
    const PropertyHelper = new GetProperty();
    const GetMetaHelper = new GetMeta();
    const GetIDHelper = new GetID();
    let history = useHistory();
    const {t} = useTranslation();
    const [assetList, setAssetList] = useState([]);
    const [externalComponent, setExternalComponent] = useState("");
    const [ownerId, setOwnerId] = useState("");
    const [ownableId, setOwnableId] = useState("");
    const [loader, setLoader] = useState(true)
    const [mutateProperties, setMutateProperties] = useState({});
    const [asset, setAsset] = useState({});

    useEffect(() => {
        if (props.location.state !== undefined) {
            const filterAssetList = assetsQuery.queryAssetWithID(props.location.state.assetID);
            filterAssetList.then(function (Asset) {
                const parsedAsset = JSON.parse(Asset);
                if (parsedAsset.result.value.assets.value.list !== null) {
                    const assetItems = parsedAsset.result.value.assets.value.list
                    setAssetList(assetItems);
                    assetItems.map((asset, index) => {
                        let immutableProperties = "";
                        let mutableProperties = "";
                        if (asset.value.immutables.value.properties.value.propertyList !== null) {
                            immutableProperties = PropertyHelper.ParseProperties(asset.value.immutables.value.properties.value.propertyList);
                        }
                        if (asset.value.mutables.value.properties.value.propertyList !== null) {
                            mutableProperties = PropertyHelper.ParseProperties(asset.value.mutables.value.properties.value.propertyList)
                        }
                        let immutableKeys = Object.keys(immutableProperties);
                        let mutableKeys = Object.keys(mutableProperties);
                        GetMetaHelper.AssignMetaValue(immutableKeys, immutableProperties, metasQuery, 'immutable_asset_view', index, "assetViewUrlId");
                        GetMetaHelper.AssignMetaValue(mutableKeys, mutableProperties, metasQuery, 'mutable_asset_view', index, 'assetViewMutableViewUrlId');
                    })
                }
            })
        }
    }, [])
    const handleModalData = (formName, mutableProperties1, asset1, assetOwnerId, ownableId) => {
        setMutateProperties(mutableProperties1)
        setAsset(asset1)
        setOwnerId(assetOwnerId)
        setExternalComponent(formName)
        setOwnableId(ownableId)
    }
    return (
        <div className="content-section">
            <Sidebar/>
            <div className="accountInfo">
                <div className="row">
                    <div className="col-md-9 card-deck">
                        <div className="dropdown-section">
                            <p className="back-arrow" onClick={() => history.push(props.location.state.currentPath)}>
                                <Icon viewClass="arrow-icon" icon="arrow"/> Back</p>
                            <Dropdown>
                                <Dropdown.Toggle id="dropdown-basic">
                                    {t("ACTIONS")}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        onClick={() => handleModalData("DefineAsset")}>{t("DEFINE_ASSET")}
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleModalData("MintAsset")}>{t("MINT_ASSET")}
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleModalData("Wrap")}>{t("WRAP")}
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleModalData("UnWrap")}>{t("UN_WRAP")}
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                        </div>

                        {props.location.state.splitList.length ?
                            props.location.state.splitList.map((split, index) => {
                                    const ownableID = GetIDHelper.GetIdentityOwnableId(split)
                                    let ownableId = split.value.id.value.ownableID.value.idString;
                                    let ownerId = split.value.id.value.ownerID.value.idString;
                                    if (ownableID === props.location.state.assetID) {
                                        return (
                                            <div className="list-container view-container" key={index}>
                                                <div className="row card-deck">
                                                    {
                                                        assetList.map((asset, index) => {
                                                            let immutableProperties = "";
                                                            let mutableProperties = "";

                                                            if (asset.value.immutables.value.properties.value.propertyList !== null) {
                                                                immutableProperties = PropertyHelper.ParseProperties(asset.value.immutables.value.properties.value.propertyList);
                                                            }
                                                            if (asset.value.mutables.value.properties.value.propertyList !== null) {
                                                                mutableProperties = PropertyHelper.ParseProperties(asset.value.mutables.value.properties.value.propertyList)
                                                            }
                                                            let immutableKeys = Object.keys(immutableProperties);
                                                            let mutableKeys = Object.keys(mutableProperties);
                                                            return (
                                                                <div className="row" key={index}>
                                                                    <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                                                                        {immutableKeys !== null ?
                                                                            immutableKeys.map((keyName, index1) => {
                                                                                if (immutableProperties[keyName] !== "") {
                                                                                    if (keyName === config.URI) {
                                                                                        return (
                                                                                            <div
                                                                                                className="dummy-image image-sectiont"
                                                                                                key={index1}>
                                                                                                <div
                                                                                                    id={`assetViewUrlId` + index + `${index1}`}>

                                                                                                </div>
                                                                                            </div>
                                                                                        )

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
                                                                                                    id={`assetViewMutableViewUrlId` + index + `${index1}`}>

                                                                                                </div>
                                                                                            </div>
                                                                                        )

                                                                                    }
                                                                                }
                                                                            })
                                                                            : ""
                                                                        }
                                                                        <div className="button-group property-actions">
                                                                            <Button variant="primary" size="sm"
                                                                                    onClick={() => handleModalData("MutateAsset", mutableProperties, asset)}>{t("MUTATE_ASSET")}
                                                                            </Button>
                                                                            <Button variant="primary" size="sm"
                                                                                    onClick={() => handleModalData("BurnAsset", "", asset, ownerId, ownableID)}>{t("BURN_ASSET")}
                                                                            </Button>
                                                                            <Button variant="primary" size="sm"
                                                                                    onClick={() => handleModalData("MakeOrder", "", "", ownerId, ownableID)}>{t("MAKE")}</Button>
                                                                            <Button variant="primary" size="sm"
                                                                                    onClick={() => handleModalData("SendSplit", "", "", ownerId, ownableID)}>{t("SEND_SPLITS")}</Button>
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className="col-xl-8 col-lg-8 col-md-12 col-sm-12 asset-data">
                                                                        <div className="row">
                                                                            <div
                                                                                className="col-xl-6 col-lg-6 col-md-12">
                                                                                <div className="list-item">
                                                                                <p className="list-item-label">{t("ASSET_ID")}</p>
                                                                                <div className="list-item-value id-section">
                                                                                    <div className="flex">
                                                                                        <p className="id-string"
                                                                                           title={ownableId}> {ownableId}</p>

                                                                                    </div>
                                                                                </div>
                                                                                    <Copy
                                                                                        id={ownableId}/>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="row">
                                                                            <div
                                                                                className="col-xl-6 col-lg-6 col-md-12">
                                                                                <div className="list-item">
                                                                                <p className="list-item-label">{t("OWNER_ID")}</p>
                                                                                <div className="list-item-value id-section">
                                                                                    <div className="flex">
                                                                                        <p className="id-string"
                                                                                           title={ownerId}> {ownerId}</p>

                                                                                    </div>
                                                                                </div>
                                                                                    <Copy
                                                                                        id={ownerId}/>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="row property-section">
                                                                            <div
                                                                                className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                                                                <p className="sub-title">{t("IMMUTABLES")}</p>
                                                                                {immutableKeys !== null ?
                                                                                    immutableKeys.map((keyName, index1) => {
                                                                                        if (immutableProperties[keyName] !== "" && keyName !== 'style' && keyName !== config.URI) {
                                                                                            return (
                                                                                                <div key={index + keyName}
                                                                                                     className="list-item">
                                                                                                    <p
                                                                                                        className="list-item-label">{keyName} </p>
                                                                                                    <p
                                                                                                        id={`immutable_asset_view` + index + index1}
                                                                                                        className="list-item-value"></p>
                                                                                                </div>)
                                                                                        } else if(keyName !== 'style' && keyName !== config.URI){
                                                                                            return (
                                                                                                <div key={index + keyName}
                                                                                                     className="list-item">
                                                                                                    <p
                                                                                                        className="list-item-label">{keyName} </p>
                                                                                                    <p
                                                                                                        className="list-item-hash-value">{immutableProperties[keyName]}</p>
                                                                                                </div>)
                                                                                        }
                                                                                    })
                                                                                    : ""
                                                                                }
                                                                            </div>
                                                                            <div
                                                                                className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                                                                <p className="sub-title">{t("MUTABLES")}</p>
                                                                                {mutableKeys !== null ?
                                                                                    mutableKeys.map((keyName, index1) => {
                                                                                        if (mutableProperties[keyName] !== ""  && keyName !== config.URI) {
                                                                                            return (
                                                                                                <div key={index + keyName}
                                                                                                     className="list-item">
                                                                                                    <p
                                                                                                        className="list-item-label">{keyName} </p>
                                                                                                    <p
                                                                                                        id={`mutable_asset_view` + index + index1}
                                                                                                        className="list-item-value"></p>
                                                                                                </div>)
                                                                                        } else if(keyName !== config.URI){
                                                                                            return (
                                                                                                <div key={index + keyName}
                                                                                                     className="list-item">
                                                                                                    <p
                                                                                                        className="list-item-label">{keyName} </p>
                                                                                                    <p
                                                                                                        className="list-item-hash-value">{mutableProperties[keyName]}</p>
                                                                                                </div>)
                                                                                        }
                                                                                    })
                                                                                    : ""
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }


                                                </div>
                                            </div>
                                        )
                                    }
                                }
                            )
                            : ""
                        }
                    </div>
                    <div className="col-md-3 summary-section">
                        <Summary/>
                    </div>
                </div>
            </div>
            <div>
                {externalComponent === 'MutateAsset' ?
                    <MutateAsset setExternalComponent={setExternalComponent} mutatePropertiesList={mutateProperties}
                                 asset={asset}/> :
                    null
                }
                {
                    externalComponent === 'BurnAsset' ?
                        <BurnAsset setExternalComponent={setExternalComponent} ownerId={ownerId}
                                   ownableId={ownableId}/> :
                        null
                }
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
                {externalComponent === 'DefineAsset' ?
                    <Define setExternalComponent={setExternalComponent} ActionName={assetDefine}
                            FormName={'Define Asset'} type={'asset'}/> :
                    null
                }
                {
                    externalComponent === 'MintAsset' ?
                        <MintAsset setExternalComponent={setExternalComponent}/> :
                        null
                }
                {
                    externalComponent === 'Wrap' ?
                        <Wrap setExternalComponent={setExternalComponent} FormName={'Wrap'}/> :
                        null
                }
                {
                    externalComponent === 'UnWrap' ?
                        <UnWrap setExternalComponent={setExternalComponent} FormName={'UnWrap'}/> :
                        null
                }
            </div>
        </div>

    );
})

export default AssetView;
