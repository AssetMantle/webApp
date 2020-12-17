import React, {useState, useEffect} from "react";
import ordersQueryJS from "persistencejs/transaction/orders/query";
import Helpers from "../../../utilities/Helper";
import {Button} from "react-bootstrap";
import metasQueryJS from "persistencejs/transaction/meta/query";
import identitiesQueryJS from "persistencejs/transaction/identity/query";
import {CancelOrder} from "../../forms/orders";
import {useTranslation} from "react-i18next";
import Loader from "../../../components/loader"
import Copy from "../../../components/copy"

const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const identitiesQuery = new identitiesQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const ordersQuery = new ordersQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)


const OrderList = React.memo((props) => {
    const Helper = new Helpers();
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
                    const filterIdentities = Helper.FilterIdentitiesByProvisionedAddress(dataList, userAddress)
                    const ordersData = ordersQuery.queryOrderWithID("all")
                    ordersData.then(function (item) {
                        const ordersData = JSON.parse(item);
                        const ordersDataList = ordersData.result.value.orders.value.list;
                        if (ordersDataList) {
                            const filterOrdersByIdentities = Helper.FilterOrdersByIdentity(filterIdentities, ordersDataList)
                            if (filterOrdersByIdentities.length) {
                                setOrderList(filterOrdersByIdentities);
                                filterOrdersByIdentities.map((order, index) => {
                                    let immutableProperties = "";
                                    let mutableProperties = "";
                                    if (order.value.immutables.value.properties.value.propertyList !== null) {
                                        immutableProperties = Helper.ParseProperties(order.value.immutables.value.properties.value.propertyList)
                                    }
                                    if (order.value.mutables.value.properties.value.propertyList !== null) {
                                        mutableProperties = Helper.ParseProperties(order.value.mutables.value.properties.value.propertyList)
                                    }
                                    let immutableKeys = Object.keys(immutableProperties);
                                    let mutableKeys = Object.keys(mutableProperties);
                                    Helper.AssignMetaValue(immutableKeys, immutableProperties, metasQuery, 'immutable_order', index);
                                    Helper.AssignMetaValue(mutableKeys, mutableProperties, metasQuery, 'mutable_order', index);
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
                            immutableProperties = Helper.ParseProperties(order.value.immutables.value.properties.value.propertyList)
                        }
                        if (order.value.mutables.value.properties.value.propertyList !== null) {
                            mutableProperties = Helper.ParseProperties(order.value.mutables.value.properties.value.propertyList)
                        }
                        let orderId = Helper.GetOrderID(order);
                        let immutableKeys = Object.keys(immutableProperties);
                        let mutableKeys = Object.keys(mutableProperties);
                        return (
                            <div className="col-xl-4 col-lg-6 col-md-6  col-sm-12" key={index}>
                                <div className="card">
                                    <div>
                                        <Button variant="secondary" size="sm"
                                                onClick={() => handleModalData("CancelOrder", order)}>{t("CANCEL")}</Button>
                                    </div>
                                    <div className="list-item">
                                        <p className="list-item-label">{t("ORDER_ID")}</p>
                                        <div className="list-item-value id-section">
                                            <p className="id-string" title={orderId}>: {orderId}</p>
                                            <Copy
                                                id={orderId}/>
                                        </div>
                                    </div>

                                    <p className="sub-title">{t("IMMUTABLES")}</p>
                                    {immutableKeys !== null ?
                                        immutableKeys.map((keyName, index1) => {
                                            if (immutableProperties[keyName] !== "") {
                                                return (<div key={index + keyName} className="list-item"><p className="list-item-label">{keyName} </p>: <p
                                                    id={`immutable_order` + index + `${index1}`} className="list-item-value"></p></div>)
                                            } else {
                                                return (
                                                    <div key={index + keyName} className="list-item"><p className="list-item-label">{keyName} </p>: <p className="list-item-hash-value">{immutableProperties[keyName]}</p></div>)
                                            }
                                        })
                                        : ""
                                    }

                                    <p className="sub-title">{t("MUTABLES")}</p>

                                    {mutableKeys !== null ?
                                        mutableKeys.map((keyName, index1) => {
                                            if (mutableProperties[keyName] !== "") {
                                                return (<div key={index + keyName} className="list-item"><p className="list-item-label">{keyName} </p>: <p className="list-item-value"
                                                    id={`mutable_order` + index + `${index1}`}></p></div>)
                                            } else {
                                                return (
                                                    <div key={index + keyName} className="list-item"><p className="list-item-label">{keyName} </p>: <p className="list-item-hash-value">{mutableProperties[keyName]}</p></div>)
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
