import React, {useState, useEffect} from "react";
import {queryOrders} from "persistencejs/build/transaction/orders/query";
import {queryMeta} from "persistencejs/build/transaction/meta/query";
import {queryIdentities} from "persistencejs/build/transaction/identity/query";
import {useTranslation} from "react-i18next";
import Loader from "../../../components/loader";
import config from "../../../constants/config.json";
import GetProperty from "../../../utilities/Helpers/getProperty";
import FilterHelpers from "../../../utilities/Helpers/filter";
import GetMeta from "../../../utilities/Helpers/getMeta";
import GetID from "../../../utilities/Helpers/getID";
import {useHistory} from "react-router-dom";
import {Button} from "react-bootstrap";

const metasQuery = new queryMeta(process.env.REACT_APP_ASSET_MANTLE_API);
const identitiesQuery = new queryIdentities(process.env.REACT_APP_ASSET_MANTLE_API);
const ordersQuery = new queryOrders(process.env.REACT_APP_ASSET_MANTLE_API);


const OrderList = React.memo(() => {
    const PropertyHelper = new GetProperty();
    const FilterHelper = new FilterHelpers();
    const GetMetaHelper = new GetMeta();
    const GetIDHelper = new GetID();
    const {t} = useTranslation();
    const [loader, setLoader] = useState(true);
    const [orderList, setOrderList] = useState([]);
    const userAddress = localStorage.getItem('address');
    let history = useHistory();

    useEffect(() => {
        const fetchOrder = () => {
            const identities = identitiesQuery.queryIdentityWithID("all");

            identities.then(function (item) {
                const data = JSON.parse(item);
                const dataList = data.result.value.identities.value.list;
                if (dataList) {
                    const filterIdentities = FilterHelper.FilterIdentitiesByProvisionedAddress(dataList, userAddress);
                    const ordersData = ordersQuery.queryOrderWithID("all");
                    ordersData.then(function (item) {
                        const ordersData = JSON.parse(item);
                        const ordersDataList = ordersData.result.value.orders.value.list;
                        if (ordersDataList) {
                            const filterOrdersByIdentities = FilterHelper.FilterOrdersByIdentity(filterIdentities, ordersDataList);
                            if (filterOrdersByIdentities.length) {
                                setOrderList(filterOrdersByIdentities);
                                filterOrdersByIdentities.map((order, index) => {
                                    let immutableProperties = "";
                                    let mutableProperties = "";
                                    if (order.value.immutables.value.properties.value.propertyList !== null) {
                                        immutableProperties = PropertyHelper.ParseProperties(order.value.immutables.value.properties.value.propertyList);
                                    }
                                    if (order.value.mutables.value.properties.value.propertyList !== null) {
                                        mutableProperties = PropertyHelper.ParseProperties(order.value.mutables.value.properties.value.propertyList);
                                    }
                                    let immutableKeys = Object.keys(immutableProperties);
                                    let mutableKeys = Object.keys(mutableProperties);
                                    GetMetaHelper.AssignMetaValue(immutableKeys, immutableProperties, metasQuery, 'immutable_order', index, 'orderUrlId');
                                    GetMetaHelper.AssignMetaValue(mutableKeys, mutableProperties, metasQuery, 'mutable_order', index, 'orderMutableUrlId');
                                    setLoader(false);
                                });
                            } else {
                                setLoader(false);
                            }
                        } else {
                            setLoader(false);
                        }
                    });
                }
            });
        };
        fetchOrder();
    }, []);

    const handleAsset = (id) => {
        history.push({
            pathname : '/OrderView',
            state :{
                orderID : id,
                currentPath : window.location.pathname,
            }
        }
        );
    };


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
                            immutableProperties = PropertyHelper.ParseProperties(order.value.immutables.value.properties.value.propertyList);
                        }
                        if (order.value.mutables.value.properties.value.propertyList !== null) {
                            mutableProperties = PropertyHelper.ParseProperties(order.value.mutables.value.properties.value.propertyList);
                        }
                        let makerID = GetIDHelper.GetMakerID(order);
                        let immutableKeys = Object.keys(immutableProperties);
                        let orderIdData = GetIDHelper.GetOrderID(order);
                        let mutableKeys = Object.keys(mutableProperties);
                        return (
                            <div className="col-xl-3 col-lg-4 col-md-6  col-sm-12" key={index}>
                                <div className="card order-card">
                                    <div id={"orderImagUri" + makerID + index} className="image-container">
                                        <div id={"orderImage" + makerID + index} className="dummy-image">

                                        </div>
                                    </div>
                                    <div className="info-section">
                                        {immutableKeys !== null ?
                                            immutableKeys.map((keyName, index1) => {
                                                if (immutableProperties[keyName] !== "") {
                                                    if (keyName === config.URI) {
                                                        let imageElement = document.getElementById("orderImage" + makerID + index);
                                                        if (typeof (imageElement) != 'undefined' && imageElement != null) {
                                                            let divd = document.createElement('div');
                                                            divd.id = `orderUrlId` + index + `${index1}`;
                                                            divd.className = "assetImage";
                                                            document.getElementById("orderImagUri" + makerID + index).replaceChild(divd, imageElement);
                                                        }
                                                    }  else if(keyName === "style"){
                                                        return (<div key={index + keyName} className="list-item"><p
                                                            className="list-item-label"></p> <p
                                                            id={`immutable_order` + index + `${index1}`}
                                                            className="list-item-value"></p></div>);
                                                    }
                                                    else if(keyName === "identifier" || keyName === "description"){
                                                        return (<div key={index + keyName} className="list-item"><p
                                                            className="list-item-label">{keyName}: </p> <p
                                                            id={`immutable_order` + index + `${index1}`}
                                                            className="list-item-value"></p></div>);
                                                    }
                                                } else {
                                                    return (
                                                        <div key={index + keyName} className="list-item"><p
                                                            className="list-item-label">{keyName}: </p> <p
                                                            className="list-item-hash-value">{immutableProperties[keyName]}</p>
                                                        </div>);
                                                }
                                            })
                                            : ""
                                        }
                                        {mutableKeys !== null ?
                                            mutableKeys.map((keyName, index1) => {
                                                if (mutableProperties[keyName] !== "") {
                                                    if (keyName === config.URI) {
                                                        let imageElement = document.getElementById("orderImage" + makerID + index);
                                                        if (typeof (imageElement) != 'undefined' && imageElement != null) {
                                                            let divd = document.createElement('div');
                                                            divd.id = `orderMutableUrlId` + index + `${index1}`;
                                                            divd.className = "assetImage";
                                                            document.getElementById("orderImagUri" + makerID + index).replaceChild(divd, imageElement);
                                                        }
                                                    }
                                                }
                                            })
                                            : ""
                                        }
                                        <Button variant="primary" className="viewButton" size="sm"
                                            onClick={() => handleAsset(orderIdData)}>View</Button>
                                    </div>
                                </div>
                            </div>
                        );

                    })
                    : <p className="empty-list">{t("ORDERS_NOT_FOUND")}</p>
                }
            </div>

        </div>
    );
});
OrderList.displayName = 'OrderList';
export default OrderList;
