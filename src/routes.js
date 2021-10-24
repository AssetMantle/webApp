import {HomePage} from "./components";
import {Login} from "./containers";
import AddressLogin from "./containers/AddressLogin";
import CreateIdentity from "./containers/forms/signup/CreateIdentity";
import {
    AllIdentityList,
    Assets,
    AssetView,
    Identities,
    IdentityView,
    Maintainers,
    MarketPlace,
    Orders, OrderView
} from "./containers/views";
import {IdentityLogin} from "./containers/forms/login";
import KeysCreate from "./containers/forms/signup/KeysCreate";
import {MintAsset} from "./containers/forms/assets";


const routes = [{
    path: '/',
    component: HomePage,
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
}, {
    path: '/identities/all',
    component: AllIdentityList,
    private: false,
}, {
    path: '/maintainers',
    component: Maintainers,
    private: true,
}, {
    path: '/marketplace',
    component: MarketPlace,
    private: false,
},{
    path: '/asset/view',
    component: AssetView,
    private: true,
}, {
    path: '/identity/view',
    component: IdentityView,
    private: true,
}, {
    path: '/order/view/:id',
    component: OrderView,
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
