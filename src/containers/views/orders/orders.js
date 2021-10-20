import React, {useState} from "react";
import {Dropdown} from "react-bootstrap";
import {defineOrder} from "persistencejs/build/transaction/orders/define";
import {useTranslation} from "react-i18next";
import Sidebar from "../../../components/sidebar/sidebar";
import OrderList from "./orderList";
import {Summary} from "../../../components/summary";
import DefineOrder from "../../forms/orders/DefineOrder";
import {Define} from "../../forms";
const ordersDefine = new defineOrder(process.env.REACT_APP_ASSET_MANTLE_API);

const Orders = () => {
    const {t} = useTranslation();
    const [externalComponent, setExternalComponent] = useState("");

    const handleModalData = (formName) => {
        setExternalComponent(formName);
    };

    return (
        <div className="content-section">
            <Sidebar/>
            <div className="accountInfo">
                <div className="row">
                    <div className="col-md-9 card-deck">
                        <div className="dropdown-section">
                            <h4>Orders</h4>
                            <Dropdown>
                                <Dropdown.Toggle  id="dropdown-basic">
                                    {t("ACTIONS")}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        onClick={() => handleModalData("DefineOrder")}>{t("DEFINE_ORDER")}</Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={() => handleModalData("DefineOrder1")}>{t("DEFINE_ORDER1")}</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <OrderList/>
                    </div>
                    <div className="col-md-3 summary-section">
                        <Summary/>
                    </div>
                </div>
            </div>

            {externalComponent === 'DefineOrder' ?
                <DefineOrder setExternalComponent={setExternalComponent} ActionName={ordersDefine}
                    FormName={'Define Order'}/> :
                null
            }
            {externalComponent === 'DefineOrder1' ?
                <Define setExternalComponent={setExternalComponent} ActionName={ordersDefine}
                    FormName={'Define Order'}/> :
                null
            }

        </div>
    );
};

export default Orders;
