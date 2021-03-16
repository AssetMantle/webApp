import React, {useState, useEffect} from "react";
import ordersQueryJS from "persistencejs/transaction/orders/query";
import metasQueryJS from "persistencejs/transaction/meta/query";
import {useTranslation} from "react-i18next";
import Loader from "../../../components/loader"
import config from "../../../constants/config.json";
import GetProperty from "../../../utilities/Helpers/getProperty";
import GetMeta from "../../../utilities/Helpers/getMeta";
import GetID from "../../../utilities/Helpers/getID";
import {useHistory} from "react-router-dom";
import {Button} from "react-bootstrap";
import assetsQueryJS from "persistencejs/transaction/assets/query";

const ordersQuery = new ordersQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const assetsQuery = new assetsQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)

const TotalOrders = React.memo((props) => {
    const PropertyHelper = new GetProperty();
    const GetMetaHelper = new GetMeta();
    const GetIDHelper = new GetID();
    const {t} = useTranslation();
    let history = useHistory();
    const [loader, setLoader] = useState(true)
    const [orderList, setOrderList] = useState([]);
    const [assetList, setAssetList] = useState([]);
    useEffect(() => {
            const ordersData = ordersQuery.queryOrderWithID("all");
            ordersData.then(function (item) {
                const ordersData = JSON.parse(item);
                const ordersDataList = ordersData.result.value.orders.value.list;
                if (ordersDataList) {
                    setOrderList(ordersDataList);
                    let assetListData = [];
                    ordersDataList.map((order, index) => {
                        let mutableOrderProperties = "";
                        if (order.value.mutables.value.properties.value.propertyList !== null) {
                            mutableOrderProperties = PropertyHelper.ParseProperties(order.value.mutables.value.properties.value.propertyList)
                        }
                        let mutableOrderKeys = Object.keys(mutableOrderProperties);
                        console.log(mutableOrderKeys, " immutableOrderKeys")
                        GetMetaHelper.AssignMetaValue(mutableOrderKeys, mutableOrderProperties, metasQuery, 'mutable_total_orderPrice_view', index );
                        let classificationID = GetIDHelper.GetClassificationID(order);
                        if(classificationID === config.OrderClassificationID) {
                            let makerID = GetIDHelper.GetMakerOwnableID(order);
                            const filterAssetList = assetsQuery.queryAssetWithID(makerID);
                            filterAssetList.then(function (Asset) {
                                const parsedAsset = JSON.parse(Asset);
                                if (parsedAsset.result.value.assets.value.list !== null) {
                                    const assetId = GetIDHelper.GetAssetID(parsedAsset.result.value.assets.value.list[0]);
                                    // assetListData.push(parsedAsset);
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

                                    GetMetaHelper.AssignMetaValue(immutableKeys, immutableProperties, metasQuery, 'immutable_order_market', index, 'totalOrderUrlId');
                                    GetMetaHelper.AssignMetaValue(mutableKeys, mutableProperties, metasQuery, 'mutable_order_market', index, 'totalOrderMutableUrlId');
                                    setLoader(false)
                                    setAssetList(assetList => [...assetList, parsedAsset]);
                                } else {
                                    setLoader(false)
                                }
                                // console.log(index,assetListData.length,parsedAsset, "s");
                                // if(index === assetListData.length){
                                //     setAssetList(assetListData)
                                // }
                            });
                        }
                        else {
                            setLoader(false)
                        }


                    });

                } else {
                    setLoader(false)
                }
            })
    }, []);

    const handleAsset = (id,makerOwnableID) => {
        history.push({
                pathname: '/OrderView',
                state: {
                    orderID: id,
                    makerOwnableID: makerOwnableID.substr(makerOwnableID.indexOf('|')+ 1),
                    currentPath: window.location.pathname,
                }
            }
        );
    };

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
                        let makerOwnableID = GetIDHelper.GetMakerOwnableID(order);
                        let orderIdData = GetIDHelper.GetOrderID(order);
                        let classificationID = GetIDHelper.GetClassificationID(order);
                        let mutableOrderProperties = "";
                        if (order.value.mutables.value.properties.value.propertyList !== null) {
                            mutableOrderProperties = PropertyHelper.ParseProperties(order.value.mutables.value.properties.value.propertyList)
                        }
                        let mutableOrderKeys = Object.keys(mutableOrderProperties);
                        if(classificationID === config.OrderClassificationID) {
                        return (
                            <div className="col-xl-3 col-lg-4 col-md-6  col-sm-12" key={index}>
                                <div className="card order-card" onClick={() => handleAsset(orderIdData, makerOwnableID)}>
                                    <div id={"totalOrderImagUri" + makerID + index} className="image-container">
                                        <div id={"totalOrderImage" + makerID + index} className="dummy-image">

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
                                                                        let imageElement = document.getElementById("totalOrderImage" + makerID + index);
                                                                        if (typeof (imageElement) != 'undefined' && imageElement != null) {
                                                                            let divd = document.createElement('div');
                                                                            divd.id = `totalOrderUrlId` + index + `${index1}`;
                                                                            divd.className = "assetImage";
                                                                            document.getElementById("totalOrderImagUri" + makerID + index).replaceChild(divd, imageElement);
                                                                        }
                                                                    }
                                                                    else if (keyName === "style") {
                                                                        return (
                                                                            <div key={index + keyName}
                                                                                 className="list-item">
                                                                                <p
                                                                                    id={`immutable_order_market` + index + `${index1}`}
                                                                                    className="list-item-value"></p>
                                                                            </div>)
                                                                    }
                                                                    else if(keyName === "identifier"){
                                                                        return (<div key={index + keyName} className="card-item"><p
                                                                            id={`immutable_order_market` + index + `${index1}`}
                                                                            className="description"></p></div>)
                                                                    }
                                                                    else if (keyName === "SellerName") {
                                                                        return (
                                                                            <div key={index + keyName}
                                                                                 className="card-view-list">
                                                                                <p className="card-view-value price"
                                                                                   id={`immutable_order_market` + index + index1}></p>
                                                                            </div>)
                                                                    }
                                                                    else if (keyName === "ArtistName") {
                                                                        return (<div key={index + keyName}
                                                                                     className="card-item-list2">
                                                                            <p className="card-item-key"
                                                                               id={`mutable_order_market` + index + index1}></p>
                                                                        </div>)
                                                                    }
                                                                    else if(keyName === "exchangeRate") {
                                                                        return (<div key={index + keyName}
                                                                                     className="card-view-list">
                                                                            <p className="card-view-value price"
                                                                               id={`immutable_order_market` + index + index1}></p>
                                                                        </div>)
                                                                    }
                                                                    else{
                                                                        return  null;
                                                                    }

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
                                                                               id={`mutable_total_orderPrice_view` + index + index1}></p>
                                                                        </div>)
                                                                }
                                                            })
                                                            :""
                                                        }
                                                        {mutableKeys !== null ?
                                                            mutableKeys.map((keyName, index1) => {
                                                                if (mutableProperties[keyName] !== "") {
                                                                    if (keyName === config.URI) {
                                                                        let imageElement = document.getElementById("totalOrderImage" + makerID + index);
                                                                        if (typeof (imageElement) != 'undefined' && imageElement != null) {
                                                                            let divd = document.createElement('div');
                                                                            divd.id = `totalOrderMutableUrlId` + index + `${index1}`;
                                                                            divd.className = "assetImage";
                                                                            document.getElementById("totalOrderImagUri" + makerID + index).replaceChild(divd, imageElement);
                                                                        }
                                                                    }
                                                                    else if (keyName === "ArtistName") {
                                                                        return (<div key={index + keyName}
                                                                                     className="card-item-list2">
                                                                            <p className="card-item-key"
                                                                               id={`mutable_order_market` + index + index1}></p>
                                                                        </div>)
                                                                    }
                                                                    else if(keyName === "exchangeRate") {
                                                                        return (<div key={index + keyName}
                                                                                     className="card-view-list">
                                                                            <p className="card-view-value price"
                                                                               id={`immutable_order_market` + index + index1}></p>
                                                                        </div>)
                                                                    }
                                                                    else if (keyName === "SellerName") {
                                                                        return (<div key={index + keyName}
                                                                                     className="card-item-list2">
                                                                            <p className="card-item-key"
                                                                               id={`mutable_order_market` + index + index1}></p>
                                                                        </div>)
                                                                    }else{
                                                                       return  null;
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
                        )}
                    })
                    : <p className="empty-list">{t("ORDERS_NOT_FOUND")}</p>
                }


            </div>

        </div>
    );
});

export default TotalOrders;