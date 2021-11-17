import React from "react";
import {useTranslation} from "react-i18next";
import config from "../../../constants/config.json";
import {useHistory} from "react-router-dom";
import {useSelector} from 'react-redux';
import loaderImage from "../../../assets/images/loader.svg";
import base64url from "base64url";
import {Button} from "react-bootstrap";
import Search from "./Search";

const TotalOrders = () => {
    const {t} = useTranslation();
    let history = useHistory();
    const markeOrders = useSelector((state) => state.markePlace.markeOrders);
    const loader = useSelector((state) => state.markePlace.loading);
    const error = useSelector((state) => state.markePlace.error);
    const searchResult = useSelector((state) => state.search.empty);
    const marketOrdersCopy = useSelector((state) => state.search.marketOrdersCopy);
    const searchError = useSelector((state) => state.search.errorData);
    const filterOrders = useSelector((state) => state.filterOrders.empty);
    const filterOrdersList = useSelector((state) => state.filterOrders.filterOrders);

    const searchMultiSearch = useSelector((state) => state.search.multiSearch);
    const filterMutliSearch = useSelector((state) => state.filterOrders.multiSearch);


    let ordersList;
    if(searchResult && filterOrders){
        ordersList = markeOrders;
    }else if(searchResult && !filterOrders || filterMutliSearch){
        ordersList = filterOrdersList;
    }else if(!searchResult && filterOrders || searchMultiSearch){
        ordersList = marketOrdersCopy;
    }else {
        ordersList = marketOrdersCopy;
    }

    const handleAsset = (id, orderID) => {
        history.push({
            pathname: `/view/${id}`,
            orderID: orderID
        });
    };

    return (
        <div className="page-body">
            <div className="list-container list-container-loader container">
                {loader ?
                    <div className="loader-container">
                        <img src={loaderImage} alt="loader"/>
                    </div>
                    : ""
                }
                <Search/>

                <div className="row card-deck">

                    {ordersList.length ?
                        ordersList.map((order, index) => {
                            return (
                                <div className="col-xl-3 col-lg-4 col-md-6  col-sm-12" key={index}>
                                    <div className="card order-card"
                                        onClick={() => handleAsset(order['encodedOrderID'], order['orderID'], order)}>
                                        <div className="info-section">
                                            {
                                                Object.keys(order['totalData']).map((key, keyIndex) => {
                                                    let imageExtension;
                                                    if (key === config.URI) {
                                                        imageExtension = order['totalData'][key].substring(order['totalData'][key].lastIndexOf('.') + 1);
                                                    }
                                                    return (
                                                        <div key={index+keyIndex}>
                                                            {
                                                                key === config.URI ?
                                                                    imageExtension === "gltf" ?
                                                                        <div className="image-container">
                                                                            <model-viewer
                                                                                id="mv-astronaut"
                                                                                src={order['totalData'][key]}
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
                                                                                    src={order['totalData'][key]}>
                                                                                    <source type="video/webm"
                                                                                        src={order['totalData'][key]}/>
                                                                                    <source type="video/mp4"
                                                                                        src={order['totalData'][key]}/>
                                                                                    <source type="video/ogg"
                                                                                        src={order['totalData'][key]}/>
                                                                                </video>
                                                                            </div>
                                                                            : <div className="image-container">
                                                                                <div className="assetImage">
                                                                                    <img src={order['totalData'][key]}
                                                                                        alt="image"/>
                                                                                </div>
                                                                            </div>
                                                                    : ""
                                                            }

                                                            {
                                                                key === "name" ?
                                                                    <div className="list-item"><p
                                                                        className="list-item-label">{key} </p> <p
                                                                        className="list-item-value">{base64url.decode(order['totalData'][key])}</p>
                                                                    </div>
                                                                    : ""
                                                            }
                                                        </div>

                                                    );
                                                })
                                            }
                                            {
                                                order['exChangeRate'] ?
                                                    <div className="list-item"><p
                                                        className="list-item-label">Price </p> <p
                                                        className="list-item-value">{order['exChangeRate']}</p>
                                                    </div>
                                                    : ""
                                            }
                                            <Button variant="primary" className="viewButton" size="sm"
                                                onClick={() => handleAsset(order['encodedOrderID'], order['orderID'], order)}>View</Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                        : ""
                    }
                    {
                        error !== '' ?
                            <p className="empty-list">{t("ORDERS_NOT_FOUND")}</p>
                            : ""
                    }
                    {
                        searchError !== '' ?
                            <p className="empty-list">{t("RESULT_NOT_FOUND")}</p>
                            : ""
                    }
                </div>

            </div>
        </div>
    );
};
export default TotalOrders;
