import React, {useState, useEffect} from "react";
import ordersQueryJS from "persistencejs/transaction/orders/query";
import Helpers from "../../utilities/helper";
import ReactDOM from 'react-dom';
import {Modal, Form, Button, Dropdown} from "react-bootstrap";
import metasQueryJS from "persistencejs/transaction/meta/query";
import identitiesQueryJS from "persistencejs/transaction/identity/query";
import {DefineOrder, CancelOrder, Define} from "../forms";
import ordersDefineJS from "persistencejs/transaction/orders/define";

const ordersDefine = new ordersDefineJS(process.env.REACT_APP_ASSET_MANTLE_API)
const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const identitiesQuery = new identitiesQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const ordersQuery = new ordersQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)


const Orders = () => {
    const Helper = new Helpers();
    const [orderList, setOrderList] = useState([]);
    const userAddress = localStorage.getItem('address');
    const [showOrder, setShowOrder] = useState(false);
    const [externalComponent, setExternalComponent] = useState("");
    const [orderId, setOrderId] = useState("");
    const [order, setOrder] = useState([]);
    const handleClose = () => {
        setShowOrder(false);
    };

    useEffect(() => {
        const fetchOrder = () => {

            const identities = identitiesQuery.queryIdentityWithID("all")
            identities.then(function (item) {
                const data = JSON.parse(item);
                const dataList = data.result.value.identities.value.list;
                const filterIdentities = Helper.FilterIdentitiesByProvisionedAddress(dataList, userAddress)
                const ordersData = ordersQuery.queryOrderWithID("all")
                ordersData.then(function (item) {
                    const ordersData = JSON.parse(item);
                    const ordersDataList = ordersData.result.value.orders.value.list;
                    if (ordersDataList) {
                        const filterOrdersByIdentities = Helper.FilterOrdersByIdentity(filterIdentities, ordersDataList)
                        setOrderList(filterOrdersByIdentities);
                    } else {
                        console.log("no orders found")
                    }
                })

            })
        }
        fetchOrder();
    }, []);

    const handleModalData = (formName, order) => {
        console.log("1")
        setOrder(order);
        // setOrderId(orderID)
        setShowOrder(true)
        setExternalComponent(formName)
    }

    return (
        <div className="container">
            <div className="accountInfo">
                <div className="row row-cols-1 row-cols-md-2 card-deck ">
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Actions
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleModalData("DefineOrder")}>Define Order</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    {orderList.map((order, index) => {
                        var immutableProperties = "";
                        var mutableProperties = "";
                        if (order.value.immutables.value.properties.value.propertyList !== null) {
                            immutableProperties = Helper.ParseProperties(order.value.immutables.value.properties.value.propertyList)
                        }
                        if (order.value.mutables.value.properties.value.propertyList !== null) {
                            mutableProperties = Helper.ParseProperties(order.value.mutables.value.properties.value.propertyList)
                        }
                        var immutableKeys = Object.keys(immutableProperties);
                        var mutableKeys = Object.keys(mutableProperties);
                        return (<div className="col-md-6" key={index}>
                                <div className="card">
                                    <div>
                                        <Button variant="secondary"
                                                onClick={() => handleModalData("CancelOrder", order)}>Cancel</Button>
                                    </div>
                                    <a href="#">{Helper.GetOrderID(order)}</a>
                                    <p>Immutables</p>
                                    {
                                        immutableKeys.map((keyName, index1) => {
                                            if (immutableProperties[keyName] !== "") {
                                                const metaQueryResult = metasQuery.queryMetaWithID(immutableProperties[keyName]);
                                                metaQueryResult.then(function (item) {
                                                    const data = JSON.parse(item);
                                                    let myelement = "";
                                                    let metaValue = Helper.FetchMetaValue(data, immutableProperties[keyName])
                                                    myelement = <span>{metaValue}</span>;
                                                    ReactDOM.render(myelement, document.getElementById(`immutable_order` + index + `${index1}`));
                                                });
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
                                                const metaQueryResult = metasQuery.queryMetaWithID(mutableProperties[keyName]);
                                                metaQueryResult.then(function (item) {
                                                    const data = JSON.parse(item);
                                                    let myelement = "";
                                                    let metaValue = Helper.FetchMetaValue(data, mutableProperties[keyName])
                                                    myelement = <span>{metaValue}</span>;
                                                    ReactDOM.render(myelement, document.getElementById(`mutable_order` + index + `${index1}`));
                                                });
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
            </div>
            <Modal
                show={showOrder}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
            >

                {externalComponent === 'DefineOrder' ?
                <Define ActionName={ordersDefine} FormName={'Define Order'}/> :
                null
                }

                {externalComponent === 'CancelOrder' ?
                    <CancelOrder order={order}/> :
                    null
                }
            </Modal>
        </div>
    );
};

export default Orders;
