import React from "react";
import {useTranslation} from "react-i18next";
import bannerImage from "../assets/images/homeBanner.svg"
import {Button} from "react-bootstrap";
const HomePage = () => {
    const { t } = useTranslation();
        return (
            <div className="container homeSection">
                    <div className="row row-cols-1 row-cols-md-2 card-deck infoRow">
                        <div className="col-md-7 appInfoBox">
                            <h3 className="banner-heading">Secure NFT wallet</h3>
                            <p className="banner-content">{t("BANNER_CONTENT")}</p>
                            <Button variant="primary" className="button-double-border">{t("KNOW_MORE")}</Button>
                        </div>
                        <div className="col-md-5 banner-image-section">
                            <img src={bannerImage} alt={"bannerImage"} />
                        </div>
                    </div>
            </div>
        );
    };

export default HomePage
