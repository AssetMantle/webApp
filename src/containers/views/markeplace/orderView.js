import React, {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import Sidebar from "../../../components/sidebar/sidebar";
import {useHistory} from "react-router-dom";
import {Summary} from "../../../components/summary";
import Icon from "../../../icons";
import config from "../../../constants/config.json";
import Copy from "../../../components/copy";
import {Button, Dropdown} from "react-bootstrap";
import {CancelOrder, TakeOrder} from "../../forms/orders";
import {Define} from "../../forms";
import {defineOrder as ordersDefineJS} from "persistencejs/build/transaction/orders/define";
import Lightbox from "react-image-lightbox";

const ordersDefine = new ordersDefineJS(process.env.REACT_APP_ASSET_MANTLE_API);

const OrderView = React.memo((props) => {

    const {t} = useTranslation();
    let history = useHistory();
    const [order, setOrder] = useState([]);
    const [orderData, setOrderData] = useState([]);
    const [externalComponent, setExternalComponent] = useState("");
    const [orderId, setOrderId] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (props.location.state !== undefined) {
            setOrderData(props.location.state.order);
        }
    }, []);
    const handleModalData = (formName, orderId, order) => {
        setOrderId(orderId);
        setOrder(order);
        setExternalComponent(formName);
    };
    let ImageData;
    let contentMutableData  = [];
    let contentImMutableData  = [];
    if(orderData.mutableProperties)
    {
        Object.keys(orderData.mutableProperties).map((asset) => {
            if(asset === config.URI){
                const imageExtension = orderData.mutableProperties[asset].substring(orderData.mutableProperties[asset].lastIndexOf('.') + 1);
                console.log(imageExtension, "imageex");
                if(imageExtension === "gltf"){
                    ImageData =  <div className="dummy-image image-sectiont asset-view-modal-viewer">
                        <model-viewer
                            id="mv-astronaut"
                            src={orderData.mutableProperties[asset]}
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
                    ImageData = <div className="dummy-image image-sectiont asset-image">
                        <img src={orderData.mutableProperties[asset]} alt="image" onClick={()=> setIsOpen(true)}/>
                        {isOpen && (
                            <Lightbox
                                mainSrc={orderData.mutableProperties[asset]}
                                onCloseRequest={() => setIsOpen(false )}
                            />
                        )}
                    </div>;
                }
            }
            let content =
                asset !== 'style' && asset !== config.URI ?
                    <div className="list-item">
                        <p
                            className="list-item-label">{asset} </p>
                        <p
                            className="list-item-value">{orderData.mutableProperties[asset]}</p>
                    </div>
                    : "";

            contentMutableData.push(content);
        });
    }

    if(orderData.immutableProperties)
    {
        Object.keys(orderData.immutableProperties).map((asset) => {
            if(asset === config.URI){
                const imageExtension = orderData.immutableProperties[asset].substring(orderData.immutableProperties[asset].lastIndexOf('.') + 1);
                console.log(imageExtension, "imageex");
                if(imageExtension === "gltf"){
                    ImageData =  <div className="dummy-image image-sectiont asset-view-modal-viewer">
                        <model-viewer
                            id="mv-astronaut"
                            src={orderData.immutableProperties[asset]}
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
                    ImageData = <div className="dummy-image image-sectiont asset-image">
                        <img src={orderData.immutableProperties[asset]} alt="image" onClick={()=> setIsOpen(true)}/>
                        {isOpen && (
                            <Lightbox
                                mainSrc={orderData.immutableProperties[asset]}
                                onCloseRequest={() => setIsOpen(false )}
                            />
                        )}
                    </div>;
                }
            }
            let content =
                asset !== 'style' && asset !== config.URI ?
                    <div className="list-item">
                        <p
                            className="list-item-label">{asset} </p>
                        <p
                            className="list-item-value">{orderData.immutableProperties[asset]}</p>
                    </div>
                    : "";

            contentImMutableData.push(content);
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
                            {props.location.state.currentPath !== "/marketplace" ?
                                <Dropdown>
                                    <Dropdown.Toggle id="dropdown-basic">
                                        {t("ACTIONS")}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item
                                            onClick={() => handleModalData("DefineOrder")}>{t("DEFINE_ORDER")}</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                : ""
                            }

                        </div>
                     
                                
                        <div className="list-container view-container" >
                            <div className="row card-deck">
                                <div className="row">
                                    <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                                        {ImageData}
                                        <div className="property-actions">
                                            {props.location.state.currentPath === "/marketplace" ?
                                                localStorage.getItem('userName') !== null ?
                                                    <Button variant="primary" size="sm"
                                                        onClick={() => handleModalData("TakeOrder", orderId)}>{t("TAKE")}</Button>
                                                    : ""
                                                : <Button variant="primary" size="sm"
                                                    onClick={() => handleModalData("CancelOrder", "" , order)}>{t("CANCEL")}</Button>
                                            }
                                        </div>
                                    </div>
                                    <div
                                        className="col-xl-8 col-lg-8 col-md-12 col-sm-12 asset-data">
                                        <div className="list-item">
                                            <p className="list-item-label">{t("ORDER_ID")}:</p>
                                            <div className="list-item-value id-section">
                                                <div className="flex">
                                                    <p className="id-string"
                                                        title={orderData.orderID}> {orderData.orderID}</p>
                                                </div>
                                                <Copy
                                                    id={orderId}/>
                                            </div>

                                        </div>
                                        <div className="list-item">
                                            <p className="list-item-label">{t("CLASSIFICATION_ID")} :</p>
                                            <div className="list-item-value id-section">
                                                <div className="flex">
                                                    <p className="id-string"
                                                        title={orderData.classificationID}> {orderData.classificationID}</p>
                                                </div>
                                                <Copy
                                                    id={orderData.classificationID}/>
                                            </div>

                                        </div>

                                        <div className="list-item">
                                            <p className="list-item-label">{t("MAKER_OWNABLE_ID")} :</p>
                                            <div className="list-item-value id-section">
                                                <div className="flex">
                                                    <p className="id-string"
                                                        title={orderData.makerOwnableID}> {orderData.makerOwnableID}</p>
                                                </div>
                                                <Copy
                                                    id={orderData.makerOwnableID}/>
                                            </div>


                                        </div>

                                        <div className="list-item">
                                            <p className="list-item-label">{t("TAKER_OWNABLE_ID")} :</p>
                                            <div className="list-item-value id-section">
                                                <div className="flex">
                                                    <p className="id-string"
                                                        title={orderData.takerOwnableID}> {orderData.takerOwnableID}</p>
                                                </div>
                                                <Copy
                                                    id={orderData.takerOwnableID}/>
                                            </div>

                                        </div>

                                        <div className="list-item">
                                            <p className="list-item-label">{t("MAKER_ID")} :</p>
                                            <div className="list-item-value id-section">
                                                <div className="flex">
                                                    <p className="id-string"
                                                        title={orderData.makerID}> {orderData.makerID}</p>
                                                </div>
                                                <Copy
                                                    id={orderData.makerID}/>
                                            </div>
                                            
                                        </div>

                                        <div
                                            className="">
                                            <p className="sub-title">{t("IMMUTABLES")}</p>
                                            {contentMutableData}

                                        </div>

                                        <div
                                            className="">
                                            <p className="sub-title">{t("MUTABLES")}</p>
                                            {contentImMutableData}

                                        </div>
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
                {externalComponent === 'TakeOrder' ?
                    <TakeOrder setExternalComponent={setExternalComponent} id={orderId} FormName={'Take Order'}/> :
                    null
                }
                {externalComponent === 'CancelOrder' ?
                    <CancelOrder setExternalComponent={setExternalComponent} order={order}/> :
                    null
                }
                {externalComponent === 'DefineOrder' ?
                    <Define setExternalComponent={setExternalComponent} ActionName={ordersDefine}
                        FormName={'Define Order'}/> :
                    null
                }
            </div>
        </div>

    );
});
OrderView.displayName = 'OrderView';
export default OrderView;
