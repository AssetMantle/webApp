import GetProperties from "../../utilities/GetProperties";
import {queryOrders} from "persistencejs/build/transaction/orders/query";
import GetID from "../../utilities/GetID";
import FilterData from "../../utilities/FilterData";
import {fetchAssetDetails} from "./marketPlace";
import helper from "../../utilities/helper";
import config from "../../config";

const ordersQuery = new queryOrders(process.env.REACT_APP_ASSET_MANTLE_API);
export const SET_USER_ORDERS = "SET_USER_ORDERS";

export const fetchOrders = (identityId) => {
    return async (dispatch) => {
        try {
            const orders = await ordersQuery.queryOrderWithID(config.orderClassificationID+'****');
            const ordersData = JSON.parse(orders);
            const ordersDataList = ordersData.result.value.orders.value.list;
            if (ordersDataList) {
                const filterOrdersByIdentities = FilterData.FilterOrdersByIdentity(identityId, ordersDataList);
                if (filterOrdersByIdentities.length) {
                    let ordersListNew = [];
                    await Promise.all(filterOrdersByIdentities.map(async (order)=>{
                        let mutableProperties = "";
                        if (order.value.mutables.value.properties.value.propertyList !== null) {
                            mutableProperties = await GetProperties.ParseProperties(order.value.mutables.value.properties.value.propertyList);
                        }
                        let orderIdData = await GetID.GetOrderID(order);
                        const exChangeRate = mutableProperties[0]['exchangeRate'];
                        let classificationID = await GetID.GetClassificationID(order);
                        let makerOwnableID = await GetID.GetMakerOwnableID(order);
                        const assetData = await fetchAssetDetails(makerOwnableID);
                        let takerOwnableID = await GetID.GetTakerOwnableID(order);
                        let makerID = await GetID.GetMakerID(order);

                        ordersListNew.push({
                            'totalData': assetData.totalData,
                            'orderID': orderIdData,
                            'classificationID': classificationID,
                            'encodedOrderID': helper.getBase64Hash(orderIdData),
                            'makerOwnableID': makerOwnableID,
                            'takerOwnableID': takerOwnableID,
                            'makerID': makerID,
                            'immutableProperties': assetData.immutableProperties,
                            'mutableProperties': assetData.mutableProperties,
                            'exChangeRate': helper.getExchangeRate(exChangeRate),
                        });
                    }));

                    dispatch({
                        type: SET_USER_ORDERS,
                        userOrders: ordersListNew,
                        loading: false,
                        data: ''
                    });
                } else {
                    dispatch({
                        type: SET_USER_ORDERS,
                        userOrders: [],
                        loading: false,
                        data: "Orders not found",
                    });
                }
            } else {
                dispatch({
                    type: SET_USER_ORDERS,
                    userOrders: [],
                    loading: false,
                    data: "Orders not found",
                });
            }

        } catch (err) {
            console.log(err);
            dispatch({
                type: SET_USER_ORDERS,
                userOrders: [],
                loading: false,
                data: "Orders not found",
            });
        }
    };
};
