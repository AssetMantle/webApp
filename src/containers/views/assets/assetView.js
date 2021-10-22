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
import Lightbox from "react-image-lightbox";

const assetDefine = new defineAsset(process.env.REACT_APP_ASSET_MANTLE_API);

const AssetView = React.memo((props) => {
    let history = useHistory();
    const {t} = useTranslation();
    const [assetData, setAssetData] = useState({});
    const [externalComponent, setExternalComponent] = useState("");
    const [ownerId, setOwnerId] = useState("");
    const [ownableId, setOwnableId] = useState("");
    const [mutateProperties, setMutateProperties] = useState({});
    const [asset, setAsset] = useState({});
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (props.location.state !== undefined) {
            setAssetData(props.location.state.assetList);
        }
    }, []);
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
    // let PropertyObject =[];
    // if(assetData.totalData){
    //     const propertyData = JSON.parse(assetData.totalData["propertyName"]);
    //     Object.keys(propertyData).map((property, keyprop) => {
    //         let content = <div className="list-item red" key={keyprop}>
    //             <p
    //                 className="list-item-label">{propertyData[property]['propertyName']} </p>
    //             <p
    //                 className="list-item-value">{propertyData[property]['propertyValue']}</p>
    //         </div>;
    //         PropertyObject.push(content);
    //     });
    // }
    let PropertyObject =[];

    if(assetData.totalData)
    {
        Object.keys(assetData.totalData).map((asset) => {
            if(asset === config.URI){
                const imageExtension = assetData.totalData[asset].substring(assetData.totalData[asset].lastIndexOf('.') + 1);
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
                }else if(imageExtension === "mp4"){
                    ImageData = <div className="image-container">
                        <video className="banner-video" autoPlay playsInline preload="metadata" loop="loop" controls muted src={assetData.totalData[asset]}>
                            <source type="video/webm" src={assetData.totalData[asset]}/>
                            <source type="video/mp4" src={assetData.totalData[asset]}/>
                            <source type="video/ogg" src={assetData.totalData[asset]}/>
                        </video>
                    </div>;
                }


                else {
                    ImageData = <div className="dummy-image image-sectiont asset-image">
                        <img src={assetData.totalData[asset]} alt="image" onClick={()=> setIsOpen(true)}/>
                        {isOpen && (
                            <Lightbox
                                mainSrc={assetData.totalData[asset]}
                                onCloseRequest={() => setIsOpen(false )}
                            />
                        )}
                    </div>;
                }

            }
            let content;
            if(asset === config.URI){
                buttonsData =
                    <div className="button-group property-actions">
                        <Button variant="primary" size="sm" className="button-txn"
                            onClick={() => handleModalData("MutateAsset", assetData.mutableProperties, assetData)}>{t("MUTATE_ASSET")}
                        </Button>
                        <Button variant="primary" size="sm" className="button-txn"
                            onClick={() => handleModalData("BurnAsset", "", asset, assetData.ownerID, assetData.ownableID)}>{t("BURN_ASSET")}
                        </Button>
                        <Button variant="primary" size="sm" className="button-txn"
                            onClick={() => handleModalData("MakeOrder", "", assetData, assetData.ownerID, assetData.ownableID)}>{t("MAKE")}</Button>
                        <Button variant="primary" size="sm" className="button-txn"
                            onClick={() => handleModalData("SendSplit", "", "", assetData.ownerID, assetData.ownableID)}>{t("SEND_SPLITS")}</Button>
                    </div>;
            }else if(asset === "propertyName"){
                const propertyData = JSON.parse(assetData.totalData["propertyName"]);
                Object.keys(propertyData).map((property, keyprop) => {
                    let content = <div key={keyprop}>
                        <div className="list-item red">
                            <p
                                className="list-item-label">{propertyData[property]['propertyName']} </p>
                            <p
                                className="list-item-value">{propertyData[property]['propertyValue']}</p>
                        </div>
                    </div>;
                    PropertyObject.push(content);
                });
            }
            else {
                content =
                    asset !== 'style' && asset !== config.URI ?
                        <div className="list-item">
                            <p
                                className="list-item-label">{asset} </p>
                            <p
                                className="list-item-value">{assetData.totalData[asset]}</p>
                        </div>
                        : "";
                contentData.push(content);

            }
        });
    }

    console.log(PropertyObject, "PropertyObject");

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
                                <div className="row">
                                    <div className="col-xl-5 col-lg-5 col-md-12 col-sm-12 sdfdf">
                                        {ImageData}
                                        {buttonsData}
                                    </div>

                                    <div
                                        className="col-xl-7 col-lg-7 col-md-12 col-sm-12 asset-data">
                                        <>
                                            <div className="list-item">
                                                <p className="list-item-label">{t("ASSET_ID")}</p>
                                                <div className="list-item-value id-section">
                                                    <div className="flex">
                                                        <p className="id-string"
                                                            title={assetData.ownableID}> {assetData.ownableID}</p>

                                                    </div>
                                                    <Copy
                                                        id={assetData.ownableID}/>
                                                </div>

                                            </div>
                                            <div className="list-item">
                                                <p className="list-item-label">{t("OWNER_ID")}</p>
                                                <div className="list-item-value id-section">
                                                    <div className="flex">
                                                        <p className="id-string"
                                                            title={assetData.ownerID}> {assetData.ownerID}</p>

                                                    </div>
                                                    <Copy
                                                        id={assetData.ownerID}/>
                                                </div>

                                            </div>
                                        </>
                                        {contentData}

                                        <p className="sub-title">Properties</p>

                                        {PropertyObject}

                                    </div>
                                </div>
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
                            ownableId={ownableId} asset={asset}/> :
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

