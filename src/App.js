import React, {useState, useEffect} from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import {IdentityList, LoginAction} from "./actions";
import { HomePage, RouteNotFound , Header } from "./components";
import offline from "./assets/images/offline.svg";
const App = () =>{
const routes = [{
    path: '/',
    component: HomePage,
},{
    path: '/LoginAction',
    component: LoginAction,
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
