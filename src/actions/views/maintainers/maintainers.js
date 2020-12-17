import React from "react";
import {useTranslation} from "react-i18next";
import Sidebar from "../../../components/sidebar/sidebar";
import {Summary} from "../../../components/summary";
import MaintainerList from "./maintainerList"
import {Dropdown} from "react-bootstrap";

const Maintainers = () => {
    const {t} = useTranslation();
    return (
        <div className="content-section">
            <Sidebar/>
            <div className="accountInfo">
                <div className="row">
                    <div className="col-md-9 card-deck">
                        <div className="dropdown-section">
                            <h4>{t("MAINTAINERS")}</h4>
                        </div>
                        <MaintainerList/>
                    </div>
                    <div className="col-md-3 summary-section">
                        <Summary/>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Maintainers;
