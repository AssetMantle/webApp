import {SET_ASSETS,} from '../actions/assets';

const initialState = {
    assetList: [],
    error: '',
    loading: true
};

export default (state = initialState, action) => {
    if (action.type === SET_ASSETS) {
        return {
            assetList: action.assets,
            error: action.data,
            loading: action.loading
        };
    }

    return state;
};
