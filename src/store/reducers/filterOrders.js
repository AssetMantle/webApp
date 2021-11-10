import {SET_FILTER_ORDERS} from '../actions/filterOrders';

const initialState = {
    filterOrders:[],
    empty:true,
    errorData: '',
    category:'all',
    multiSearch:false,
    loading: true
};

export default (state = initialState, action) => {
    if (action.type === SET_FILTER_ORDERS) {
        return {
            filterOrders:action.filterOrders,
            empty:action.empty,
            category:action.category,
            multiSearch:action.multiSearch,
            errorData: action.errorData,
            loading: action.loading
        };
    }
    return state;
};
