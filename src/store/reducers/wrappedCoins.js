import {
    SET_WRAPPED_COINS,
} from '../actions/wrappedCoins';

const initialState = {
    wrappedCoins: 0,
    error:'',
};

export default (state = initialState, action) => {
    if (action.type === SET_WRAPPED_COINS) {
        return {
            wrappedCoins: action.wrappedCoins,
            error:action.data,
        };
    }
    return state;
};
