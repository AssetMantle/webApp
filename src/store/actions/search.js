import {SET_FILTER_ORDERS} from "./filterOrders";

export const SET_MARKET_ORDERS_COPY = "SET_MARKET_ORDERS_COPY";
import base64url from "base64url";

export const fetchSearchResult = (key) => {
    return async (dispatch, getState) => {
        try {
            const marketOrder = getState().markePlace.markeOrders;
            // const marketOrderCopy = getState().markePlace.marketOrdersCopy;
            const filterOrders = getState().filterOrders.empty;
            const category = getState().filterOrders.category;
            const filterOrdersList = getState().filterOrders.filterOrders;

            console.log(filterOrders, category, "in actions search", filterOrdersList);

            let result =[];
            if(filterOrders && key === ""){
                dispatch({
                    type: SET_MARKET_ORDERS_COPY,
                    marketOrdersCopy: marketOrder,
                    empty:true,
                    multiSearch:false,
                    loading: false,
                    data: ''
                });
            }else if(!filterOrders && key !== ""){
                result = filterOrdersList.filter(item => (base64url.decode(item['totalData']['name']).toLowerCase()).includes(key.toLowerCase()));
                console.log(result, "result");
                dispatch({
                    type: SET_MARKET_ORDERS_COPY,
                    marketOrdersCopy: result,
                    empty:false,
                    multiSearch:true,
                    loading: false,
                    data: ''
                });
                dispatch({
                    type: SET_FILTER_ORDERS,
                    filterOrders: filterOrdersList,
                    empty:false,
                    multiSearch:false,
                    loading: false,
                    data: ''
                });
            }else if(!filterOrders && key === ""){
                console.log(marketOrder, category, "category");
                result = marketOrder.filter(item => (base64url.decode(item['totalData']['category']).toLowerCase()).includes(category.toLowerCase()));
                dispatch({
                    type: SET_MARKET_ORDERS_COPY,
                    marketOrdersCopy: result,
                    empty:false,
                    multiSearch:true,
                    loading: false,
                    data: ''
                });
                dispatch({
                    type: SET_FILTER_ORDERS,
                    filterOrders: filterOrdersList,
                    empty:false,
                    multiSearch:false,
                    loading: false,
                    data: ''
                });
            }else {
                result = marketOrder.filter(item => (base64url.decode(item['totalData']['name']).toLowerCase()).includes(key.toLowerCase()));
                console.log(result, "result");
                dispatch({
                    type: SET_MARKET_ORDERS_COPY,
                    marketOrdersCopy: result,
                    empty:false,
                    multiSearch:false,
                    loading: false,
                    data: ''
                });
            }

        } catch (err) {
            console.log(err,"in search");
            dispatch({
                type: SET_MARKET_ORDERS_COPY,
                marketOrdersCopy: [],
                empty:true,
                multiSearch:false,
                loading: false,
                data: ''
            });
        }
    };
};
