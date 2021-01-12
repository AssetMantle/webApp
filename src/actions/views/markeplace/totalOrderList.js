import React, {useState, useEffect} from "react";
import ordersQueryJS from "persistencejs/transaction/orders/query";
import {Button} from "react-bootstrap";
import {TakeOrder} from "../../forms/orders";
import metasQueryJS from "persistencejs/transaction/meta/query";
import {useTranslation} from "react-i18next";
import Loader from "../../../components/loader"
import Copy from "../../../components/copy";
import config from "../../../constants/config.json";
import GetProperty from "../../../utilities/Helpers/getProperty";
import GetMeta from "../../../utilities/Helpers/getMeta";
import GetID from "../../../utilities/Helpers/getID";
const ordersQuery = new ordersQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)

const TotalOrders = React.memo((props) => {
    const PropertyHelper = new GetProperty();
    const GetMetaHelper = new GetMeta();
    const GetIDHelper = new GetID();
    const {t} = useTranslation();
    const [loader, setLoader] = useState(true)
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
                            immutableProperties = PropertyHelper.ParseProperties(order.value.immutables.value.properties.value.propertyList)
                        }
                        if (order.value.mutables.value.properties.value.propertyList !== null) {
                            mutableProperties = PropertyHelper.ParseProperties(order.value.mutables.value.properties.value.propertyList)
                        }
                        let immutableKeys = Object.keys(immutableProperties);
                        let mutableKeys = Object.keys(mutableProperties);
                        GetMetaHelper.AssignMetaValue(immutableKeys, immutableProperties, metasQuery, 'immutable_order_market', index, 'totalOrderUrlId');
                        GetMetaHelper.AssignMetaValue(mutableKeys, mutableProperties, metasQuery, 'mutable_order_market', index);
                        setLoader(false)
                    })
                } else {
                    setLoader(false)
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

                        let immutableKeys = Object.keys(immutableProperties);
                        let mutableKeys = Object.keys(mutableProperties);
                        let orderIdData = GetIDHelper.GetOrderID(order);
                        return (
                            <div className="col-xl-3 col-lg-4 col-md-6  col-sm-12" key={index}>
                                <div className="card">
                                    <div id={"totalOrderImagUri" + orderIdData}>
                                        <div id={"totalOrderImage" + orderIdData} className="dummy-image">

                                        </div>
                                    </div>
                                    <div>
                                        <Button variant="secondary" size="sm"
                                                onClick={() => handleModalData("TakeOrder", orderIdData)}>{t("TAKE")}</Button>
                                    </div>
                                    <div className="list-item">
                                        <p className="list-item-label">{t("ORDER_ID")}</p>
                                        <div className="list-item-value id-section">
                                            <p className="id-string" title={orderIdData}>: {orderIdData}</p>
                                            <Copy
                                                id={orderIdData}/>
                                        </div>
                                    </div>
                                    <p>{t("IMMUTABLES")}</p>
                                    {immutableKeys !== null ?
                                        immutableKeys.map((keyName, index1) => {
                                            if (immutableProperties[keyName] !== "") {
                                                if (keyName === config.URI) {
                                                    let imageElement = document.getElementById("totalOrderImage" + orderIdData)
                                                    if (typeof (imageElement) != 'undefined' && imageElement != null) {
                                                        let divd = document.createElement('div');
                                                        divd.id = `totalOrderUrlId` + index + `${index1}`
                                                        divd.className = "assetImage"
                                                        document.getElementById("totalOrderImagUri" + orderIdData).replaceChild(divd, imageElement);
                                                    }
                                                }
                                              else {
                                                    return (<div key={index + keyName} className="list-item"><p
                                                        className="list-item-label">{keyName} </p>: <p
                                                        id={`immutable_order_market` + index + `${index1}`}
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

                                    <p>{t("MUTABLES")}</p>

                                    {mutableKeys !== null ?
                                        mutableKeys.map((keyName, index1) => {
                                            if (mutableProperties[keyName] !== "") {
                                                return (<div key={index + keyName} className="list-item"><p
                                                    className="list-item-label">{keyName} </p>: <p
                                                    id={`mutable_order_market` + index + `${index1}`}
                                                    className="list-item-value"></p></div>)
                                            } else {
                                                return (
                                                    <div key={index + keyName} className="list-item"><p
                                                        className="list-item-label">{keyName} </p>: <p
                                                        className="list-ite-hash-value">{mutableProperties[keyName]}</p>
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
                {externalComponent === 'TakeOrder' ?
                    <TakeOrder setExternalComponent={setExternalComponent} id={orderId} FormName={'Take Order'}/> :
                    null
                }
            </div>
        </div>
    );
});

export default TotalOrders;