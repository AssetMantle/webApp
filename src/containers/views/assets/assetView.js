import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import config from "../../../constants/config.json";
import {Accordion, Button, Card} from "react-bootstrap";
import {BurnAsset, MintAsset, MutateAsset, SendSplit, UnWrap, Wrap} from "../../forms/assets";
import {MakeOrder} from "../../forms/orders";
import {Define} from "../../forms";
import {defineAsset} from "mantlejs/build/transaction/assets/define";
import "@google/model-viewer/dist/model-viewer";
import Lightbox from "react-image-lightbox";
import Icon from "../../../icons";
import Copy from "../../../components/copy";
import base64url from "base64url";

const assetDefine = new defineAsset(process.env.REACT_APP_ASSET_MANTLE_API);

const AssetView = (props) => {
    const {t} = useTranslation();
    const [assetData, setAssetData] = useState({});
    const [externalComponent, setExternalComponent] = useState("");
    const [ownerId, setOwnerId] = useState("");
    const [ownableId, setOwnableId] = useState("");
    const [mutateProperties, setMutateProperties] = useState({});
    const [asset, setAsset] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);

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
    let PropertyObject = [];
    let assetName;
    let assetCategory;
    let sellButton;
    let burnButton;
    let assetDescription;

    if (assetData.totalData) {
        Object.keys(assetData.totalData).map((asset) => {
            if (asset === config.URI) {
                const imageExtension = assetData.totalData[asset].substring(assetData.totalData[asset].lastIndexOf('.') + 1);
                if (imageExtension === "glb") {
                    ImageData = <div className="dummy-image image-sectiont asset-view-modal-viewer">
                        <model-viewer
                            id="mv-astronaut"
                            src={assetData.totalData[asset]}
                            camera-controls
                            ar
                            auto-rotate
                            alt="A 3D model of an astronaut"
                        >
                        </model-viewer>
                    </div>;
                } else if (imageExtension === "mp4") {
                    ImageData = <div className="image-container">
                        <video className="banner-video" autoPlay playsInline preload="metadata" loop="loop" controls
                            muted src={assetData.totalData[asset]}>
                            <source type="video/webm" src={assetData.totalData[asset]}/>
                            <source type="video/mp4" src={assetData.totalData[asset]}/>
                            <source type="video/ogg" src={assetData.totalData[asset]}/>
                        </video>
                    </div>;
                } else {
                    ImageData = <div className="dummy-image image-container asset-image">
                        <img src={assetData.totalData[asset]} alt="image" onClick={() => setIsOpen(true)}/>
                        {isOpen && (
                            <Lightbox
                                mainSrc={assetData.totalData[asset]}
                                onCloseRequest={() => setIsOpen(false)}
                            />
                        )}
                    </div>;
                }

            }
            if (asset === config.URI) {
                burnButton = <button className="icon-bg-button" title="Delete NFT"
                    onClick={() => handleModalData("BurnAsset", "", asset, assetData.ownerID, assetData.ownableID)}>
                    <Icon
                        viewClass="info"
                        icon="delete"/>
                </button>;
                sellButton = <Button variant="primary" size="sm" className="button-txn action-button"
                    onClick={() => handleModalData("MakeOrder", "", assetData, assetData.ownerID, assetData.ownableID)}>{t("MAKE")}</Button>;
            } else if (asset === "propertyName") {
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
            } else if (asset === "name") {
                assetName = <p className="asset-name">{base64url.decode(assetData.totalData[asset])}</p>;
            } else if (asset === "category") {
                assetCategory = <p className="asset-category">{base64url.decode(assetData.totalData[asset])}</p>;
            } else if (asset === "description") {
                assetDescription = <p className="asset-description">{base64url.decode(assetData.totalData[asset])}</p>;
            }
        });
    }

    const accordionHandler = () => {
        setIsAccordionOpen(!isAccordionOpen);
    };
    return (
        <div className="page-body asset-view-body">
            <div className="container">
                <div className="accountInfo">
                    <div className="row">
                        <div className="list-container view-container">
                            <div className="row card-deck">
                                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                    <div className="image-section">
                                        {ImageData}
                                    </div>
                                    <Accordion className="details-accordion">
                                        <Card>
                                            <Accordion.Toggle as={Card.Header} onClick={accordionHandler} eventKey="0">
                                                <div className="accordion-header">
                                                    <p className="sub-title">Details</p>
                                                    {isAccordionOpen ?
                                                        <Icon
                                                            viewClass="arrow-right"
                                                            icon="up-arrow"/>
                                                        :
                                                        <Icon
                                                            viewClass="arrow-right"
                                                            icon="down-arrow"/>}
                                                </div>
                                            </Accordion.Toggle>
                                            <Accordion.Collapse eventKey="0">
                                                <Card.Body>
                                                    <div className="list-item">
                                                        <p className="list-item-label">{t("ASSET_ID")}</p>
                                                        <div className="list-item-value id-section">
                                                            <div className="flex">
                                                                <Copy
                                                                    id={assetData.ownableID}/>
                                                            </div>

                                                        </div>

                                                    </div>
                                                    <div className="list-item">
                                                        <p className="list-item-label">Creator ID </p>
                                                        <div className="list-item-value id-section">
                                                            <div className="flex">
                                                                <Copy
                                                                    id={assetData.ownerID}/>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                    </Accordion>
                                </div>

                                <div
                                    className="col-xl-6 col-lg-6 col-md-12 col-sm-12 asset-data">
                                    {assetCategory}
                                    {assetName}
                                    {assetDescription}

                                    {sellButton}
                                    {burnButton}
                                    <div className="properties-container">
                                        <div className="header">
                                            <p className="sub-title">Properties</p>
                                        </div>
                                        <div className="body">
                                            {PropertyObject}
                                        </div>
                                    </div>
                                </div>
                            </div>
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
        </div>
    );
};

export default AssetView;

