import {SET_MARKET_ORDERS_COPY} from '../actions/search';

const initialState = {
    marketOrdersCopy:[],
    empty:true,
    multiSearch:false,
    error: '',
    loading: true
};

export default (state = initialState, action) => {
    if (action.type === SET_MARKET_ORDERS_COPY) {
        return {
            marketOrdersCopy:action.marketOrdersCopy,
            empty:action.empty,
            multiSearch:action.multiSearch,
            error: action.data,
            loading: action.loading
        };
    }
    return state;
};
