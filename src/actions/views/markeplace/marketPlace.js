import React from "react";
import {useTranslation} from "react-i18next";
import Sidebar from "../../../components/sidebar/sidebar";
import {Summary} from "../../../components/summary";
import TotalOrders from "./totalOrderList"

const MarketPlace = () => {
    const {t} = useTranslation();
    return (
        <div className="content-section">
            <Sidebar/>
            <div className="accountInfo">
                <div className="row">
                    <div className="col-md-9 card-deck">
                        <div className="dropdown-section">
                            <h4>Marketplace</h4>
                        </div>
                        <TotalOrders/>
                    </div>
                    <div className="col-md-3 summary-section">
                        <Summary/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketPlace;