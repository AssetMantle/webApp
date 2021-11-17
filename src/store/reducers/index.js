import {combineReducers} from 'redux';
import markePlace from "./marketPlace";
import assets from "./assets";
import orders from "./orders";
import identities from "./identities";
import faucet from "./faucet";
import maintainers from "./maintainers";
import wrappedCoins from "./wrappedCoins";
import search from "./search";
import filterOrders from "./filterOrders";

export default combineReducers({
    markePlace: markePlace,
    assets: assets,
    orders: orders,
    identities: identities,
    faucet: faucet,
    maintainers: maintainers,
    wrappedCoins: wrappedCoins,
    search,
    filterOrders
});

