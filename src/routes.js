import {Login} from "./containers";
import AddressLogin from "./containers/AddressLogin";
import CreateIdentity from "./containers/forms/signup/CreateIdentity";
import {
    Assets,
    AssetView,
    Identities,
    IdentityView,
    Maintainers,
    MarketPlace,
    Orders,
    OrderView
} from "./containers/views";
import {IdentityLogin} from "./containers/forms/login";
import KeysCreate from "./containers/forms/createKeys/KeysCreate";
import {MintAsset} from "./containers/forms/assets";
import ListOrderView from "./containers/views/orders/orderView";

const routes = [{
    path: '/',
    component: MarketPlace,
    private: false,
}, {
    path: '/marketplace',
    component: MarketPlace,
    private: false,
}, {
    path: '/login',
    component: Login,
    private: false,
}, {
    path: '/address/login',
    component: AddressLogin,
    private: false,
}, {
    path: '/signup',
    component: CreateIdentity,
    private: false,
}, {
    path: '/assets',
    component: Assets,
    private: true,
}, {
    path: '/orders',
    component: Orders,
    private: true,
}, {
    path: '/profile',
    component: Identities,
    private: true,
},{
    path: '/maintainers',
    component: Maintainers,
    private: true,
}, {
    path: '/asset/view',
    component: AssetView,
    private: true,
}, {
    path: '/identity/view',
    component: IdentityView,
    private: true,
}, {
    path: '/view/:id',
    component: OrderView,
    private: false,
}, {
    path: '/list/view/:id',
    component: ListOrderView,
    private: false,
}, {
    path: '/identityLogin',
    component: IdentityLogin,
    private: true,
}, {
    path: '/create',
    component: KeysCreate,
    private: false,
}, {
    path: '/mint',
    component: MintAsset,
    private: true,
}];

export default routes;
