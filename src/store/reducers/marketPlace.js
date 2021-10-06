import {
    SET_MARKET_ORDERS,
} from '../actions/marketPlace';

const initialState = {
    markeOrders: [],
    error:'',
    loading:true
};

export default (state = initialState, action) => {
    if (action.type === SET_MARKET_ORDERS) {
        return {
            markeOrders: action.marketOrders,
            error:action.data,
            loading:action.loading
        };
    }

    return state;
};
