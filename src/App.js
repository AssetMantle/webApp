import React, {useState, useEffect} from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import {CreateAccount, AccountRecover, SendCoin,Login, IdentityList, BuyAsset, LoginAction, SplitSend, Assetactions, Orderactions,IssueIdentity} from "./actions";
import { HomePage, RouteNotFound , Header,
    Transactions, Dashboard, Docs} from "./components";
    import offline from "./assets/images/offline.svg";
    const App = () =>{
const routes = [{
    path: '/',
    component: HomePage,
},{
    path: '/transactions',
    component: Transactions,
}, {
    path: '/CreateAccount',
    component: CreateAccount,
}, {
    path: '/AccountRecover',
    component: AccountRecover,
}, {
    path: '/Dashboard',
    component: Dashboard,
}, {
    path: '/Docs',
    component: Docs,
}, {
    path: '/SendCoin',
    component: SendCoin,
}, {
    path: '/Login',
    component: Login,
}, {
    path: '/BuyAsset',
    component: BuyAsset,
}, {
    path: '/Split',
    component: SplitSend,
},{
    path: '/LoginAction',
    component: LoginAction,
}, {
    path: '/Assetactions',
    component: Assetactions,
}, {
    path: '/Orderactions',
    component: Orderactions,
}, {
    path: '/IssueIdentity',
    component: IssueIdentity,
},{
    path: '/IdentityList',
    component: IdentityList,
}];

    const [isOnline, setNetwork] = useState(window.navigator.onLine);
    const updateNetwork = () => {
       setNetwork(window.navigator.onLine);
    };
    useEffect(() => {
       window.addEventListener("offline", updateNetwork);
       window.addEventListener("online", updateNetwork);
       return () => {
          window.removeEventListener("offline", updateNetwork);
          window.removeEventListener("online", updateNetwork);
       };
    });
    
        return (
            <>
            {
                !isOnline ? 
                <div className="network-check">
                    <div className="center">
                    <img src={offline} alt="offline" />
                    <p>Network Disconnected. Check your data or wifi connection.</p>
                    </div>
                </div>
                : ""
            }
            <div className="container-fluid app-nav">
            <div className="container">
                <Header />
                </div>
                </div>
               
                <Switch>
                    {
                        routes.map((route) =>
                            <Route
                                key={route.path}
                                exact
                                component={route.component}
                                path={route.path}/>,
                        )
                    }
                   
                    <Route component={RouteNotFound} />
                </Switch>
            </>
            
        );
}

export default withRouter(App);
