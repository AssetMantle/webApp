import React, { useState, useEffect } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Login } from './actions';
import { IdentityLogin } from "./actions/forms/login";
import AddressLogin from './actions/AddressLogin';
import { SignUp } from './actions/forms';
import { HomePage, RouteNotFound } from './components';
import HeaderAfterLogin from './components/Headers/HeaderAfterLogin';
import HeaderBeforeLogin from './components/Headers/HeaderBeforeLogin';
import offline from './assets/images/offline.svg';
import { Maintainers, Identities, Assets, Orders, MarketPlace, AssetView, IdentityView, OrderView, AllIdentityList } from './actions/views';
import Footer from './components/Footer';
import { useTranslation } from 'react-i18next';
import './assets/css/styles.css';
import './assets/css/mediaqueries.css';

const App = () => {
    const { t } = useTranslation();
    const userTypeToken = localStorage.getItem('identityId');
    const routes = [{
        path: '/',
        component: HomePage
    }, {
        path: '/Login',
        component: Login
    }, {
        path: '/addressLogin',
        component: AddressLogin
    }, {
        path: '/SignUp',
        component: SignUp
    }, {
        path: '/assets',
        component: Assets
    }, {
        path: '/orders',
        component: Orders
    }, {
        path: '/profile',
        component: Identities
    }, {
        path: '/allidentities',
        component: AllIdentityList
    }, {
        path: '/maintainers',
        component: Maintainers
    }, {
        path: '/marketplace',
        component: MarketPlace
    },{
        path: '/AssetView',
        component: AssetView
    }, {
        path: '/IdentityView',
        component: IdentityView
    }, {
        path: '/OrderView',
        component: OrderView
    }, {
        path: '/identityLogin',
        component: IdentityLogin
    }];

    const [isOnline, setNetwork] = useState(window.navigator.onLine);
    const updateNetwork = () => {
        setNetwork(window.navigator.onLine);
    };
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
                {
                    routes.map((route) =>
                        <Route
                            key={route.path}
                            exact
                            component={route.component}
                            path={route.path}/>
                    )
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
