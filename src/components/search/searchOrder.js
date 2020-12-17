import React, {useState, useEffect} from "react";
import Loader from "../loader";
import Helpers from "../../utilities/Helper";
import metasQueryJS from "persistencejs/transaction/meta/query";
import {useTranslation} from "react-i18next";
import Sidebar from "../sidebar/sidebar";

import {Summary} from "../summary";
import identitiesQueryJS from "persistencejs/transaction/identity/query";
import {Button} from "react-bootstrap";
import Copy from "../copy";
import ordersQueryJS from "persistencejs/transaction/orders/query";
const ordersQuery = new ordersQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)

const SearchOrder = React.memo((props) => {
    const Helper = new Helpers();
    const {t} = useTranslation();
    const [orderList, setOrderList] = useState([]);
    const [filteredIdentitiesList, setFilteredIdentitiesList] = useState([]);
    useEffect(()=>{
     if(props.location.data !== undefined){
        const ordersData = ordersQuery.queryOrderWithID(props.location.data.data)
        ordersData.then(function (item) {
            const ordersData = JSON.parse(item);
            const ordersDataList = ordersData.result.value.orders.value.list;
            if (ordersDataList.length) {
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
                        Helper.AssignMetaValue(immutableKeys, immutableProperties, metasQuery, 'immutable_order_search', index);
                        Helper.AssignMetaValue(mutableKeys, mutableProperties, metasQuery, 'mutable_order_search', index);
                    })

            }
        })}
    },[])

    return (
        <div className="content-section">
            <Sidebar/>
            <div className="accountInfo">
                <div className="row">
                    <div className="col-md-9 card-deck">
                        <div className="dropdown-section">
                            <h4>Search Results: {props.location.data.data}</h4>
                        </div>
                        <div className="list-container">
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
                                                                    id={`immutable_order_search` + index + index1} className="list-item-value"></p></div>)
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
                                                                return (<div key={index + keyName} className="list-item"><p className="list-item-label">{keyName} </p>:
                                                                    <p className="list-item-value" id={`mutable_order_search` + index + index1}></p></div>)
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
                        </div>
                    </div>
                    <div className="col-md-3 summary-section">
                        <Summary />
                    </div>
                </div>
            </div>
        </div>

    );
})

export default SearchOrder;
