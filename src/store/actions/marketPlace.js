import GetProperties from "../../utilities/GetProperties";
import helper from "../../utilities/helper";
import {queryOrders} from "persistencejs/build/transaction/orders/query";
import GetID from "../../utilities/GetID";
const ordersQuery = new queryOrders(process.env.REACT_APP_ASSET_MANTLE_API);
export const SET_MARKET_ORDERS = "SET_MARKET_ORDERS";

export const fetchMarketPlace = () => {
    return async (dispatch) => {
        try {
            const orders = await  ordersQuery.queryOrderWithID("all");
            const ordersData = JSON.parse(orders);
            const ordersDataList = ordersData.result.value.orders.value.list;
            if (ordersDataList) {
                let ordersListNew = [];
                for (const order of ordersDataList) {
                    let immutableProperties = "";
                    let mutableProperties = "";
                    if (order.value.immutables.value.properties.value.propertyList !== null) {
                        immutableProperties = await GetProperties.ParseProperties(order.value.immutables.value.properties.value.propertyList);
                    }
                    if (order.value.mutables.value.properties.value.propertyList !== null) {
                        mutableProperties = await GetProperties.ParseProperties(order.value.mutables.value.properties.value.propertyList);
                    }
                    let orderIdData = await GetID.GetOrderID(order);
                    let classificationID = await GetID.GetClassificationID(order);
                    let makerOwnableID = await GetID.GetMakerOwnableID(order);
                    let takerOwnableID = await GetID.GetTakerOwnableID(order);
                    let makerID = await GetID.GetMakerID(order);
                    const totalData = {...immutableProperties[0], ...mutableProperties[0]};
                    const objSorted = helper.SortObjectData(totalData);
                    ordersListNew.push({'totalData': objSorted,
                        'orderID':orderIdData,
                        'classificationID':classificationID,
                        'makerOwnableID':makerOwnableID,
                        'takerOwnableID':takerOwnableID,
                        'makerID':makerID,
                        'immutableProperties':immutableProperties[0],
                        'mutableProperties':mutableProperties[0]
                    });
                }
                console.log(ordersListNew, "iuser ordersListNew");

                dispatch({
                    type: SET_MARKET_ORDERS,
                    marketOrders: ordersListNew,
                    loading:false,
                    data:''
                });
            }
            else {
                dispatch({
                    type: SET_MARKET_ORDERS,
                    marketOrders: [],
                    loading: false,
                    data: "Orders not found",
                });
            }

        } catch (err) {
            console.log(err);
            dispatch({
                type: SET_MARKET_ORDERS,
                marketOrders: [],
                loading: false,
                data: "Orders not found",
            });
        }
    };
};
