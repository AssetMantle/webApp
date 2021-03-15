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
import ChainInfo from "../../../components/ChainInfo";
import ordersDefineJS from "persistencejs/transaction/orders/define";
import assetsQueryJS from "persistencejs/transaction/assets/query";
import Loader from "../../../components/loader";

const ordersQuery = new ordersQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const ordersDefine = new ordersDefineJS(process.env.REACT_APP_ASSET_MANTLE_API)
const assetsQuery = new assetsQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const OrderView = React.memo((props) => {
    const PropertyHelper = new GetProperty();
    const GetMetaHelper = new GetMeta();
    const GetIDHelper = new GetID();
    const {t} = useTranslation();
    let history = useHistory();
    const [order, setOrder] = useState([]);
    const [loader, setLoader] = useState(true)
    const [exchangeRate, setExchangeRate] = useState('');
    const [assetList, setAssetList] = useState([]);
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

                        let classificationID = GetIDHelper.GetClassificationID(order);
                        if (classificationID === config.OrderClassificationID) {
                            let mutableOrderProperties = "";
                            if (order.value.mutables.value.properties.value.propertyList !== null) {
                                mutableOrderProperties = PropertyHelper.ParseProperties(order.value.mutables.value.properties.value.propertyList)
                            }
                            let mutableOrderKeys = Object.keys(mutableOrderProperties);
                            GetMetaHelper.AssignMetaValue(mutableOrderKeys, mutableOrderProperties, metasQuery, 'mutable_orderPrice_view', index, "");
                            let makerID = GetIDHelper.GetMakerOwnableID(order);
                            const filterAssetList = assetsQuery.queryAssetWithID(makerID);
                            filterAssetList.then(function (Asset) {
                                const parsedAsset = JSON.parse(Asset);

                                if (parsedAsset.result.value.assets.value.list !== null) {
                                    const assetId = GetIDHelper.GetAssetID(parsedAsset.result.value.assets.value.list[0]);

                                    setAssetList(assetList => [...assetList, parsedAsset]);
                                    let immutableProperties = "";
                                    let mutableProperties = "";
                                    if (parsedAsset.result.value.assets.value.list[0].value.immutables.value.properties.value.propertyList !== null) {
                                        immutableProperties = PropertyHelper.ParseProperties(parsedAsset.result.value.assets.value.list[0].value.immutables.value.properties.value.propertyList);
                                    }
                                    if (parsedAsset.result.value.assets.value.list[0].value.mutables.value.properties.value.propertyList !== null) {
                                        mutableProperties = PropertyHelper.ParseProperties(parsedAsset.result.value.assets.value.list[0].value.mutables.value.properties.value.propertyList)
                                    }

                                    let immutableKeys = Object.keys(immutableProperties);
                                    let mutableKeys = Object.keys(mutableProperties);
                                    GetMetaHelper.AssignMetaValue(immutableKeys, immutableProperties, metasQuery, 'immutable_order_view', index, "orderViewUrlId");
                                    GetMetaHelper.AssignMetaValue(mutableKeys, mutableProperties, metasQuery, 'mutable_order_view', index, 'orderViewMutableViewUrlId');
                                    setLoader(false)
                                }else {
                                    setLoader(false)
                                }
                            })
                        }
                        else {
                            setLoader(false)
                        }
                    });

                    //
                    // ordersDataList.map((order, index) => {
                    //     let immutableProperties = "";
                    //     let mutableProperties = "";
                    //     if (order.value.immutables.value.properties.value.propertyList !== null) {
                    //         immutableProperties = PropertyHelper.ParseProperties(order.value.immutables.value.properties.value.propertyList)
                    //     }
                    //     if (order.value.mutables.value.properties.value.propertyList !== null) {
                    //         mutableProperties = PropertyHelper.ParseProperties(order.value.mutables.value.properties.value.propertyList)
                    //     }
                    //     let immutableKeys = Object.keys(immutableProperties);
                    //     let mutableKeys = Object.keys(mutableProperties);
                    //     GetMetaHelper.AssignMetaValue(immutableKeys, immutableProperties, metasQuery, 'immutable_order_view', index, "orderViewUrlId");
                    //     GetMetaHelper.AssignMetaValue(mutableKeys, mutableProperties, metasQuery, 'mutable_order_view', index, 'orderViewMutableViewUrlId');
                    // })

                }
                else {
                    setLoader(false)
                }
            })
        }
        else {
            setLoader(false)
        }
    }, [])
    const handleModalData = (formName, orderId, order) => {
        setOrderId(orderId)
        setOrder(order);
        setExternalComponent(formName)
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
                                <p className="back-arrow"
                                   onClick={() => history.push(props.location.state.currentPath)}>
                                    <Icon viewClass="arrow-icon" icon="arrow"/> Back</p>
                                {/*{props.location.state.currentPath !== "/marketplace" ?*/}
                                {/*    <Dropdown>*/}
                                {/*        <Dropdown.Toggle id="dropdown-basic">*/}
                                {/*            {t("ACTIONS")}*/}
                                {/*        </Dropdown.Toggle>*/}
                                {/*        <Dropdown.Menu>*/}
                                {/*            <Dropdown.Item*/}
                                {/*                onClick={() => handleModalData("DefineOrder")}>{t("DEFINE_ORDER")}</Dropdown.Item>*/}
                                {/*        </Dropdown.Menu>*/}
                                {/*    </Dropdown>*/}
                                {/*: ""*/}
                                {/*}*/}
                            </div>
                        </div>
                        {orderList !== null ?
                            orderList.map((order, index) => {
                                let makerID = GetIDHelper.GetMakerID(order)
                                let orderIdData = GetIDHelper.GetOrderID(order);
                                let classificationID = GetIDHelper.GetClassificationID(order);
                                if (classificationID === config.OrderClassificationID) {
                                    let mutableOrderProperties = "";
                                    if (order.value.mutables.value.properties.value.propertyList !== null) {
                                        mutableOrderProperties = PropertyHelper.ParseProperties(order.value.mutables.value.properties.value.propertyList)
                                    }
                                    let mutableOrderKeys = Object.keys(mutableOrderProperties);
                                    return (
                                        <div className="list-container view-container container" key={index}>
                                            <div className="row card-deck">
                                                {
                                                    assetList.map((asset, assetIndex) => {
                                                        const assetId = GetIDHelper.GetAssetID(asset.result.value.assets.value.list[0]);
                                                        let immutableProperties = "";
                                                        let mutableProperties = "";
                                                        if (asset.result.value.assets.value.list[0].value.immutables.value.properties.value.propertyList !== null) {
                                                            immutableProperties = PropertyHelper.ParseProperties(asset.result.value.assets.value.list[0].value.immutables.value.properties.value.propertyList);
                                                        }
                                                        if (asset.result.value.assets.value.list[0].value.mutables.value.properties.value.propertyList !== null) {
                                                            mutableProperties = PropertyHelper.ParseProperties(asset.result.value.assets.value.list[0].value.mutables.value.properties.value.propertyList)
                                                        }
                                                        let immutableKeys = Object.keys(immutableProperties);
                                                        let mutableKeys = Object.keys(mutableProperties);
                                                        return (
                                                            <div className="row flex-start">
                                                                <div
                                                                    className="col-xl-5 col-lg-5 col-md-6 col-sm-12 asset-image">
                                                                    {immutableKeys !== null ?
                                                                        immutableKeys.map((keyName, index1) => {
                                                                            if (immutableProperties[keyName] !== "") {
                                                                                if (keyName === config.URI) {
                                                                                    return (
                                                                                        <div
                                                                                            className="dummy-image image-sectiont"
                                                                                            key={index1}>
                                                                                            <div
                                                                                                id={`orderViewUrlId` + index + `${index1}`}
                                                                                                className="inner-image-box">

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
                                                                                        <div
                                                                                            className="dummy-image image-sectiont"
                                                                                            key={index1}>
                                                                                            <div
                                                                                                id={`orderViewMutableViewUrlId` + index + `${index1}`}>

                                                                                            </div>
                                                                                        </div>
                                                                                    )

                                                                                }
                                                                            }
                                                                        })
                                                                        : ""
                                                                    }
                                                                </div>
                                                                <div
                                                                    className="col-xl-7 col-lg-7 col-md-6 col-sm-12 asset-data">
                                                                    <div className="property-section">
                                                                        <div>
                                                                            {immutableKeys !== null ?
                                                                                immutableKeys.map((keyName, index1) => {
                                                                                    if (immutableProperties[keyName] !== "") {
                                                                                        if (keyName === "identifier") {
                                                                                            return (
                                                                                                <div
                                                                                                    key={index + keyName}
                                                                                                    className="card-view-list">
                                                                                                    <p
                                                                                                        id={`immutable_order_view` + index + index1}
                                                                                                        className="card-view-value title"></p>
                                                                                                </div>)
                                                                                        } else if (keyName === "style") {
                                                                                            return (
                                                                                                <div
                                                                                                    key={index + keyName}
                                                                                                    className="list-item">
                                                                                                    <p
                                                                                                        className="list-item-label"></p>
                                                                                                    <p
                                                                                                        id={`immutable_order_view` + index + `${index1}`}
                                                                                                        className="list-item-value"></p>
                                                                                                </div>)
                                                                                        } else if (keyName === config.URI) {
                                                                                            return (
                                                                                                <div
                                                                                                    key={index + keyName}
                                                                                                    className="list-item">
                                                                                                    <p
                                                                                                        className="list-item-label"></p>
                                                                                                    <p
                                                                                                        id={`immutable_order_view` + index + `${index1}`}
                                                                                                        className="list-item-value"></p>
                                                                                                </div>)
                                                                                        } else if (keyName === "description") {
                                                                                            return (
                                                                                                <div
                                                                                                    key={index + keyName}
                                                                                                    className="card-view-list">
                                                                                                    <p
                                                                                                        id={`immutable_order_view` + index + index1}
                                                                                                        className="card-view-value description"></p>
                                                                                                </div>)
                                                                                        } else if (keyName === "Seller Name") {
                                                                                            return (
                                                                                                <div
                                                                                                    key={index + keyName}
                                                                                                    className="card-view-list">
                                                                                                    <p className="card-view-value price"
                                                                                                       id={`mutable_order_view` + index + index1}></p>
                                                                                                </div>)
                                                                                        } else if (keyName === "exchangeRate") {
                                                                                            return (
                                                                                                <div
                                                                                                    key={index + keyName}
                                                                                                    className="card-view-list">
                                                                                                    <p className="card-view-value price"
                                                                                                       id={`immutable_order_view` + index + index1}></p>
                                                                                                </div>)
                                                                                        }
                                                                                    } else {
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
                                                                        {mutableOrderKeys !== null ?
                                                                            mutableOrderKeys.map((keyName, index1) => {
                                                                                if (keyName === "exchangeRate") {
                                                                                    return (
                                                                                        <div key={index + keyName}
                                                                                             className="card-view-list">
                                                                                            <p className="card-view-value price"
                                                                                               id={`mutable_orderPrice_view` + index + index1}></p>
                                                                                        </div>)
                                                                                }
                                                                            })
                                                                            : ""
                                                                        }
                                                                        <div>
                                                                            {mutableKeys !== null ?
                                                                                mutableKeys.map((keyName, index1) => {
                                                                                    if (mutableProperties[keyName] !== "") {
                                                                                        if (keyName === "exchangeRate") {
                                                                                            return (
                                                                                                <div
                                                                                                    key={index + keyName}
                                                                                                    className="card-view-list">
                                                                                                    <p className="card-view-value price"
                                                                                                       id={`mutable_order_view` + index + index1}></p>
                                                                                                </div>)
                                                                                        } else if (keyName === "style") {
                                                                                            return (
                                                                                                <div
                                                                                                    key={index + keyName}
                                                                                                    className="list-item">
                                                                                                    <p
                                                                                                        className="list-item-label"></p>
                                                                                                    <p
                                                                                                        id={`mutable_order_view` + index + `${index1}`}
                                                                                                        className="list-item-value"></p>
                                                                                                </div>)
                                                                                        } else if (keyName === config.URI) {
                                                                                            return (
                                                                                                <div
                                                                                                    key={index + keyName}
                                                                                                    className="list-item">
                                                                                                    <p
                                                                                                        className="list-item-label"></p>
                                                                                                    <p
                                                                                                        id={`mutable_order_view` + index + `${index1}`}
                                                                                                        className="list-item-value"></p>
                                                                                                </div>)
                                                                                        } else if (keyName === "SellerName") {
                                                                                            return (
                                                                                                <div
                                                                                                    key={index + keyName}
                                                                                                    className="card-view-list">
                                                                                                    <p className="card-view-value author"
                                                                                                       id={`mutable_order_view` + index + index1}></p>
                                                                                                </div>)
                                                                                        } else if (keyName === "ArtistName") {
                                                                                            return (
                                                                                                <div
                                                                                                    key={index + keyName}
                                                                                                    className="card-view-list">
                                                                                                    <p className="card-view-value author"
                                                                                                       id={`mutable_order_view` + index + index1}></p>
                                                                                                </div>)
                                                                                        }
                                                                                    } else if (keyName === "exchangeRate") {
                                                                                        return (
                                                                                            <div key={index + keyName}
                                                                                                 className="list-item">
                                                                                                <p className="list-item-hash-value">{mutableProperties[keyName]}</p>
                                                                                            </div>)
                                                                                    }
                                                                                })
                                                                                : ""
                                                                            }


                                                                        </div>
                                                                        <div className="property-actions">
                                                                            {props.location.state.currentPath === "/marketplace" ?
                                                                                <Button variant="primary" size="sm"
                                                                                        className="button-large"
                                                                                        onClick={() => handleModalData("TakeOrder", orderId)}>{t("TAKE")}</Button>
                                                                                : <Button variant="primary" size="sm"
                                                                                          className="button-large"
                                                                                          onClick={() => handleModalData("CancelOrder", "", order)}>{t("CANCEL")}</Button>
                                                                            }
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

                            })
                            : <p className="empty-list">{t("ORDERS_NOT_FOUND")}</p>
                        }


                        {/*{orderList !== null ?*/}
                        {/*    orderList.map((order, index) => {*/}
                        {/*            let immutableProperties = "";*/}
                        {/*            let mutableProperties = "";*/}
                        {/*            if (order.value.immutables.value.properties.value.propertyList !== null) {*/}
                        {/*                immutableProperties = PropertyHelper.ParseProperties(order.value.immutables.value.properties.value.propertyList)*/}
                        {/*            }*/}
                        {/*            if (order.value.mutables.value.properties.value.propertyList !== null) {*/}
                        {/*                mutableProperties = PropertyHelper.ParseProperties(order.value.mutables.value.properties.value.propertyList)*/}
                        {/*            }*/}
                        {/*            let orderId = GetIDHelper.GetOrderID(order);*/}
                        {/*            let classificationID = GetIDHelper.GetClassificationID(order)*/}
                        {/*            let makerOwnableID = GetIDHelper.GetMakerOwnableID(order)*/}
                        {/*            let takerOwnableID = GetIDHelper.GetTakerOwnableID(order)*/}
                        {/*            let makerID = GetIDHelper.GetMakerID(order)*/}
                        {/*            let immutableKeys = Object.keys(immutableProperties);*/}
                        {/*            let mutableKeys = Object.keys(mutableProperties);*/}
                        {/*            return (*/}
                        {/*                <div className="list-container view-container container" key={index}>*/}
                        {/*                    <div className="row card-deck">*/}
                        {/*                        <div className="row">*/}
                        {/*                            <div className="col-xl-5 col-lg-5 col-md-6 col-sm-12 asset-image">*/}
                        {/*                                {immutableKeys !== null ?*/}
                        {/*                                    immutableKeys.map((keyName, index1) => {*/}
                        {/*                                        if (immutableProperties[keyName] !== "") {*/}
                        {/*                                            if (keyName === config.URI) {*/}
                        {/*                                                return (*/}
                        {/*                                                    <div*/}
                        {/*                                                        className="dummy-image image-sectiont"*/}
                        {/*                                                        key={index1}>*/}
                        {/*                                                        <div*/}
                        {/*                                                            id={`orderViewUrlId` + index + `${index1}`}*/}
                        {/*                                                            className="inner-image-box">*/}

                        {/*                                                        </div>*/}
                        {/*                                                    </div>*/}
                        {/*                                                )*/}

                        {/*                                            }*/}
                        {/*                                        }*/}
                        {/*                                    })*/}
                        {/*                                    : ""*/}
                        {/*                                }*/}
                        {/*                                {mutableKeys !== null ?*/}
                        {/*                                    mutableKeys.map((keyName, index1) => {*/}
                        {/*                                        if (mutableProperties[keyName] !== "") {*/}
                        {/*                                            if (keyName === config.URI) {*/}
                        {/*                                                return (*/}
                        {/*                                                    <div className="dummy-image image-sectiont"*/}
                        {/*                                                         key={index1}>*/}
                        {/*                                                        <div*/}
                        {/*                                                            id={`orderViewMutableViewUrlId` + index + `${index1}`}>*/}

                        {/*                                                        </div>*/}
                        {/*                                                    </div>*/}
                        {/*                                                )*/}

                        {/*                                            }*/}
                        {/*                                        }*/}
                        {/*                                    })*/}
                        {/*                                    : ""*/}
                        {/*                                }*/}
                        {/*                            </div>*/}
                        {/*                            <div*/}
                        {/*                                className="col-xl-7 col-lg-7 col-md-6 col-sm-12 asset-data">*/}
                        {/*                                <div className="property-section">*/}
                        {/*                                    <div>*/}
                        {/*                                        {immutableKeys !== null ?*/}
                        {/*                                            immutableKeys.map((keyName, index1) => {*/}
                        {/*                                                if (immutableProperties[keyName] !== "") {*/}
                        {/*                                                    if (keyName === "identifier") {*/}
                        {/*                                                        return (<div key={index + keyName}*/}
                        {/*                                                                     className="card-view-list">*/}
                        {/*                                                            <p*/}
                        {/*                                                                id={`immutable_order_view` + index + index1}*/}
                        {/*                                                                className="card-view-value title"></p>*/}
                        {/*                                                        </div>)*/}
                        {/*                                                    } else if (keyName === "style") {*/}
                        {/*                                                        return (<div key={index + keyName}*/}
                        {/*                                                                     className="list-item"><p*/}
                        {/*                                                            className="list-item-label"></p> <p*/}
                        {/*                                                            id={`immutable_order_view` + index + `${index1}`}*/}
                        {/*                                                            className="list-item-value"></p></div>)*/}
                        {/*                                                    } else if (keyName === config.URI) {*/}
                        {/*                                                        return (<div key={index + keyName}*/}
                        {/*                                                                     className="list-item"><p*/}
                        {/*                                                            className="list-item-label"></p> <p*/}
                        {/*                                                            id={`immutable_order_view` + index + `${index1}`}*/}
                        {/*                                                            className="list-item-value"></p></div>)*/}
                        {/*                                                    } else if (keyName === "description") {*/}
                        {/*                                                        return (<div key={index + keyName}*/}
                        {/*                                                                     className="card-view-list">*/}
                        {/*                                                            <p*/}
                        {/*                                                                id={`immutable_order_view` + index + index1}*/}
                        {/*                                                                className="card-view-value description"></p>*/}
                        {/*                                                        </div>)*/}
                        {/*                                                    } else if (keyName === "exchangeRate") {*/}
                        {/*                                                        return (<div key={index + keyName}*/}
                        {/*                                                                     className="card-view-list">*/}
                        {/*                                                            <p className="card-view-value price"*/}
                        {/*                                                               id={`immutable_order_view` + index + index1}></p>*/}
                        {/*                                                        </div>)*/}
                        {/*                                                    }*/}
                        {/*                                                } else {*/}
                        {/*                                                    return (*/}
                        {/*                                                        <div key={index + keyName}*/}
                        {/*                                                             className="list-item"><p*/}
                        {/*                                                            className="list-item-label">{keyName} </p>*/}
                        {/*                                                            <p*/}
                        {/*                                                                className="list-item-hash-value">{immutableProperties[keyName]}</p>*/}
                        {/*                                                        </div>)*/}
                        {/*                                                }*/}
                        {/*                                            })*/}
                        {/*                                            : ""*/}
                        {/*                                        }*/}
                        {/*                                    </div>*/}
                        {/*                                    <div>*/}
                        {/*                                        {mutableKeys !== null ?*/}
                        {/*                                            mutableKeys.map((keyName, index1) => {*/}
                        {/*                                                if (mutableProperties[keyName] !== "") {*/}
                        {/*                                                    if (keyName === "exchangeRate") {*/}
                        {/*                                                        return (<div key={index + keyName}*/}
                        {/*                                                                     className="card-view-list">*/}
                        {/*                                                            <p className="card-view-value price"*/}
                        {/*                                                               id={`mutable_order_view` + index + index1}></p>*/}
                        {/*                                                        </div>)*/}
                        {/*                                                    } else if (keyName === "style") {*/}
                        {/*                                                        return (<div key={index + keyName}*/}
                        {/*                                                                     className="list-item"><p*/}
                        {/*                                                            className="list-item-label"></p> <p*/}
                        {/*                                                            id={`mutable_order_view` + index + `${index1}`}*/}
                        {/*                                                            className="list-item-value"></p></div>)*/}
                        {/*                                                    } else if (keyName === config.URI) {*/}
                        {/*                                                        return (<div key={index + keyName}*/}
                        {/*                                                                     className="list-item"><p*/}
                        {/*                                                            className="list-item-label"></p> <p*/}
                        {/*                                                            id={`mutable_order_view` + index + `${index1}`}*/}
                        {/*                                                            className="list-item-value"></p></div>)*/}
                        {/*                                                    } else if (keyName === "Seller Name") {*/}
                        {/*                                                        return (<div key={index + keyName}*/}
                        {/*                                                                     className="card-view-list">*/}
                        {/*                                                            <p className="card-view-value price"*/}
                        {/*                                                               id={`mutable_order_view` + index + index1}></p>*/}
                        {/*                                                        </div>)*/}
                        {/*                                                    }*/}
                        {/*                                                } else if (keyName === "exchangeRate") {*/}
                        {/*                                                    return (*/}
                        {/*                                                        <div key={index + keyName}*/}
                        {/*                                                             className="list-item">*/}
                        {/*                                                            <p className="list-item-hash-value">{mutableProperties[keyName]}</p>*/}
                        {/*                                                        </div>)*/}
                        {/*                                                }*/}
                        {/*                                            })*/}
                        {/*                                            : ""*/}
                        {/*                                        }*/}
                        {/*                                    </div>*/}
                        {/*                                    <div className="property-actions">*/}
                        {/*                                        {props.location.state.currentPath === "/marketplace" ?*/}
                        {/*                                            <Button variant="primary" size="sm"*/}
                        {/*                                                    className="button-large"*/}
                        {/*                                                    onClick={() => handleModalData("TakeOrder", orderId)}>{t("TAKE")}</Button>*/}
                        {/*                                            : <Button variant="primary" size="sm"*/}
                        {/*                                                      className="button-large"*/}
                        {/*                                                      onClick={() => handleModalData("CancelOrder", "", order)}>{t("CANCEL")}</Button>*/}
                        {/*                                        }*/}
                        {/*                                    </div>*/}
                        {/*                                </div>*/}
                        {/*                            </div>*/}
                        {/*                        </div>*/}


                        {/*                    </div>*/}
                        {/*                </div>*/}
                        {/*            )*/}
                        {/*        }*/}
                        {/*    )*/}
                        {/*    : ""*/}
                        {/*}*/}
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
