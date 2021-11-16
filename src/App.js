import React, {useEffect, useState} from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import HeaderAfterLogin from './components/Headers/HeaderAfterLogin';
import HeaderBeforeLogin from './components/Headers/HeaderBeforeLogin';
import offline from './assets/images/offline.svg';
import {useTranslation} from 'react-i18next';
import './assets/css/styles.css';
import './assets/css/mediaqueries.css';
import * as markePlace from "./store/actions/marketPlace";
import * as assets from "./store/actions/assets";
import * as orders from "./store/actions/orders";
import * as identities from "./store/actions/identities";
import * as maintainers from "./store/actions/maintainers";
import * as wrappedCoins from "./store/actions/wrappedCoins";
import {useDispatch} from "react-redux";
import PrivateRoute from "./containers/PrivateRoute";
import "react-image-lightbox/style.css";
import routes from "./routes";
import RouteNotFound from "./components/RouteNotFound";
import Footer from "./components/Footer";
import * as faucet from "./store/actions/faucet";

const App = () => {
    const {t} = useTranslation();
    const userTypeToken = localStorage.getItem('userName');
    const userAddress = localStorage.getItem('userAddress');
    const identityID = localStorage.getItem('identityId');
    const [isOnline, setNetwork] = useState(window.navigator.onLine);
    const updateNetwork = () => {
        setNetwork(window.navigator.onLine);
    };
    console.log(userTypeToken, "userTypeToken");
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchOrder = async () => {
            await dispatch(markePlace.fetchMarketPlace());
            if (userTypeToken !== null){
                await Promise.all([
                    dispatch(assets.fetchAssets(identityID)),
                    dispatch(orders.fetchOrders(identityID)),
                    dispatch(identities.fetchIdentities(identityID)),
                    dispatch(maintainers.fetchMaintainers(identityID)),
                    dispatch(faucet.fetchFaucet(userAddress)),
                    dispatch(wrappedCoins.fetchWrappedCoins(identityID))
                ]);
            }
        };
        fetchOrder();
    }, []);
    useEffect(() => {
        window.addEventListener('offline', updateNetwork);
        window.addEventListener('online', updateNetwork);
        return () => {
            window.removeEventListener('offline', updateNetwork);
            window.removeEventListener('online', updateNetwork);
        };
    });
    return (
        <div className="app">
            {
                !isOnline
                    ? <div className="network-check">
                        <div className="center">
                            <img src={offline} alt="offline"/>
                            <p>{t('NETWORK_ERROR')}</p>
                        </div>
                    </div>
                    : ''
            }
            <div className="app-nav">
                {
                    userTypeToken == null
                        ? <HeaderBeforeLogin/>
                        : <HeaderAfterLogin/>
                }
            </div>
            <div className="body-section">
                <div className="content-section">
                    <Switch>
                        {/*<Route*/}
                        {/*    key="/"*/}
                        {/*    exact*/}
                        {/*    component={userTypeToken === undefined || userTypeToken === null || userTypeToken === '' ? withRouter(HomePage) : withRouter(MarketPlace)}*/}
                        {/*    path="/"/>*/}
                        {
                            routes.map((route) => {
                                if (route.private) {
                                    return (
                                        <PrivateRoute
                                            key={route.path}
                                            exact
                                            component={withRouter(route.component)}
                                            path={route.path}
                                        />
                                    );
                                }

                                return (
                                    <Route
                                        key={route.path}
                                        exact
                                        component={withRouter(route.component)}
                                        path={route.path}/>
                                );
                            })
                        }
                        <Route component={RouteNotFound}/>
                    </Switch>
                </div>
                <Footer/>
            </div>
        </div>
    );
};

export default withRouter(App);
