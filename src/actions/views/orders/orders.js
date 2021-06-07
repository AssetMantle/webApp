import React, {useState} from "react";
import {Dropdown} from "react-bootstrap";
import {Define} from "../../forms";
import ordersDefineJS from "persistencejs/transaction/orders/define";
import {useTranslation} from "react-i18next";
import Sidebar from "../../../components/sidebar/sidebar";
import OrderList from "./orderList";
import {Summary} from "../../../components/summary";

const ordersDefine = new ordersDefineJS(process.env.REACT_APP_ASSET_MANTLE_API);

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
                <Define setExternalComponent={setExternalComponent} ActionName={ordersDefine}
                    FormName={'Define Order'}/> :
                null
            }

        </div>
    );
};

export default Orders;
