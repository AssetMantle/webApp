export const SET_MULIT_FILTER_ORDERS = "SET_MULIT_FILTER_ORDERS";
import base64url from "base64url";

export const fetchMulitiFilters = (key) => {
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
                    multiSearch:false,
                    loading: false,
                    data: ''
                });
            }else if(searchEmpty && key === "all"){
                dispatch({
                    type: SET_FILTER_ORDERS,
                    marketOrdersCopy: marketOrder,
                    empty:true,
                    multiSearch:false,
                    loading: false,
                    data: ''
                });
            }else if(marketOrderCopy.length){
                result = marketOrderCopy.filter(item => (base64url.decode(item['totalData']['category']).toLowerCase()).includes(key.toLowerCase()));
                dispatch({
                    type: SET_FILTER_ORDERS,
                    filterOrders: result,
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
                loading: false,
                data: ''
            });
        }
    };
};
