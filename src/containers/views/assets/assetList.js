import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Button} from "react-bootstrap";
import config from "../../../constants/config.json";
import {MakeOrder} from "../../forms/orders";
import {SendSplit} from "../../forms/assets";
import {useSelector} from "react-redux";
import loaderImage from "../../../assets/images/loader.svg";
import base64url from "base64url";

const AssetList = React.memo(() => {
    const {t} = useTranslation();
    let history = useHistory();
    const assetList = useSelector((state) => state.assets.assetList);
    const loader = useSelector((state) => state.assets.loading);
    const error = useSelector((state) => state.assets.error);

    const [externalComponent, setExternalComponent] = useState("");
    const [ownerId, setOwnerId] = useState("");
    const [ownableId, setOwnableId] = useState("");


    const handleModalData = (formName, assetOwnerId, ownableId) => {
        setOwnerId(assetOwnerId);
        setExternalComponent(formName);
        setOwnableId(ownableId);
    };

    const handleAsset = (assetid, asset) => {
        if (assetid !== "stake") {
            history.push({
                pathname: '/asset/view',
                state: {
                    assetID: assetid,
                    currentPath: window.location.pathname,
                    assetList: asset
                }
            }
            );
        }
    };
    console.log(assetList, "assetList");
    return (
        <div className="page-body">
            <div className="list-container list-container-loader">
                {loader ?
                    <div className="loader-container">
                        <img src={loaderImage} alt="loader"/>
                    </div>
                    : ""
                }
                <div className="row card-deck">
                    {assetList.length ?
                        assetList.map((asset, index) => {
                            return (
                                <div className="col-xl-3 col-lg-4 col-md-6  col-sm-12" key={index}>
                                    <div className="card asset-card"
                                        onClick={() => handleAsset(asset['ownableID'], asset)}>
                                        <div className="info-section">
                                            {
                                                Object.keys(asset['totalData']).map((key, keyIndex) => {
                                                    let imageExtension;
                                                    if (key === config.URI) {
                                                        imageExtension = asset['totalData'][key].substring(asset['totalData'][key].lastIndexOf('.') + 1);
                                                    }

                                                    return (
                                                        <div key={index+keyIndex}>
                                                            {
                                                                key === config.URI ?
                                                                    imageExtension === "gltf" ?
                                                                        <div className="image-container">
                                                                            <model-viewer
                                                                                id="mv-astronaut"
                                                                                src={asset['totalData'][key]}
                                                                                camera-controls
                                                                                ar
                                                                                auto-rotate
                                                                                alt="A 3D model of an astronaut"
                                                                            >
                                                                            </model-viewer>
                                                                        </div>
                                                                        :
                                                                        imageExtension === "mp4" ?
                                                                            <div className="image-container">
                                                                                <video className="banner-video" autoPlay
                                                                                    playsInline preload="metadata"
                                                                                    loop="loop"
                                                                                    muted
                                                                                    src={asset['totalData'][key]}>
                                                                                    <source type="video/webm"
                                                                                        src={asset['totalData'][key]}/>
                                                                                    <source type="video/mp4"
                                                                                        src={asset['totalData'][key]}/>
                                                                                    <source type="video/ogg"
                                                                                        src={asset['totalData'][key]}/>
                                                                                </video>
                                                                            </div>
                                                                            : <div className="image-container">
                                                                                <div className="assetImage">
                                                                                    <img src={asset['totalData'][key]}
                                                                                        alt="image"/>
                                                                                </div>
                                                                            </div>
                                                                    : ""
                                                            }
                                                            {
                                                                key === "name" || key === "category" ?
                                                                    <div className="list-item"><p
                                                                        className="list-item-label">{key} </p> <p
                                                                        className="list-item-value">{base64url.decode(asset['totalData'][key])}</p>
                                                                    </div>
                                                                    : ""
                                                            }
                                                        </div>
                                                    );
                                                })
                                            }
                                            {asset['ownableID'] === "stake" ?
                                                <div className="button-group">
                                                    <Button variant="primary" size="sm"
                                                        onClick={() => handleModalData("MakeOrder", asset['ownerID'], asset['ownableID'])}>{t("MAKE")}</Button>
                                                    <Button variant="primary" size="sm"
                                                        onClick={() => handleModalData("SendSplit", asset['ownerID'], asset['ownableID'])}>{t("SEND_SPLITS")}</Button>
                                                </div>
                                                : ""
                                            }

                                            {asset['ownableID'] !== "stake" ?
                                                <Button variant="primary" className="viewButton" size="sm"
                                                    onClick={() => handleAsset(asset['ownableID'], asset)}>View</Button>
                                                : ""
                                            }
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                        : ""}

                    {
                        error !== '' ?
                            <p className="empty-list">{t("ASSETS_NOT_FOUND")}</p>
                            : ""
                    }
                </div>
                <div>
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
        </div>
    );
});
AssetList.displayName = 'AssetList';
export default AssetList;

