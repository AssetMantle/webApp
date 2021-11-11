import React, {useState} from "react";
import {Button} from "react-bootstrap";
import {Deputize} from "../../forms/maintainers";
import {useTranslation} from "react-i18next";
import Loader from "../../../components/loader";
import Copy from "../../../components/copy";
import config from "../../../constants/config";
import {useSelector} from "react-redux";

const MaintainerList = React.memo(() => {


    const maintainersList = useSelector((state) => state.maintainers.maintainersList);
    const loader = useSelector((state) => state.maintainers.loading);
    const error = useSelector((state) => state.maintainers.error);

    const {t} = useTranslation();
    const [maintainer, setMaintainer] = useState({});
    const [externalComponent, setExternalComponent] = useState("");


    const handleModalData = (formName, maintainer1) => {
        setMaintainer(maintainer1);
        setExternalComponent(formName);
    };

    return (
        <div className="list-container">
            {loader ?
                <Loader/>
                : ""
            }
            <div className="row card-deck">
                {maintainersList.length ?
                    maintainersList.map((maintainer, index) => {

                        return (
                            <div className="col-xl-4 col-lg-6 col-md-6  col-sm-12" key={index}>
                                <div className="card height-medium maintainer-card">
                                    <div className="info-section">
                                        {(maintainer['addMaintainer']) ?
                                            <div>
                                                <Button size="sm" variant="secondary"
                                                    onClick={() => handleModalData('DeputizeMaintainer', maintainer)}>{t("DEPUTIZE")}</Button>
                                            </div> : ""
                                        }
                                        <div className="list-item">
                                            <p className="list-item-label">{t("CLASSIFICATION_ID")}:</p>
                                            <div className="list-item-value id-section">
                                                <p className="id-string"
                                                    title={maintainer['classificationID']}> {maintainer['classificationID']}</p>
                                            </div>
                                            <Copy
                                                id={maintainer['classificationID']}/>
                                        </div>
                                        <div className="list-item">
                                            <p className="list-item-label">{t("IDENTITY_ID")}:</p>
                                            <div className="list-item-value id-section">
                                                <p className="id-string"
                                                    title={maintainer['identityID']}> {maintainer['identityID']}</p>

                                            </div>
                                            <Copy
                                                id={maintainer['identityID']}/>
                                        </div>
                                        {
                                            Object.keys(maintainer['totalData']).map((keyName) => {
                                                if (keyName !== config.URI && keyName !== 'style') {
                                                    return (
                                                        keyName !== 'style' && keyName !== config.URI ?
                                                            <div className="list-item">
                                                                <p
                                                                    className="list-item-label">{keyName} </p>
                                                                <p
                                                                    className="list-item-value">{maintainer['totalData'][keyName]}</p>
                                                            </div>
                                                            : ""

                                                    );
                                                }
                                            })
                                        }

                                    </div>
                                </div>
                            </div>
                        );
                    })
                    : ""}
                {
                    error !== '' ?
                        <p className="empty-list">{t("MAINTAINERS_NOT_FOUND")}</p>
                        : ""
                }

            </div>
            <div>
                {
                    externalComponent === 'DeputizeMaintainer' ?
                        <Deputize setExternalComponent={setExternalComponent} maintainerData={maintainer}/> :
                        null
                }
            </div>
        </div>
    );
});

export default MaintainerList;

