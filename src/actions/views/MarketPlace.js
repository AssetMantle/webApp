import React, {useState, useEffect} from "react";
import ordersQueryJS from "persistencejs/transaction/orders/query";
import Helpers from "../../utilities/Helper";
import {Button, Modal} from "react-bootstrap";
import {TakeOrder} from "../forms/orders";
import ReactDOM from "react-dom";

import metasQueryJS from "persistencejs/transaction/meta/query";

const ordersQuery = new ordersQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)

const Marketplace = () => {
    const Helper = new Helpers();
    const [showOrder, setShowOrder] = useState(false);
    const [externalComponent, setExternalComponent] = useState("");
    const [orderId, setOrderId] = useState("");
    const [orderList, setOrderList] = useState([]);
    const handleClose = () => {
        setShowOrder(false);
    };

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
                        immutableKeys.map((keyName, index1) => {
                            if (immutableProperties[keyName] !== "") {
                                const metaQueryResult = metasQuery.queryMetaWithID(immutableProperties[keyName]);
                                metaQueryResult.then(function (item) {
                                    const data = JSON.parse(item);
                                    let myElement = "";
                                    let metaValue = Helper.FetchMetaValue(data, immutableProperties[keyName])
                                    myElement = <span>{metaValue}</span>;
                                    ReactDOM.render(myElement, document.getElementById(`immutable_order` + index + `${index1}`));
                                });
                            }
                        })
                        mutableKeys.map((keyName, index1) => {
                            if (mutableProperties[keyName] !== "") {
                                const metaQueryResult = metasQuery.queryMetaWithID(mutableProperties[keyName]);
                                metaQueryResult.then(function (item) {
                                    const data = JSON.parse(item);
                                    let myElement = "";
                                    let metaValue = Helper.FetchMetaValue(data, mutableProperties[keyName])
                                    myElement = <span>{metaValue}</span>;
                                    ReactDOM.render(myElement, document.getElementById(`mutable_order` + index + `${index1}`));
                                });
                            }
                        })
                    })
                } else {
                    console.log("no orders found")
                }
            })

        }
        fetchOrder();
    }, []);

    const handleModalData = (formName, orderId) => {
        setOrderId(orderId)
        setShowOrder(true)
        setExternalComponent(formName)
    }
    return (
        <div className="container">
            <div className="accountInfo">
                <div className="row row-cols-1 row-cols-md-2 card-deck createAccountSection">
                    {orderList.map((order, index) => {
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
                                                onClick={() => handleModalData("TakeOrder", orderIdData)}>Take</Button>
                                    </div>
                                    <a href="#">{orderIdData}</a>
                                    <p>Immutables</p>
                                    {
                                        immutableKeys.map((keyName, index1) => {
                                            if (immutableProperties[keyName] !== "") {
                                                return (<a key={index + keyName}><b>{keyName} </b>: <span
                                                    id={`immutable_order` + index + `${index1}`}></span></a>)
                                            } else {
                                                return (
                                                    <a key={index + keyName}><b>{keyName} </b>: <span>{immutableProperties[keyName]}</span></a>)
                                            }
                                        })
                                    }

                                    <p>Mutables</p>

                                    {
                                        mutableKeys.map((keyName, index1) => {
                                            if (mutableProperties[keyName] !== "") {
                                                return (<a key={index + keyName}><b>{keyName} </b>: <span
                                                    id={`mutable_order` + index + `${index1}`}></span></a>)
                                            } else {
                                                return (
                                                    <a key={index + keyName}><b>{keyName} </b>: <span>{mutableProperties[keyName]}</span></a>)
                                            }
                                        })
                                    }
                                </div>
                            </div>
                        )

                    })}
                </div>
                <Modal
                    show={showOrder}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    centered
                >
                    {externalComponent === 'TakeOrder' ?
                        <TakeOrder id={orderId} FormName={'Take Order'}/> :
                        null
                    }
                </Modal>
            </div>
        </div>
    );
};

export default Marketplace;