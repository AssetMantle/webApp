import React, { useState, useEffect } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { HomePage } from './components';
import HeaderAfterLogin from './components/Headers/HeaderAfterLogin';
import HeaderBeforeLogin from './components/Headers/HeaderBeforeLogin';
import offline from './assets/images/offline.svg';
import { MarketPlace} from './containers/views';
import Footer from './components/Footer';
import { useTranslation } from 'react-i18next';
import './assets/css/styles.css';
import './assets/css/mediaqueries.css';
import * as markePlace from "./store/actions/marketPlace";
import * as assets from "./store/actions/assets";
import * as orders from "./store/actions/orders";
import * as identities from "./store/actions/identities";
import * as maintainers from "./store/actions/maintainers";
import {useDispatch} from "react-redux";
import PrivateRoute from "./containers/PrivateRoute";
import "react-image-lightbox/style.css";
import routes from "./routes";
import RouteNotFound from "./components/RouteNotFound";

const App = () => {
    const { t } = useTranslation();
    const userTypeToken = localStorage.getItem('userName');
    const identityID = localStorage.getItem('identityId');
    const [isOnline, setNetwork] = useState(window.navigator.onLine);
    const updateNetwork = () => {
        setNetwork(window.navigator.onLine);
    };
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchOrder = async () => {
            await Promise.all([
                dispatch(markePlace.fetchMarketPlace()),
                dispatch(assets.fetchAssets(identityID)),
                dispatch(orders.fetchOrders(identityID)),
                dispatch(identities.fetchIdentities(identityID)),
                dispatch(maintainers.fetchMaintainers(identityID)),
            ]);
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

            <Switch>
                <Route
                    key="/"
                    exact
                    component={userTypeToken === undefined || userTypeToken === null || userTypeToken === '' ? withRouter(HomePage) : withRouter(MarketPlace)}
                    path="/"/>
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

            {
                userTypeToken === null || window.location.pathname === '/'
                    ? <Footer/>
                    : ''
            }
        </div>
    );
};

export default withRouter(App);
