import React, {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import Sidebar from "../sidebar/sidebar";
import GetProperty from "../../utilities/Helpers/getProperty";

import {Summary} from "../summary";
import Copy from "../copy";
import maintainersQueryJS from "persistencejs/transaction/maintainers/query";
import {useHistory} from "react-router-dom";
import Icon from "../../icons";

const maintainersQuery = new maintainersQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)

const SearchMaintainer = React.memo((props) => {
    const PropertyHelper = new GetProperty();


    const {t} = useTranslation();
    let history = useHistory();
    const [maintainersList, setMaintainersList] = useState([]);
    useEffect(() => {
        if (props.location.data !== undefined) {
            const maintainersData = maintainersQuery.queryMaintainerWithID(props.location.data.data)
            maintainersData.then(function (item) {
                const parsedMaintainersData = JSON.parse(item);
                const maintainersDataList = parsedMaintainersData.result.value.maintainers.value.list;
                if (maintainersDataList.length) {
                    setMaintainersList(maintainersDataList);
                }
            })
        }
    }, [])

    return (
        <div className="content-section">
            <Sidebar/>
            <div className="accountInfo">
                <div className="row">
                    <div className="col-md-9 card-deck">
                        <div className="dropdown-section">
                            <h4>Search Results : {props.location.data !== undefined ? props.location.data.data : ""}</h4>
                            <p className="back-arrow" onClick={() => history.push(props.location.data.currentPath)}> <Icon viewClass="arrow-icon" icon="arrow" /> Back</p>
                        </div>
                        <div className="list-container">
                            <div className="row card-deck">
                                {maintainersList.map((maintainer, index) => {
                                    const maintainerPropertyList = PropertyHelper.ParseProperties(maintainer.value.maintainedTraits.value.properties.value.propertyList)
                                    let keys = Object.keys(maintainerPropertyList);
                                    let id = maintainer.value.id.value.classificationID.value.idString+"*"+maintainer.value.id.value.identityID.value.idString
                                    return (
                                        <div className="col-xl-3 col-lg-4 col-md-6  col-sm-12" key={index}>
                                            <div className="card height-medium">
                                                <div className="info-section">
                                                <div className="list-item">
                                                    <p className="list-item-label">{t("ID")} :</p>
                                                    <div className="list-item-value id-section">
                                                        <div className="flex">
                                                        <p className="id-string" title={id}> {id}</p>
                                                        </div>
                                                    </div>
                                                    <Copy
                                                        id={id}/>
                                                </div>
                                                {
                                                    keys.map((keyName) => {
                                                        return (
                                                            <div key={index + keyName} className="list-item"><p className="list-item-label">{keyName}: </p> <div className="list-item-value id-section"><p className="id-string"  title={maintainerPropertyList[keyName]}>{maintainerPropertyList[keyName]}</p></div></div>
                                                        )
                                                    })
                                                }
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 summary-section">
                        <Summary/>
                    </div>
                </div>
            </div>
        </div>

    );
})

export default SearchMaintainer;
