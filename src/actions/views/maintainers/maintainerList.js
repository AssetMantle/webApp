import React, {useState, useEffect} from "react";
import maintainersQueryJS from "persistencejs/transaction/maintainers/query";
import identitiesQueryJS from "persistencejs/transaction/identity/query";
import {Button} from "react-bootstrap";
import {Deputize} from "../../forms/maintainers";
import {useTranslation} from "react-i18next";
import Loader from "../../../components/loader";
import Copy from "../../../components/copy";
import metasQueryJS from "persistencejs/transaction/meta/query";
import GetProperty from "../../../utilities/Helpers/getProperty";
import FilterHelpers from "../../../utilities/Helpers/filter";
import GetMeta from "../../../utilities/Helpers/getMeta";
import config from "../../../constants/config";

const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API);
const identitiesQuery = new identitiesQueryJS(process.env.REACT_APP_ASSET_MANTLE_API);
const maintainersQuery = new maintainersQueryJS(process.env.REACT_APP_ASSET_MANTLE_API);

const MaintainerList = React.memo(() => {
    const PropertyHelper = new GetProperty();
    const FilterHelper = new FilterHelpers();
    const GetMetaHelper = new GetMeta();

    const {t} = useTranslation();
    const [loader, setLoader] = useState(true);
    const [maintainersList, setMaintainersList] = useState([]);
    const [maintainer, setMaintainer] = useState({});
    const userAddress = localStorage.getItem('address');
    const [externalComponent, setExternalComponent] = useState("");

    useEffect(() => {
        const fetchOrder = () => {
            const identities = identitiesQuery.queryIdentityWithID("all");
            identities.then(function (item) {
                const data = JSON.parse(item);
                const dataList = data.result.value.identities.value.list;
                if (dataList) {
                    const filterIdentities = FilterHelper.FilterIdentitiesByProvisionedAddress(dataList, userAddress);
                    const maintainersData = maintainersQuery.queryMaintainerWithID("all");
                    maintainersData.then(function (item) {
                        const parsedMaintainersData = JSON.parse(item);
                        const maintainersDataList = parsedMaintainersData.result.value.maintainers.value.list;
                        if (maintainersDataList) {
                            const filterMaintainersByIdentity = FilterHelper.FilterMaintainersByIdentity(filterIdentities, maintainersDataList);
                            if (filterMaintainersByIdentity.length) {
                                setMaintainersList(filterMaintainersByIdentity);
                                filterMaintainersByIdentity.map((identity, index) => {
                                    let maintainedTraits = "";
                                    if (identity.value.maintainedTraits.value.properties.value.propertyList !== null) {
                                        maintainedTraits = PropertyHelper.ParseProperties(identity.value.maintainedTraits.value.properties.value.propertyList);
                                    }
                                    let maintainedTraitsKeys = Object.keys(maintainedTraits);
                                    GetMetaHelper.AssignMetaValue(maintainedTraitsKeys, maintainedTraits, metasQuery, 'maintainedTraits', index);
                                    setLoader(false);
                                });
                            } else {
                                setLoader(false);
                            }
                            setLoader(false);
                        }
                    });
                } else {
                    setLoader(false);
                }
            });
        };
        fetchOrder();
    }, []);

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
                        let maintainerPropertyList = "";
                        if (maintainer.value.maintainedTraits.value.properties.value.propertyList !== null) {
                            maintainerPropertyList = PropertyHelper.ParseProperties(maintainer.value.maintainedTraits.value.properties.value.propertyList);
                        }
                        let keys = Object.keys(maintainerPropertyList);
                        let classificationID = maintainer.value.id.value.classificationID.value.idString;
                        let id = maintainer.value.id.value.identityID.value.idString;
                        return (
                            <div className="col-xl-4 col-lg-6 col-md-6  col-sm-12" key={index}>
                                <div className="card height-medium maintainer-card">
                                    <div className="info-section">
                                        {(maintainer.value.addMaintainer) ?
                                            <div>
                                                <Button size="sm" variant="secondary"
                                                    onClick={() => handleModalData('DeputizeMaintainer', maintainer)}>{t("DEPUTIZE")}</Button>
                                            </div> : ""
                                        }
                                        <div className="list-item">
                                            <p className="list-item-label">{t("CLASSIFICATION_ID")}:</p>
                                            <div className="list-item-value id-section">
                                                <p className="id-string" title={classificationID}> {classificationID}</p>
                                            </div>
                                            <Copy
                                                id={classificationID}/>
                                        </div>
                                        <div className="list-item">
                                            <p className="list-item-label">{t("IDENTITY_ID")}:</p>
                                            <div className="list-item-value id-section">
                                                <p className="id-string" title={id}> {id}</p>

                                            </div>
                                            <Copy
                                                id={id}/>
                                        </div>

                                        {keys !== null ?
                                            keys.map((keyName, index1) => {
                                                if (maintainerPropertyList[keyName] !== "" && keyName !== 'style' && keyName !== config.URI) {
                                                    return (<div key={index + keyName} className="list-item"><p className="list-item-label">{keyName}:</p> <p
                                                        id={`maintainedTraits` + index + `${index1}`} className="list-item-value"></p></div>);
                                                } else if(keyName !== 'style' && keyName !== config.URI){
                                                    return (
                                                        <div key={index + keyName} className="list-item"><p className="list-item-label">{keyName}: </p> <p className="list-item-hash-value">{maintainerPropertyList[keyName]}</p></div>);
                                                }
                                            })
                                            : ""
                                        }
                                    </div>
                                </div>
                            </div>
                        );
                    })
                    : <p className="empty-list">{t("MAINTAINERS_NOT_FOUND")}</p>}

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
