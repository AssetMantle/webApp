import {SET_FAUCET_DATA,} from '../actions/faucet';

const initialState = {
    faucetData: [],
    error: '',
};

export default (state = initialState, action) => {
    if (action.type === SET_FAUCET_DATA) {
        return {
            faucetData: action.faucetData,
            error: action.data,
        };
    }
    return state;
};
