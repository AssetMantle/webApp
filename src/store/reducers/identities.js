import {SET_IDENTITIES,} from '../actions/identities';

const initialState = {
    identityList: [],
    error: '',
    loading: true
};

export default (state = initialState, action) => {
    if (action.type === SET_IDENTITIES) {
        return {
            identityList: action.identities,
            error: action.data,
            loading: action.loading
        };
    }

    return state;
};
