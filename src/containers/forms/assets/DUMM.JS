import React, {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import config from "../../../constants/config.json";
import Copy from "../../../components/copy";
import {Accordion, Button, Card} from "react-bootstrap";
import {CancelOrder, TakeOrder} from "../../forms/orders";
import {Define} from "../../forms";
import {defineOrder as ordersDefineJS} from "persistencejs/build/transaction/orders/define";
import Lightbox from "react-image-lightbox";
import Icon from "../../../icons";
import helper from "../../../utilities/helper";

const ordersDefine = new ordersDefineJS(process.env.REACT_APP_ASSET_MANTLE_API);

const OrderView = React.memo((props) => {

    const {t} = useTranslation();
    const [order, setOrder] = useState([]);
    const [orderData, setOrderData] = useState([]);
    const [externalComponent, setExternalComponent] = useState("");
    const [orderId, setOrderId] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);

    useEffect(() => {
        if (props.location.state !== undefined) {
            console.log(props.location.state, "props.location.state");
            setOrderData(props.location.state.order);
            setOrderId(props.location.state.orderID);
        }
    }, []);
    const handleModalData = (formName, orderId, order) => {
        setOrderId(orderId);
        setOrder(order);
        setExternalComponent(formName);
    };
    const accordionHandler = () =>{
        setIsAccordionOpen(!isAccordionOpen);
    };

    let ImageData;
    let PropertyObject =[];

    let assetName;
    let assetCategory;
    let assetDescription;
    // let buyButton;
    // let mutateButton;
    // let burnButton;
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
    if(orderData.totalData)
    {
        Object.keys(orderData.totalData).map((asset) => {
            if(asset === config.URI){
                const imageExtension = orderData.totalData[asset].substring(orderData.totalData[asset].lastIndexOf('.') + 1);
                console.log(imageExtension, "ima");
                if(imageExtension === "gltf"){
                    ImageData =  <div className="dummy-image image-sectiont asset-view-modal-viewer">
                        <model-viewer
                            id="mv-astronaut"
                            src={orderData.totalData[asset]}
                            camera-controls
                            ar
                            auto-rotate
                            alt="A 3D model of an astronaut"
                        >
                        </model-viewer>
                    </div>;
                }else if(imageExtension === "mp4"){
                    ImageData = <div className="image-container">
                        <video className="banner-video" autoPlay playsInline preload="metadata" loop="loop" controls muted src={orderData.totalData[asset]}>
                            <source type="video/webm" src={orderData.totalData[asset]}/>
                            <source type="video/mp4" src={orderData.totalData[asset]}/>
                            <source type="video/ogg" src={orderData.totalData[asset]}/>
                        </video>
                    </div>;
                }
                else {
                    ImageData = <div className="dummy-image image-sectiont asset-image">
                        <img src={orderData.totalData[asset]} alt="image" onClick={()=> setIsOpen(true)}/>
                        {isOpen && (
                            <Lightbox
                                mainSrc={orderData.totalData[asset]}
                                onCloseRequest={() => setIsOpen(false )}
                            />
                        )}
                    </div>;
                }
            }else if(asset === "propertyName"){
                const propertyData = JSON.parse(orderData.totalData["propertyName"]);
                Object.keys(propertyData).map((property, keyprop) => {
                    let content = <div key={keyprop}>
                        <div className="list-item red">
                            <p
                                className="list-item-label">{helper.stringFilter(propertyData[property]['propertyName'],'//', ',')} </p>
                            <p
                                className="list-item-value">{helper.stringFilter(propertyData[property]['propertyValue'], '//', ',')}</p>
                        </div>
                    </div>;
                    PropertyObject.push(content);
                });
            }
            else if(asset === "name"){
                assetName = <p className="asset-name">{helper.stringFilter(orderData.totalData[asset], '//',',')}</p>;
            }else if(asset === "category"){
                assetCategory = <p className="asset-category">{helper.stringFilter(orderData.totalData[asset], '//',',')}</p>;
            }else if(asset === "description"){
                assetDescription = <p className="asset-description">{helper.stringFilter(orderData.totalData[asset], '//',',')}</p>;
            }
        });
    }

    return (
        <div className="page-body asset-view-body">
            <div className="content-section container">
                <div className="accountInfo">
                    <div className="row">
                        {/*<div className="dropdown-section">*/}
                        {/*    <p className="back-arrow" onClick={() => history.push(props.location.state.currentPath)}>*/}
                        {/*        <Icon viewClass="arrow-icon" icon="arrow"/> Back</p>*/}
                        {/*    {props.location.state.currentPath !== "/marketplace" ?*/}
                        {/*        <Dropdown>*/}
                        {/*            <Dropdown.Toggle id="dropdown-basic">*/}
                        {/*                {t("ACTIONS")}*/}
                        {/*            </Dropdown.Toggle>*/}
                        {/*            <Dropdown.Menu>*/}
                        {/*                <Dropdown.Item*/}
                        {/*                    onClick={() => handleModalData("DefineOrder")}>{t("DEFINE_ORDER")}</Dropdown.Item>*/}
                        {/*            </Dropdown.Menu>*/}
                        {/*        </Dropdown>*/}
                        {/*        : ""*/}
                        {/*    }*/}

                        {/*</div>*/}


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
                                                        <p className="list-item-label">{t("ORDER_ID")}:</p>
                                                        <div className="list-item-value id-section">
                                                            <div className="flex">
                                                                <Copy
                                                                    id={orderId}/>
                                                            </div>
                                                            <Copy
                                                                id={orderId}/>
                                                        </div>

                                                    </div>


                                                    <div className="list-item">
                                                        <p className="list-item-label">{t("MAKER_OWNABLE_ID")} :</p>
                                                        <div className="list-item-value id-section">
                                                            <div className="flex">
                                                                <Copy
                                                                    id={orderData.makerOwnableID}/>
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
                                    {props.location.state.currentPath === "/marketplace" ?
                                        localStorage.getItem('userName') !== null ?
                                            <Button variant="primary" size="sm" className="action-button"
                                                    onClick={() => handleModalData("TakeOrder", orderId)}>{t("TAKE")}</Button>
                                            : ""
                                        :   localStorage.getItem('userName') !== null ?
                                            <Button variant="primary" size="sm" className="action-button"
                                                    onClick={() => handleModalData("CancelOrder", "" , order)}>{t("CANCEL")}</Button>
                                            : ""
                                    }
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
        </div>

    );
});
OrderView.displayName = 'OrderView';
export default OrderView;
