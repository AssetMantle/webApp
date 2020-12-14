import React from "react";
import {useTranslation} from "react-i18next";
import Sidebar from "../../../components/sidebar/sidebar";
import {Summery} from "../../../components/summery";
import MaintainerList from "./maintainerList"

const Maintainers = () => {
    const {t} = useTranslation();
    return (
        <div className="content-section">
            <Sidebar/>
            <div className="accountInfo">
                <div className="row">
                    <div className="col-md-9 card-deck">
                        <div className="dropdown-section">
                            <h4>Maintainers</h4>
                        </div>
                        <MaintainerList/>
                    </div>
                    <div className="col-md-3 summery-section">
                        <Summery/>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Maintainers;
