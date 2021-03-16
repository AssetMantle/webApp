import React, {useState} from "react";
import {Dropdown} from "react-bootstrap";
import {Define} from "../../forms";
import ordersDefineJS from "persistencejs/transaction/orders/define";
import {useTranslation} from "react-i18next";
import Sidebar from "../../../components/sidebar/sidebar";
import OrderList from "./orderList";
import {Summary} from "../../../components/summary";

const ordersDefine = new ordersDefineJS(process.env.REACT_APP_ASSET_MANTLE_API)

const Orders = () => {
    const {t} = useTranslation();
    const [externalComponent, setExternalComponent] = useState("");
    const [order, setOrder] = useState([]);

    const handleModalData = (formName, order) => {
        setOrder(order);
        setExternalComponent(formName)
    }

    return (
        <div className="content-section">
            {/*<Sidebar/>*/}
            <div className="accountInfo">
                <div className="row">
                    <div className="col-md-9 card-deck">
                        <div className="dropdown-section">
                            <div className="container">

                            </div>
                        </div>
                        <OrderList/>
                    </div>
                    <div className="col-md-3 summary-section">
                        <Summary/>
                    </div>
                </div>
            </div>

            {externalComponent === 'DefineOrder' ?
                <Define setExternalComponent={setExternalComponent} ActionName={ordersDefine}
                        FormName={'Define Order'}/> :
                null
            }

        </div>
    );
};

export default Orders;
