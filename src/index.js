import React from "react";
import ReactDOM from "react-dom";
import {Router} from "react-router-dom";
import App from "./App";
import history from './components/History';
import "./components/Internationalization/i18n";
const rootElement = document.getElementById("root");
ReactDOM.render(<Router history={history}>
    <App/>
</Router>, rootElement);