import {SET_MARKET_ORDERS_COPY} from "./search";

export const SET_FILTER_ORDERS = "SET_FILTER_ORDERS";
import base64url from "base64url";

export const fetchFilterOrders = (key) => {
    return async (dispatch, getState) => {
        try {
            const marketOrder = getState().markePlace.markeOrders;
            const searchEmpty = getState().search.empty;
            const marketOrderCopy = getState().search.marketOrdersCopy;
            console.log(marketOrderCopy, searchEmpty, "outside");

            let result =[];
            if(searchEmpty && key !== "all"){
                result = marketOrder.filter(item => (base64url.decode(item['totalData']['category']).toLowerCase()).includes(key.toLowerCase()));
                console.log(marketOrder, "in filter");
                dispatch({
                    type: SET_FILTER_ORDERS,
                    filterOrders: result,
                    empty:false,
                    category:key,
                    multiSearch:false,
                    loading: false,
                    data: ''
                });
            }else if(searchEmpty && key === "all"){
                dispatch({
                    type: SET_FILTER_ORDERS,
                    marketOrdersCopy: marketOrder,
                    empty:true,
                    category:key,
                    multiSearch:false,
                    loading: false,
                    data: ''
                });
            }else if(!searchEmpty && key === "all"){
                console.log(marketOrderCopy, "}else if(!searchEmpty && key === \"all\"){ " );
                dispatch({
                    type: SET_FILTER_ORDERS,
                    marketOrdersCopy: marketOrderCopy,
                    empty:true,
                    category:key,
                    multiSearch:false,
                    loading: false,
                    data: ''
                });
            }else if(marketOrderCopy.length){
                result = marketOrderCopy.filter(item => (base64url.decode(item['totalData']['category']).toLowerCase()).includes(key.toLowerCase()));
                console.log(result, "in else if(marketOrderCopy.length){ " );
                dispatch({
                    type: SET_FILTER_ORDERS,
                    filterOrders: result,
                    empty:false,
                    category:key,
                    multiSearch:true,
                    loading: false,
                    data: ''
                });
                dispatch({
                    type: SET_MARKET_ORDERS_COPY,
                    marketOrdersCopy: marketOrderCopy,
                    empty:false,
                    multiSearch:false,
                    loading: false,
                    data: ''
                });
            }

        } catch (err) {
            console.log(err,"in search");
            dispatch({
                type: SET_FILTER_ORDERS,
                filterOrders: [],
                empty:true,
                category:key,
                loading: false,
                data: ''
            });
        }
    };
};
