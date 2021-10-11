import React from "react";
import {useTranslation} from "react-i18next";
import config from "../../../constants/config.json";
import {useHistory} from "react-router-dom";
import {Button} from "react-bootstrap";
import {useSelector} from 'react-redux';
import loaderImage from "../../../assets/images/loader.svg";

const TotalOrders = React.memo(() => {
    const {t} = useTranslation();
    let history = useHistory();
    const markeOrders = useSelector((state) => state.markePlace.markeOrders);
    const loader = useSelector((state) => state.markePlace.loading);
    const error = useSelector((state) => state.markePlace.error);

    const handleAsset = (id,order) => {
        console.log(id, "order data", order);
        history.push({
            pathname : '/order/view',
            state :{
                orderID : id,
                order:order,
                currentPath : window.location.pathname,
            }
        }
        );
    };

    return (
        <div className="list-container list-container-loader">
            {loader ?
                <div className="loader-container">
                    <img src={loaderImage} alt="loader"/>
                </div>
                : ""
            }
            <div className="row card-deck">
                {markeOrders.length ?
                    markeOrders.map((order, index) => {
                        return(
                            <div className="col-xl-3 col-lg-4 col-md-6  col-sm-12" key={index}>
                                <div className="card order-card">
                                    <div className="info-section">
                                        {
                                            Object.keys(order['totalData']).map(key => {
                                                let imageExtension;
                                                if(key === config.URI){
                                                    imageExtension = order['totalData'][key].substring(order['totalData'][key].lastIndexOf('.') + 1);
                                                }
                                                return (
                                                    <>
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
                                                                    <div className="image-container">
                                                                        <div className="assetImage">
                                                                            <img src={order['totalData'][key]} alt="image"/>
                                                                        </div>
                                                                    </div>
                                                                : ""
                                                        }

                                                        {
                                                            key === "identifier" || key === "type" ?
                                                                <div className="list-item"><p
                                                                    className="list-item-label">{key}: </p> <p
                                                                    className="list-item-value">{order['totalData'][key]}</p>
                                                                </div>
                                                                : ""
                                                        }

                                                        <Button variant="primary" className="viewButton" size="sm"
                                                            onClick={() => handleAsset(order['orderID'], order)}>View</Button>
                                                    </>

                                                );
                                            })
                                        }
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
            </div>

        </div>
    );
});
TotalOrders.displayName = 'TotalOrders';
export default TotalOrders;
