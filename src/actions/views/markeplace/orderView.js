import React, {useState, useEffect} from "react";
import metasQueryJS from "persistencejs/transaction/meta/query";
import {useTranslation} from "react-i18next";
import Sidebar from "../../../components/sidebar/sidebar";
import {useHistory} from "react-router-dom";
import {Summary} from "../../../components/summary";
import Icon from "../../../icons";
import GetProperty from "../../../utilities/Helpers/getProperty";
import GetMeta from "../../../utilities/Helpers/getMeta";
import config from "../../../constants/config.json";
import GetID from "../../../utilities/Helpers/getID";
import Copy from "../../../components/copy";
import ordersQueryJS from "persistencejs/transaction/orders/query";
import {Button, Dropdown} from "react-bootstrap";
import {CancelOrder, TakeOrder} from "../../forms/orders";
import {Define} from "../../forms";
import ordersDefineJS from "persistencejs/transaction/orders/define";

const ordersQuery = new ordersQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const ordersDefine = new ordersDefineJS(process.env.REACT_APP_ASSET_MANTLE_API)

const OrderView = React.memo((props) => {
    const PropertyHelper = new GetProperty();
    const GetMetaHelper = new GetMeta();
    const GetIDHelper = new GetID();
    const {t} = useTranslation();
    let history = useHistory();
    const [order, setOrder] = useState([]);
    const [orderList, setOrderList] = useState([]);
    const [externalComponent, setExternalComponent] = useState("");
    const [orderId, setOrderId] = useState("");
    useEffect(() => {
        if (props.location.state !== undefined) {
            const ordersData = ordersQuery.queryOrderWithID(props.location.state.orderID)
            ordersData.then(function (item) {
                const ordersData = JSON.parse(item);
                const ordersDataList = ordersData.result.value.orders.value.list;
                if (ordersDataList !== null) {
                    setOrderList(ordersDataList);
                    ordersDataList.map((order, index) => {
                        let immutableProperties = "";
                        let mutableProperties = "";
                        if (order.value.immutables.value.properties.value.propertyList !== null) {
                            immutableProperties = PropertyHelper.ParseProperties(order.value.immutables.value.properties.value.propertyList)
                        }
                        if (order.value.mutables.value.properties.value.propertyList !== null) {
                            mutableProperties = PropertyHelper.ParseProperties(order.value.mutables.value.properties.value.propertyList)
                        }
                        let immutableKeys = Object.keys(immutableProperties);
                        let mutableKeys = Object.keys(mutableProperties);
                        GetMetaHelper.AssignMetaValue(immutableKeys, immutableProperties, metasQuery, 'immutable_order_view', index, "orderViewUrlId");
                        GetMetaHelper.AssignMetaValue(mutableKeys, mutableProperties, metasQuery, 'mutable_order_view', index);
                    })

                }
            })
        }
    }, [])
    const handleModalData = (formName, orderId, order) => {
        setOrderId(orderId)
        setOrder(order);
        setExternalComponent(formName)
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
                        {orderList !== null ?
                            orderList.map((order, index) => {
                                    let immutableProperties = "";
                                    let mutableProperties = "";
                                    if (order.value.immutables.value.properties.value.propertyList !== null) {
                                        immutableProperties = PropertyHelper.ParseProperties(order.value.immutables.value.properties.value.propertyList)
                                    }
                                    if (order.value.mutables.value.properties.value.propertyList !== null) {
                                        mutableProperties = PropertyHelper.ParseProperties(order.value.mutables.value.properties.value.propertyList)
                                    }
                                    let orderId = GetIDHelper.GetOrderID(order);
                                    let classificationID = GetIDHelper.GetClassificationID(order)
                                    let makerOwnableID = GetIDHelper.GetMakerOwnableID(order)
                                    let takerOwnableID = GetIDHelper.GetTakerOwnableID(order)
                                    let makerID = GetIDHelper.GetMakerID(order)
                                    let immutableKeys = Object.keys(immutableProperties);
                                    let mutableKeys = Object.keys(mutableProperties);
                                    return (
                                        <div className="list-container view-container" key={index}>
                                            <div className="row card-deck">
                                                <div className="row">
                                                    <div className="col-xl-4 col-lg-4 col-md-4  col-sm-12">
                                                        {immutableKeys !== null ?
                                                            immutableKeys.map((keyName, index1) => {
                                                                if (immutableProperties[keyName] !== "") {
                                                                    if (keyName === config.URI) {
                                                                        return (
                                                                            <div
                                                                                className="dummy-image image-sectiont"
                                                                                key={index1}>
                                                                                <div
                                                                                    id={`orderViewUrlId` + index + `${index1}`}>

                                                                                </div>
                                                                            </div>
                                                                        )

                                                                    }
                                                                }
                                                            })
                                                            : ""
                                                        }
                                                        <div className="property-actions">
                                                            {props.location.state.currentPath === "/marketplace" ?
                                                                <Button variant="primary" size="sm"
                                                                        onClick={() => handleModalData("TakeOrder", orderId)}>{t("TAKE")}</Button>
                                                                : <Button variant="primary" size="sm"
                                                                          onClick={() => handleModalData("CancelOrder", "" , order)}>{t("CANCEL")}</Button>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="col-xl-8 col-lg-8 col-md-8 col-sm-12 asset-data">
                                                        <div className="row">
                                                            <div className="col-xl-6 col-lg-6 col-md-6">
                                                                <div className="list-item">
                                                                    <p className="list-item-label">{t("ORDER_ID")}:</p>
                                                                    <div className="list-item-value id-section">
                                                                        <div className="flex">
                                                                            <p className="id-string"
                                                                               title={orderId}> {orderId}</p>
                                                                        </div>
                                                                    </div>
                                                                    <Copy
                                                                        id={orderId}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-xl-6 col-lg-6 col-md-6">
                                                                <div className="list-item">
                                                                    <p className="list-item-label">{t("CLASSIFICATION_ID")} :</p>
                                                                    <div className="list-item-value id-section">
                                                                        <div className="flex">
                                                                            <p className="id-string"
                                                                               title={classificationID}> {classificationID}</p>
                                                                        </div>
                                                                    </div>
                                                                    <Copy
                                                                        id={classificationID}/>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="row">
                                                            <div className="col-xl-6 col-lg-6 col-md-6">
                                                                <div className="list-item">
                                                                    <p className="list-item-label">{t("MAKER_OWNABLE_ID")} :</p>
                                                                    <div className="list-item-value id-section">
                                                                        <div className="flex">
                                                                            <p className="id-string"
                                                                               title={makerOwnableID}> {makerOwnableID}</p>
                                                                        </div>
                                                                    </div>
                                                                    <Copy
                                                                        id={makerOwnableID}/>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="row">
                                                            <div className="col-xl-6 col-lg-6 col-md-6">
                                                                <div className="list-item">
                                                                    <p className="list-item-label">{t("TAKER_OWNABLE_ID")} :</p>
                                                                    <div className="list-item-value id-section">
                                                                        <div className="flex">
                                                                            <p className="id-string"
                                                                               title={takerOwnableID}> {takerOwnableID}</p>
                                                                        </div>
                                                                    </div>
                                                                    <Copy
                                                                        id={takerOwnableID}/>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="row">
                                                            <div className="col-xl-6 col-lg-6 col-md-6">
                                                                <div className="list-item">
                                                                    <p className="list-item-label">{t("MAKER_ID")} :</p>
                                                                    <div className="list-item-value id-section">
                                                                        <div className="flex">
                                                                            <p className="id-string"
                                                                               title={makerID}> {makerID}</p>
                                                                        </div>
                                                                    </div>
                                                                    <Copy
                                                                        id={makerID}/>
                                                                </div>
                                                            </div>
                                                        </div>


                                                        <div className="row property-section">
                                                            <div
                                                                className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                                                <p className="sub-title">{t("IMMUTABLES")}</p>
                                                                {immutableKeys !== null ?
                                                                    immutableKeys.map((keyName, index1) => {
                                                                        if (immutableProperties[keyName] !== "") {
                                                                            return (<div key={index + keyName}
                                                                                         className="list-item"><p
                                                                                className="list-item-label">{keyName} </p>
                                                                                <p
                                                                                    id={`immutable_order_view` + index + index1}
                                                                                    className="list-item-value"></p></div>)
                                                                        } else {
                                                                            return (
                                                                                <div key={index + keyName}
                                                                                     className="list-item"><p
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
                                                                className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                                                <p className="sub-title">{t("MUTABLES")}</p>
                                                                {mutableKeys !== null ?
                                                                    mutableKeys.map((keyName, index1) => {
                                                                        if (mutableProperties[keyName] !== "") {
                                                                            return (<div key={index + keyName}
                                                                                         className="list-item"><p
                                                                                className="list-item-label">{keyName} </p>
                                                                                <p className="list-item-value"
                                                                                   id={`mutable_order_view` + index + index1}></p>
                                                                            </div>)
                                                                        } else {
                                                                            return (
                                                                                <div key={index + keyName}
                                                                                     className="list-item"><p
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


                                            </div>
                                        </div>
                                    )
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
})

export default OrderView;
