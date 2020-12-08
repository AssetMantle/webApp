import React, {useState, useEffect} from "react";
import ordersQueryJS from "persistencejs/transaction/orders/query";
import Helpers from "../../utilities/Helper";
import {Button, Modal} from "react-bootstrap";
import {TakeOrder} from "../forms/orders";
import metasQueryJS from "persistencejs/transaction/meta/query";
import {useTranslation} from "react-i18next";

const ordersQuery = new ordersQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)

const Marketplace = () => {
    const Helper = new Helpers();
    const {t} = useTranslation();
    const [externalComponent, setExternalComponent] = useState("");
    const [orderId, setOrderId] = useState("");
    const [orderList, setOrderList] = useState([]);

    useEffect(() => {
        const fetchOrder = () => {
            const ordersData = ordersQuery.queryOrderWithID("all")
            ordersData.then(function (item) {
                const ordersData = JSON.parse(item);
                const ordersDataList = ordersData.result.value.orders.value.list;
                if (ordersDataList) {
                    setOrderList(ordersDataList);
                    ordersDataList.map((order, index) => {
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
                        Helper.AssignMetaValue(immutableKeys, immutableProperties, metasQuery, 'immutable_order_market', index);
                        Helper.AssignMetaValue(mutableKeys, mutableProperties, metasQuery, 'mutable_order_market', index);
                    })
                }
            })

        }
        fetchOrder();
    }, []);

    const handleModalData = (formName, orderId) => {
        setOrderId(orderId)
        setExternalComponent(formName)
    }
    return (
        <div className="container">
            <div className="accountInfo">
                <div className="row row-cols-1 row-cols-md-2 card-deck createAccountSection">
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

                        let immutableKeys = Object.keys(immutableProperties);
                        let mutableKeys = Object.keys(mutableProperties);
                        let orderIdData = Helper.GetOrderID(order);
                        return (<div className="col-md-6" key={index}>
                                <div className="card">
                                    <div>
                                        <Button variant="secondary"
                                                onClick={() => handleModalData("TakeOrder", orderIdData)}>{t("TAKE")}</Button>
                                    </div>
                                    <a href="#">{orderIdData}</a>
                                    <p>{t("IMMUTABLES")}</p>
                                    {immutableKeys !== null ?
                                        immutableKeys.map((keyName, index1) => {
                                            if (immutableProperties[keyName] !== "") {
                                                return (<a key={index + keyName}><b>{keyName} </b>: <span
                                                    id={`immutable_order_market` + index + `${index1}`}></span></a>)
                                            } else {
                                                return (
                                                    <a key={index + keyName}><b>{keyName} </b>: <span>{immutableProperties[keyName]}</span></a>)
                                            }
                                        })
                                        :""
                                    }

                                    <p>{t("MUTABLES")}</p>

                                    {mutableKeys !== null ?
                                        mutableKeys.map((keyName, index1) => {
                                            if (mutableProperties[keyName] !== "") {
                                                return (<a key={index + keyName}><b>{keyName} </b>: <span
                                                    id={`mutable_order_market` + index + `${index1}`}></span></a>)
                                            } else {
                                                return (
                                                    <a key={index + keyName}><b>{keyName} </b>: <span>{mutableProperties[keyName]}</span></a>)
                                            }
                                        })
                                        :""
                                    }
                                </div>
                            </div>
                        )

                    })
                        :<p>{t("ORDERS_NOT_FOUND")}</p>
                    }
                </div>
                <div>
                    {externalComponent === 'TakeOrder' ?
                        <TakeOrder setExternalComponent={setExternalComponent} id={orderId} FormName={'Take Order'}/> :
                        null
                    }
                </div>
            </div>
        </div>
    );
};

export default Marketplace;