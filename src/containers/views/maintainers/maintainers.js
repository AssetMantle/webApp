import React from "react";
import {useTranslation} from "react-i18next";
import MaintainerList from "./maintainerList";

const Maintainers = () => {
    const {t} = useTranslation();
    return (
        <div>
            <div className="accountInfo">
                <div className="row">
                    <div className="col-md-9 card-deck">
                        <div className="dropdown-section">
                            <h4>{t("MAINTAINERS")}</h4>
                        </div>
                        <MaintainerList/>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Maintainers;
