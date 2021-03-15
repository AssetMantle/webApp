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
import Loader from "../../../components/loader"
import {Button, Dropdown} from "react-bootstrap";
import Icon from "../../../icons";
import {BurnAsset, MintAsset, MutateAsset, SendSplit, UnWrap, Wrap} from "../../forms/assets";
import {MakeOrder} from "../../forms/orders";
import {Define} from "../../forms";
import AssetDefineJS from "persistencejs/transaction/assets/define";
import ChainInfo from "../../../components/ChainInfo";

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
                        setLoader(false)
                    })
                }else {
                    setLoader(false)
                }
            })
        }else {
            setLoader(false)
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
            {loader ?
                <Loader/>
                : ""
            }
            <div className="accountInfo">
                <div className="row">
                    <div className="col-md-9 card-deck">
                        <div className="dropdown-section">
                            <div className="container">
                            <p className="back-arrow" onClick={() => history.push(props.location.state.currentPath)}>
                                <Icon viewClass="arrow-icon" icon="arrow"/> Back</p>
                                <Button className="dropdown-button" onClick={() => handleModalData("MintAsset")}>{t("MINT_ASSET")}</Button>
                            </div>
                        </div>

                        {props.location.state.splitList.length ?
                            props.location.state.splitList.map((split, index) => {
                                    const ownableID = GetIDHelper.GetIdentityOwnableId(split)
                                    let ownableId = split.value.id.value.ownableID.value.idString;
                                    let ownerId = split.value.id.value.ownerID.value.idString;
                                    if (ownableID === props.location.state.assetID) {
                                        return (
                                            <div className="list-container view-container container" key={index}>
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
                                                            console.log(mutableKeys, "immutable keys in asse view")
                                                            return (
                                                                <div className="row flex-start" key={index}>
                                                                    <div className="col-xl-5 col-lg-5 col-md-6 col-sm-12 asset-image">
                                                                        {immutableKeys !== null ?
                                                                            immutableKeys.map((keyName, index1) => {
                                                                                if (immutableProperties[keyName] !== "") {
                                                                                    if (keyName === config.URI) {
                                                                                        return (
                                                                                            <div
                                                                                                className="dummy-image image-sectiont"
                                                                                                key={index1}>
                                                                                                <div
                                                                                                    id={`assetViewUrlId` + index + `${index1}`} className="inner-image-box">

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

                                                                    </div>
                                                                    <div className="col-xl-7 col-lg-7 col-md-6 col-sm-12 asset-data">
                                                                        <div className="property-section">
                                                                            <div>
                                                                                {immutableKeys !== null ?
                                                                                    immutableKeys.map((keyName, index1) => {
                                                                                        if (immutableProperties[keyName] !== "" && keyName !== 'style' && keyName !== config.URI) {
                                                                                            if(keyName === "identifier"){
                                                                                                return (<div key={index + keyName}
                                                                                                             className="card-view-list">
                                                                                                    <p
                                                                                                        id={`immutable_asset_view` + index + index1}
                                                                                                        className="card-view-value title"></p></div>)
                                                                                            }
                                                                                            else if(keyName === "description"){
                                                                                                return (<div key={index + keyName}
                                                                                                             className="card-view-list">
                                                                                                    <p
                                                                                                        id={`immutable_asset_view` + index + index1}
                                                                                                        className="card-view-value description"></p></div>)
                                                                                            }
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
                                                                            <div>
                                                                                {mutableKeys !== null ?
                                                                                    mutableKeys.map((keyName, index1) => {
                                                                                        if (mutableProperties[keyName] !== "") {
                                                                                            if(keyName === "ArtistName") {
                                                                                                return (<div key={index + keyName}
                                                                                                             className="card-view-list">
                                                                                                    <p className="card-view-value author"
                                                                                                       id={`mutable_asset_view` + index + index1}></p>
                                                                                                </div>)
                                                                                            }
                                                                                            else if(keyName === "style"){
                                                                                                return (<div key={index + keyName} className="list-item"><p
                                                                                                    className="list-item-label"></p> <p
                                                                                                    id={`mutable_order_view` + index + `${index1}`}
                                                                                                    className="list-item-value"></p></div>)
                                                                                            }
                                                                                            else if(keyName === config.URI){
                                                                                                return (<div key={index + keyName} className="list-item"><p
                                                                                                    className="list-item-label"></p> <p
                                                                                                    id={`mutable_order_view` + index + `${index1}`}
                                                                                                    className="list-item-value"></p></div>)
                                                                                            }
                                                                                        } else {
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
                                                                            <div className="button-group property-actions">
                                                                                {/*<Button variant="primary" size="sm"*/}
                                                                                {/*        onClick={() => handleModalData("MutateAsset", mutableProperties, asset)}>{t("MUTATE_ASSET")}*/}
                                                                                {/*</Button>*/}
                                                                                {/*<Button variant="primary" size="sm"*/}
                                                                                {/*        onClick={() => handleModalData("BurnAsset", "", asset, ownerId, ownableID)}>{t("BURN_ASSET")}*/}
                                                                                {/*</Button>*/}
                                                                                <Button variant="primary" size="sm" className="button-large"
                                                                                        onClick={() => handleModalData("MakeOrder", "", "", ownerId, ownableID)}>{t("MAKE")}</Button>
                                                                                {/*<Button variant="primary" size="sm"*/}
                                                                                {/*        onClick={() => handleModalData("SendSplit", "", "", ownerId, ownableID)}>{t("SEND_SPLITS")}</Button>*/}
                                                                            </div>
                                                                            <ChainInfo/>
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
