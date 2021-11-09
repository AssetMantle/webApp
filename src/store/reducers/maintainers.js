import {SET_MAINTAINERS,} from '../actions/maintainers';

const initialState = {
    maintainersList: [],
    error: '',
    loading: true
};

export default (state = initialState, action) => {
    if (action.type === SET_MAINTAINERS) {
        return {
            maintainersList: action.maintainers,
            error: action.data,
            loading: action.loading
        };
    }

    return state;
};
