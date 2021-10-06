import {combineReducers} from 'redux';

import markePlace from "./marketPlace";
import assets from "./assets";
import orders from "./orders";
export default combineReducers({
    markePlace: markePlace,
    assets:assets,
    orders:orders
});

