import {combineReducers} from 'redux';

import markePlace from "./marketPlace";
import assets from "./assets";
import orders from "./orders";
import identities from "./identities";
import faucet from "./faucet";
import maintainers from "./maintainers";
export default combineReducers({
    markePlace: markePlace,
    assets:assets,
    orders:orders,
    identities:identities,
    faucet:faucet,
    maintainers:maintainers
});

