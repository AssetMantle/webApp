import React from "react";
import ReactDOM from "react-dom";
import {Router} from "react-router-dom";
import App from "./App";
import { Provider } from 'react-redux';
import history from './components/History';
import "./components/Internationalization/i18n";
import store from "./store/store";
const rootElement = document.getElementById("root");

ReactDOM.render( 
    <Provider store={store}>
        <Router history={history}>
            <App/>
        </Router>
    </Provider>, rootElement);