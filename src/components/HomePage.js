import React from "react";
import {useTranslation} from "react-i18next";
const HomePage = () => {
    const { t } = useTranslation();
        return (
            <div className="homeSection">
                <div className="container">
                    <div className="row row-cols-1 row-cols-md-2 card-deck infoRow">
                        <div className="col-md-12 appInfoBox">
                            <p>{t("BANNER_CONTENT")}</p>
                        </div>
                    </div>
                </div>

            </div>
        );
    }

export default HomePage
