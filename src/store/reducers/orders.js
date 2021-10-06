import {
    SET_USER_ORDERS,
} from '../actions/orders';

const initialState = {
    userOrders: [],
    error:'',
    loading:true
};

export default (state = initialState, action) => {
    if (action.type === SET_USER_ORDERS) {
        return {
            userOrders: action.userOrders,
            error:action.data,
            loading:action.loading
        };
    }
    return state;
};
