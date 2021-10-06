import React, {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import Sidebar from "../../../components/sidebar/sidebar";
import {useHistory} from "react-router-dom";
import {Summary} from "../../../components/summary";
import config from "../../../constants/config.json";
import Copy from "../../../components/copy";
import {Button, Dropdown} from "react-bootstrap";
import Icon from "../../../icons";
import {BurnAsset, MintAsset, MutateAsset, SendSplit, UnWrap, Wrap} from "../../forms/assets";
import {MakeOrder} from "../../forms/orders";
import {Define} from "../../forms";
import {defineAsset} from "persistencejs/build/transaction/assets/define";
import "@google/model-viewer/dist/model-viewer";

const assetDefine = new defineAsset(process.env.REACT_APP_ASSET_MANTLE_API);

const AssetView = React.memo((props) => {
    console.log(props.location.state.assetList, "props.location.state.assetList");

    let history = useHistory();
    const {t} = useTranslation();
    const [assetData, setAssetData] = useState({});
    const [externalComponent, setExternalComponent] = useState("");
    const [ownerId, setOwnerId] = useState("");
    const [ownableId, setOwnableId] = useState("");
    const [mutateProperties, setMutateProperties] = useState({});
    const [asset, setAsset] = useState({});

    useEffect(() => {
        if (props.location.state !== undefined) {
            setAssetData(props.location.state.assetList);
            // const filterAssetList = assetsQuery.queryAssetWithID(props.location.state.assetID);
            // filterAssetList.then(function (Asset) {
            //     const parsedAsset = JSON.parse(Asset);
            //     if (parsedAsset.result.value.assets.value.list !== null) {
            //         const assetItems = parsedAsset.result.value.assets.value.list;
            //         setAssetList(assetItems);
            //         assetItems.map((asset, index) => {
            //             let immutableProperties = "";
            //             let mutableProperties = "";
            //             if (asset.value.immutables.value.properties.value.propertyList !== null) {
            //                 immutableProperties = PropertyHelper.ParseProperties(asset.value.immutables.value.properties.value.propertyList);
            //             }
            //             if (asset.value.mutables.value.properties.value.propertyList !== null) {
            //                 mutableProperties = PropertyHelper.ParseProperties(asset.value.mutables.value.properties.value.propertyList);
            //             }
            //             let immutableKeys = Object.keys(immutableProperties);
            //             let mutableKeys = Object.keys(mutableProperties);
            //             GetMetaHelper.AssignMetaValue(immutableKeys, immutableProperties, metasQuery, 'immutable_asset_view', index, "assetViewUrlId");
            //             GetMetaHelper.AssignMetaValue(mutableKeys, mutableProperties, metasQuery, 'mutable_asset_view', index, 'assetViewMutableViewUrlId');
            //         });
            //     }
            // });
        }
    }, []);
    console.log(assetData, "EE");
    const handleModalData = (formName, mutableProperties1, asset1, assetOwnerId, ownableId) => {
        setMutateProperties(mutableProperties1);
        setAsset(asset1);
        setOwnerId(assetOwnerId);
        setExternalComponent(formName);
        setOwnableId(ownableId);
    };
    let ImageData;
    let buttonsData;
    let contentData  = [];
    if(assetData.totalData)
    {
        Object.keys(assetData.totalData).map((asset, index) => {
            if(asset === config.URI){
                const imageExtension = assetData.totalData[asset].substring(assetData.totalData[asset].lastIndexOf('.') + 1);
                console.log(imageExtension, "imageex");
                if(imageExtension === "gltf"){
                    ImageData =  <div className="dummy-image image-sectiont asset-view-modal-viewer">
                        <model-viewer
                            id="mv-astronaut"
                            src={assetData.totalData[asset]}
                            camera-controls
                            ar
                            auto-rotate
                            // ar-modes="webxr scene-viewer quick-look"
                            // ar-scale="auto"
                            // ar-status="not-presenting"
                            // interaction-prompt="none"
                            alt="A 3D model of an astronaut"
                        >
                        </model-viewer>
                    </div>;
                }else {
                    ImageData = <div className="dummy-image image-sectiont">
                        <img src={assetData.totalData[asset]} alt="image"/>
                    </div>;
                }

            }
                
            if(index === 0 ){
                buttonsData = 
                    <div className="button-group property-actions">
                        <Button variant="primary" size="sm"
                            onClick={() => handleModalData("MutateAsset", assetData.mutableProperties, asset)}>{t("MUTATE_ASSET")}
                        </Button>
                        <Button variant="primary" size="sm"
                            onClick={() => handleModalData("BurnAsset", "", asset, assetData.ownerID, assetData.ownableID)}>{t("BURN_ASSET")}
                        </Button>
                        <Button variant="primary" size="sm"
                            onClick={() => handleModalData("MakeOrder", "", "", assetData.ownerID, assetData.ownableID)}>{t("MAKE")}</Button>
                        <Button variant="primary" size="sm"
                            onClick={() => handleModalData("SendSplit", "", "", assetData.ownerID, assetData.ownableID)}>{t("SEND_SPLITS")}</Button>
                    </div>;
            }
            let content =
                <div className="row property-section">
                    <div
                        className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                        {asset !== 'style' && asset !== config.URI ?
                            <div className="list-item">
                                <p
                                    className="list-item-label">{asset} </p>
                                <p
                                    className="list-item-value">{assetData.totalData[asset]}</p>
                            </div>
                            : ""
                        }
                    </div>
                </div>;

            contentData.push(content);
        });
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

                        <div className="list-container view-container">
                            <div className="row card-deck">

                                {/*{*/}
                                {/*    assetData.totalData ?*/}
                                {/*        Object.keys(assetData.totalData).map((asset, index) => {*/}
                                {/*            return (*/}
                                <div className="row">
                                    <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 sdfdf">

                                        {ImageData}
                                        {buttonsData}
                                        {/*{*/}
                                        {/*    index === 0 ?*/}
                                        {/*        <div className="button-group property-actions">*/}
                                        {/*            <Button variant="primary" size="sm"*/}
                                        {/*                onClick={() => handleModalData("MutateAsset", asset.mutableProperties, asset)}>{t("MUTATE_ASSET")}*/}
                                        {/*            </Button>*/}
                                        {/*            <Button variant="primary" size="sm"*/}
                                        {/*                onClick={() => handleModalData("BurnAsset", "", asset, assetData.ownerID, assetData.ownableID)}>{t("BURN_ASSET")}*/}
                                        {/*            </Button>*/}
                                        {/*            <Button variant="primary" size="sm"*/}
                                        {/*                onClick={() => handleModalData("MakeOrder", "", "", assetData.ownerID, assetData.ownableID)}>{t("MAKE")}</Button>*/}
                                        {/*            <Button variant="primary" size="sm"*/}
                                        {/*                onClick={() => handleModalData("SendSplit", "", "", assetData.ownerID, assetData.ownableID)}>{t("SEND_SPLITS")}</Button>*/}
                                        {/*        </div>*/}
                                        {/*        : ""*/}
                                        {/*}*/}
                                                        
                                    </div>
                                    <div
                                        className="col-xl-8 col-lg-8 col-md-12 col-sm-12 asset-data">
                                        
                                        <>
                                            <div className="row">

                                                <div
                                                    className="col-xl-6 col-lg-6 col-md-12">
                                                    <div className="list-item">
                                                        <p className="list-item-label">{t("ASSET_ID")}</p>
                                                        <div className="list-item-value id-section">
                                                            <div className="flex">
                                                                <p className="id-string"
                                                                    title={assetData.ownableID}> {assetData.ownableID}</p>

                                                            </div>
                                                        </div>
                                                        <Copy
                                                            id={assetData.ownableID}/>
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
                                                                    title={assetData.ownerID}> {assetData.ownerID}</p>

                                                            </div>
                                                        </div>
                                                        <Copy
                                                            id={assetData.ownerID}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                   
                                        {contentData}
                                    </div>
                                </div>
                                {/*);*/}
                                {/*})*/}
                                {/*: <p className="empty-list">{t("DATA_FOUND")}</p>*/}
                                {/*}*/}


                            </div>
                        </div>

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
});

export default AssetView;

