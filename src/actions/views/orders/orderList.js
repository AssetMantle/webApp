import React, {useState, useEffect} from "react";
import ordersQueryJS from "persistencejs/transaction/orders/query";
import {Button} from "react-bootstrap";
import metasQueryJS from "persistencejs/transaction/meta/query";
import identitiesQueryJS from "persistencejs/transaction/identity/query";
import {CancelOrder} from "../../forms/orders";
import {useTranslation} from "react-i18next";
import Loader from "../../../components/loader"
import Copy from "../../../components/copy"
import config from "../../../constants/config.json";
import GetProperty from "../../../utilities/Helpers/getProperty";
import FilterHelpers from "../../../utilities/Helpers/filter";
import GetMeta from "../../../utilities/Helpers/getMeta";
import GetID from "../../../utilities/Helpers/getID";

const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const identitiesQuery = new identitiesQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const ordersQuery = new ordersQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)


const OrderList = React.memo((props) => {
    const PropertyHelper = new GetProperty();
    const FilterHelper = new FilterHelpers();
    const GetMetaHelper = new GetMeta();
    const GetIDHelper = new GetID();
    const {t} = useTranslation();
    const [loader, setLoader] = useState(true)
    const [orderList, setOrderList] = useState([]);
    const userAddress = localStorage.getItem('address');
    const [externalComponent, setExternalComponent] = useState("");
    const [order, setOrder] = useState([]);

    useEffect(() => {
        const fetchOrder = () => {
            const identities = identitiesQuery.queryIdentityWithID("all")

            identities.then(function (item) {
                const data = JSON.parse(item);
                const dataList = data.result.value.identities.value.list;
                if (dataList) {
                    const filterIdentities = FilterHelper.FilterIdentitiesByProvisionedAddress(dataList, userAddress)
                    const ordersData = ordersQuery.queryOrderWithID("all")
                    ordersData.then(function (item) {
                        const ordersData = JSON.parse(item);
                        const ordersDataList = ordersData.result.value.orders.value.list;
                        if (ordersDataList) {
                            const filterOrdersByIdentities = FilterHelper.FilterOrdersByIdentity(filterIdentities, ordersDataList)
                            if (filterOrdersByIdentities.length) {
                                setOrderList(filterOrdersByIdentities);
                                filterOrdersByIdentities.map((order, index) => {
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
                                    GetMetaHelper.AssignMetaValue(immutableKeys, immutableProperties, metasQuery, 'immutable_order', index, 'orderUrlId');
                                    GetMetaHelper.AssignMetaValue(mutableKeys, mutableProperties, metasQuery, 'mutable_order', index);
                                    setLoader(false)
                                })
                            } else {
                                setLoader(false)
                            }
                        } else {
                            setLoader(false)
                        }
                    })
                }
            })
        }
        fetchOrder();
    }, []);

    const handleModalData = (formName, order) => {
        setOrder(order);
        setExternalComponent(formName)
    }

    return (
        <div className="list-container">
            {loader ?
                <Loader/>
                : ""
            }
            <div className="row card-deck">
                {orderList.length ?
                    orderList.map((order, index) => {
                        let immutableProperties = "";
                        let mutableProperties = "";
                        if (order.value.immutables.value.properties.value.propertyList !== null) {
                            immutableProperties = PropertyHelper.ParseProperties(order.value.immutables.value.properties.value.propertyList)
                        }
                        if (order.value.mutables.value.properties.value.propertyList !== null) {
                            mutableProperties = PropertyHelper.ParseProperties(order.value.mutables.value.properties.value.propertyList)
                        }
                        let classificationID = GetIDHelper.GetClassificationID(order)
                        let makerOwnableID = GetIDHelper.GetMakerOwnableID(order)
                        let takerOwnableID = GetIDHelper.GetTakerOwnableID(order)
                        let makerID = GetIDHelper.GetMakerID(order)
                        let hashID = GetIDHelper.GetHashID(order)
                        let immutableKeys = Object.keys(immutableProperties);
                        let mutableKeys = Object.keys(mutableProperties);
                        return (
                            <div className="col-xl-3 col-lg-4 col-md-6  col-sm-12" key={index}>
                                <div className="card">
                                    <div id={"orderImagUri" + makerID+index}>
                                        <div id={"orderImage" + makerID+index} className="dummy-image">

                                        </div>
                                    </div>
                                    <div>
                                        <Button variant="secondary" size="sm"
                                                onClick={() => handleModalData("CancelOrder", order)}>{t("CANCEL")}</Button>
                                    </div>
                                    <div className="list-item">
                                        <p className="list-item-label">{t("CLASSIFICATION_ID")}</p>
                                        <div className="list-item-value id-section">
                                            <p className="id-string" title={classificationID}>: {classificationID}</p>
                                            <Copy
                                                id={classificationID}/>
                                        </div>
                                    </div>
                                    <div className="list-item">
                                        <p className="list-item-label">{t("MAKER_OWNABLE_ID")}</p>
                                        <div className="list-item-value id-section">
                                            <p className="id-string" title={makerOwnableID}>: {makerOwnableID}</p>
                                        </div>
                                    </div>
                                    <div className="list-item">
                                        <p className="list-item-label">{t("TAKER_OWNABLE_ID")}</p>
                                        <div className="list-item-value id-section">
                                            <p className="id-string" title={takerOwnableID}>: {takerOwnableID}</p>
                                        </div>
                                    </div>
                                    <div className="list-item">
                                        <p className="list-item-label">{t("MAKER_ID")}</p>
                                        <div className="list-item-value id-section">
                                            <p className="id-string" title={makerID}>: {makerID}</p>

                                        </div>
                                    </div>
                                    <div className="list-item">
                                        <p className="list-item-label">{t("HASH")}</p>
                                        <div className="list-item-value id-section">
                                            <p className="id-string" title={hashID}>: {hashID}</p>
                                        </div>
                                    </div>

                                    <p className="sub-title">{t("IMMUTABLES")}</p>
                                    {immutableKeys !== null ?
                                        immutableKeys.map((keyName, index1) => {
                                            if (immutableProperties[keyName] !== "") {
                                                if (keyName === config.URI) {
                                                    let imageElement = document.getElementById("orderImage" + makerID+index)
                                                    if (typeof (imageElement) != 'undefined' && imageElement != null) {
                                                        let divd = document.createElement('div');
                                                        divd.id = `orderUrlId` + index + `${index1}`
                                                        divd.className = "assetImage"
                                                        document.getElementById("orderImagUri" + makerID+index).replaceChild(divd, imageElement);
                                                    }
                                                } else {
                                                    return (<div key={index + keyName} className="list-item"><p
                                                        className="list-item-label">{keyName} </p>: <p
                                                        id={`immutable_order` + index + `${index1}`}
                                                        className="list-item-value"></p></div>)
                                                }
                                            } else {
                                                return (
                                                    <div key={index + keyName} className="list-item"><p
                                                        className="list-item-label">{keyName} </p>: <p
                                                        className="list-item-hash-value">{immutableProperties[keyName]}</p>
                                                    </div>)
                                            }
                                        })
                                        : ""
                                    }

                                    <p className="sub-title">{t("MUTABLES")}</p>

                                    {mutableKeys !== null ?
                                        mutableKeys.map((keyName, index1) => {
                                            if (mutableProperties[keyName] !== "") {
                                                return (<div key={index + keyName} className="list-item"><p
                                                    className="list-item-label">{keyName} </p>: <p
                                                    className="list-item-value"
                                                    id={`mutable_order` + index + `${index1}`}></p></div>)
                                            } else {
                                                return (
                                                    <div key={index + keyName} className="list-item"><p
                                                        className="list-item-label">{keyName} </p>: <p
                                                        className="list-item-hash-value">{mutableProperties[keyName]}</p>
                                                    </div>)
                                            }
                                        })
                                        : ""
                                    }
                                </div>
                            </div>
                        )

                    })
                    : <p className="empty-list">{t("ORDERS_NOT_FOUND")}</p>
                }
            </div>
            <div>
                {externalComponent === 'CancelOrder' ?
                    <CancelOrder setExternalComponent={setExternalComponent} order={order}/> :
                    null
                }
            </div>
        </div>
    );
})

export default OrderList;
