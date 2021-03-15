import React, {useState, useEffect} from "react";
import ordersQueryJS from "persistencejs/transaction/orders/query";
import metasQueryJS from "persistencejs/transaction/meta/query";
import identitiesQueryJS from "persistencejs/transaction/identity/query";
import {useTranslation} from "react-i18next";
import Loader from "../../../components/loader"
import config from "../../../constants/config.json";
import GetProperty from "../../../utilities/Helpers/getProperty";
import FilterHelpers from "../../../utilities/Helpers/filter";
import GetMeta from "../../../utilities/Helpers/getMeta";
import GetID from "../../../utilities/Helpers/getID";
import {useHistory} from "react-router-dom";
import {Button} from "react-bootstrap";
import assetsQueryJS from "persistencejs/transaction/assets/query";

const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const identitiesQuery = new identitiesQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const ordersQuery = new ordersQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const assetsQuery = new assetsQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)

const OrderList = React.memo((props) => {
    const PropertyHelper = new GetProperty();
    const FilterHelper = new FilterHelpers();
    const GetMetaHelper = new GetMeta();
    const GetIDHelper = new GetID();
    const {t} = useTranslation();
    const [loader, setLoader] = useState(true)
    const [orderList, setOrderList] = useState([]);
    const [assetList, setAssetList] = useState([]);
    const userAddress = localStorage.getItem('address');
    let history = useHistory();

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
                                    let mutableOrderProperties = "";
                                    if (order.value.mutables.value.properties.value.propertyList !== null) {
                                        mutableOrderProperties = PropertyHelper.ParseProperties(order.value.mutables.value.properties.value.propertyList)
                                    }
                                    let mutableOrderKeys = Object.keys(mutableOrderProperties);
                                    GetMetaHelper.AssignMetaValue(mutableOrderKeys, mutableOrderProperties, metasQuery, 'mutable_orderPrice', index, "" );
                                    let classificationID = GetIDHelper.GetClassificationID(order);
                                    if (classificationID === config.OrderClassificationID) {

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
                                                console.log(immutableKeys, mutableKeys, "mutableKeys")
                                                GetMetaHelper.AssignMetaValue(immutableKeys, immutableProperties, metasQuery, 'immutable_order', index, 'orderUrlId');
                                                GetMetaHelper.AssignMetaValue(mutableKeys, mutableProperties, metasQuery, 'mutable_order', index, 'orderMutableUrlId');
                                                setLoader(false)
                                            } else {
                                                setLoader(false)
                                            }

                                        })
                                    } else {
                                        setLoader(false)
                                    }
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

    const handleAsset = (id) => {
        history.push({
                pathname: '/OrderView',
                state: {
                    orderID: id,
                    currentPath: window.location.pathname,
                }
            }
        );
    }


    return (
        <div className="list-container container">
            {loader ?
                <Loader/>
                : ""
            }
            <div className="row card-deck">
                {orderList.length ?
                    orderList.map((order, index) => {

                        let makerID = GetIDHelper.GetMakerID(order)
                        let orderIdData = GetIDHelper.GetOrderID(order);
                        let classificationID = GetIDHelper.GetClassificationID(order);
                        let mutableOrderProperties = "";
                        if (order.value.mutables.value.properties.value.propertyList !== null) {
                            mutableOrderProperties = PropertyHelper.ParseProperties(order.value.mutables.value.properties.value.propertyList)
                        }
                        let mutableOrderKeys = Object.keys(mutableOrderProperties);
                        if (classificationID === config.OrderClassificationID) {
                            return (
                                <div className="col-xl-3 col-lg-4 col-md-6  col-sm-12" key={index}>
                                    <div className="card order-card" onClick={() => handleAsset(orderIdData)}>
                                        <div id={"orderImagUri" + makerID + index} className="image-container">
                                            <div id={"orderImage" + makerID + index} className="dummy-image">

                                            </div>
                                        </div>
                                        <div className="info-section">
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
                                                        <div key={assetIndex}>
                                                            {immutableKeys !== null ?
                                                                immutableKeys.map((keyName, index1) => {
                                                                    if (immutableProperties[keyName] !== "") {
                                                                        if (keyName === config.URI) {
                                                                            let imageElement = document.getElementById("orderImage" + makerID + index)
                                                                            if (typeof (imageElement) != 'undefined' && imageElement != null) {
                                                                                let divd = document.createElement('div');
                                                                                divd.id = `orderUrlId` + index + `${index1}`
                                                                                divd.className = "assetImage"
                                                                                document.getElementById("orderImagUri" + makerID + index).replaceChild(divd, imageElement);
                                                                            }
                                                                        } else if (keyName === "style") {
                                                                            return (<div key={index + keyName}
                                                                                         className="list-item"><p
                                                                                className="list-item-label"></p> <p
                                                                                id={`immutable_order` + index + `${index1}`}
                                                                                className="list-item-value"></p></div>)
                                                                        } else if (keyName === "description") {
                                                                            return (<div key={index + keyName}
                                                                                         className="card-item"><p
                                                                                id={`immutable_order` + index + `${index1}`}
                                                                                className="description"></p></div>)
                                                                        } else if (keyName === "SellerName") {
                                                                            return (<div key={index + keyName}
                                                                                         className="card-view-list">
                                                                                <p className="card-view-value author"
                                                                                   id={`immutable_order` + index + index1}></p>
                                                                            </div>)
                                                                        } else if (keyName === "ArtistName") {
                                                                            return (<div key={index + keyName}
                                                                                         className="card-view-list">
                                                                                <p className="card-view-value author"
                                                                                   id={`immutable_order` + index + index1}></p>
                                                                            </div>)
                                                                        }
                                                                    } else {
                                                                        return (
                                                                            <div key={index + keyName}
                                                                                 className="card-item"><p
                                                                                className="list-item-hash-value">{immutableProperties[keyName]}</p>
                                                                            </div>)
                                                                    }
                                                                })
                                                                : ""
                                                            }
                                                            {mutableOrderKeys !== null ?
                                                                mutableOrderKeys.map((keyName, index1) => {
                                                                    if (keyName === "exchangeRate") {
                                                                        return (
                                                                            <div key={index + keyName}
                                                                                 className="card-item">
                                                                                <p className="price"
                                                                                   id={`mutable_orderPrice` + index + index1}></p>
                                                                            </div>)
                                                                    }
                                                                })
                                                                :""
                                                            }
                                                            {mutableKeys !== null ?
                                                                mutableKeys.map((keyName, index1) => {
                                                                    if (mutableProperties[keyName] !== "") {
                                                                        if (keyName === config.URI) {
                                                                            let imageElement = document.getElementById("orderImage" + makerID + index)
                                                                            if (typeof (imageElement) != 'undefined' && imageElement != null) {
                                                                                let divd = document.createElement('div');
                                                                                divd.id = `orderMutableUrlId` + index + `${index1}`
                                                                                divd.className = "assetImage"
                                                                                document.getElementById("orderImagUri" + makerID + index).replaceChild(divd, imageElement);
                                                                            }
                                                                        } else if (keyName === "ArtistName") {
                                                                            return (<div key={index + keyName}
                                                                                         className="card-item">
                                                                                <p className="author"
                                                                                   id={`mutable_order` + index + index1}></p>
                                                                            </div>)
                                                                        } else if (keyName === "SellerName") {
                                                                            return (<div key={index + keyName}
                                                                                         className="card-item">
                                                                                <p className="author"
                                                                                   id={`mutable_order` + index + index1}></p>
                                                                            </div>)
                                                                        }
                                                                    }
                                                                })
                                                                : ""
                                                            }

                                                        </div>

                                                    )
                                                })
                                            }
                                        </div>

                                    </div>
                                </div>
                            )
                        }
                    })
                    : <p className="empty-list">{t("ORDERS_NOT_FOUND")}</p>
                }
            </div>

        </div>
    );
})

export default OrderList;
