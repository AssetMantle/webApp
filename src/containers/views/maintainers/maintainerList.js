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

    console.log(maintainersList, "maintainersList");
    const {t} = useTranslation();
    // const [maintainersList, setMaintainersList] = useState([]);
    const [maintainer, setMaintainer] = useState({});
    const [externalComponent, setExternalComponent] = useState("");
    // const identityId = localStorage.getItem('identityId');
    // useEffect(() => {
    //     const fetchOrder = () => {
    //         const identities = identitiesQuery.queryIdentityWithID(identityId);
    //         identities.then(function (item) {
    //             const data = JSON.parse(item);
    //             const dataList = data.result.value.identities.value.list;
    //             if (dataList) {
    //                 const maintainersData = maintainersQuery.queryMaintainerWithID("all");
    //                 maintainersData.then(function (item) {
    //                     const parsedMaintainersData = JSON.parse(item);
    //                     const maintainersDataList = parsedMaintainersData.result.value.maintainers.value.list;
    //                     if (maintainersDataList) {
    //                         const filterMaintainersByIdentity = FilterHelper.FilterMaintainersByIdentity(identityId, maintainersDataList);
    //                         if (filterMaintainersByIdentity.length) {
    //                             setMaintainersList(filterMaintainersByIdentity);
    //                             filterMaintainersByIdentity.map((identity, index) => {
    //                                 let maintainedTraits = "";
    //                                 if (identity.value.maintainedTraits.value.properties.value.propertyList !== null) {
    //                                     maintainedTraits = PropertyHelper.ParseProperties(identity.value.maintainedTraits.value.properties.value.propertyList);
    //                                 }
    //                                 let maintainedTraitsKeys = Object.keys(maintainedTraits);
    //                                 GetMetaHelper.AssignMetaValue(maintainedTraitsKeys, maintainedTraits, metasQuery, 'maintainedTraits', index);
    //                                 setLoader(false);
    //                             });
    //                         } else {
    //                             setLoader(false);
    //                         }
    //                         setLoader(false);
    //                     }
    //                 });
    //             } else {
    //                 setLoader(false);
    //             }
    //         });
    //     };
    //     fetchOrder();
    // }, []);

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
                                                <p className="id-string" title={maintainer['classificationID']}> {maintainer['classificationID']}</p>
                                            </div>
                                            <Copy
                                                id={maintainer['classificationID']}/>
                                        </div>
                                        <div className="list-item">
                                            <p className="list-item-label">{t("IDENTITY_ID")}:</p>
                                            <div className="list-item-value id-section">
                                                <p className="id-string" title={maintainer['identityID']}> {maintainer['identityID']}</p>

                                            </div>
                                            <Copy
                                                id={maintainer['identityID']}/>
                                        </div>
                                        {
                                            Object.keys(maintainer['totalData']).map((keyName) => {
                                                console.log(keyName, "inr eutn");
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
                                        {/*{keys !== null ?*/}
                                        {/*    keys.map((keyName, index1) => {*/}
                                        {/*        if (maintainerPropertyList[keyName] !== "" && keyName !== 'style' && keyName !== config.URI) {*/}
                                        {/*            return (<div key={index + keyName} className="list-item"><p className="list-item-label">{keyName}:</p> <p*/}
                                        {/*                id={`maintainedTraits` + index + `${index1}`} className="list-item-value"></p></div>);*/}
                                        {/*        } else if(keyName !== 'style' && keyName !== config.URI){*/}
                                        {/*            return (*/}
                                        {/*                <div key={index + keyName} className="list-item"><p className="list-item-label">{keyName}: </p> <p className="list-item-hash-value">{maintainerPropertyList[keyName]}</p></div>);*/}
                                        {/*        }*/}
                                        {/*    })*/}
                                        {/*    : ""*/}
                                        {/*}*/}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                    : ""}
                {
                    error !== '' ?
                        <p className="empty-list">{t("ASSETS_NOT_FOUND")}</p>
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

