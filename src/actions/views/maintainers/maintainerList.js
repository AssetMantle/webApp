import React, {useState, useEffect} from "react";
import maintainersQueryJS from "persistencejs/transaction/maintainers/query";
import Helpers from "../../../utilities/Helper";
import identitiesQueryJS from "persistencejs/transaction/identity/query";
import {Button} from "react-bootstrap";
import {Deputize} from "../../forms/maintainers";
import {useTranslation} from "react-i18next";
import Loader from "../../../components/loader"
import Copy from "../../../components/copy";
import metasQueryJS from "persistencejs/transaction/meta/query";

const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const identitiesQuery = new identitiesQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const maintainersQuery = new maintainersQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)

const MaintainerList = React.memo((props) => {
    const Helper = new Helpers();
    const {t} = useTranslation();
    const [loader, setLoader] = useState(true)
    const [maintainersList, setMaintainersList] = useState([]);
    const [maintainer, setMaintainer] = useState({});
    const userAddress = localStorage.getItem('address');
    const [externalComponent, setExternalComponent] = useState("");

    useEffect(() => {
        const fetchOrder = () => {
            const identities = identitiesQuery.queryIdentityWithID("all")
            identities.then(function (item) {
                const data = JSON.parse(item);
                const dataList = data.result.value.identities.value.list;
                if (dataList) {
                    const filterIdentities = Helper.FilterIdentitiesByProvisionedAddress(dataList, userAddress)
                    const maintainersData = maintainersQuery.queryMaintainerWithID("all")
                    maintainersData.then(function (item) {
                        const parsedMaintainersData = JSON.parse(item);
                        const maintainersDataList = parsedMaintainersData.result.value.maintainers.value.list;
                        if (maintainersDataList) {
                            const filterMaintainersByIdentity = Helper.FilterMaintainersByIdentity(filterIdentities, maintainersDataList)
                            if (filterMaintainersByIdentity.length) {
                                setMaintainersList(filterMaintainersByIdentity);
                                filterMaintainersByIdentity.map((identity, index) => {
                                    let maintainedTraits = "";
                                    if (identity.value.maintainedTraits.value.properties.value.propertyList !== null) {
                                        maintainedTraits = Helper.ParseProperties(identity.value.maintainedTraits.value.properties.value.propertyList);
                                    }
                                    let maintainedTraitsKeys = Object.keys(maintainedTraits);
                                    Helper.AssignMetaValue(maintainedTraitsKeys, maintainedTraits, metasQuery, 'maintainedTraits', index);
                                    setLoader(false)
                                })
                            } else {
                                setLoader(false)
                            }
                            setLoader(false)
                        }
                    })
                } else {
                    setLoader(false)
                }
            })
        }
        fetchOrder();
    }, []);

    const handleModalData = (formName, maintainer1) => {
        setMaintainer(maintainer1)
        setExternalComponent(formName)
    }

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
                            maintainerPropertyList = Helper.ParseProperties(maintainer.value.maintainedTraits.value.properties.value.propertyList);
                        }
                        let keys = Object.keys(maintainerPropertyList);
                        let classificationID = maintainer.value.id.value.classificationID.value.idString;
                        let id = maintainer.value.id.value.identityID.value.idString
                        return (
                            <div className="col-xl-4 col-lg-6 col-md-6  col-sm-12" key={index}>
                                <div className="card height-medium">
                                    {(maintainer.value.addMaintainer) ?
                                        <div>
                                            <Button size="sm" variant="secondary"
                                                onClick={() => handleModalData('DeputizeMaintainer', maintainer)}>{t("DEPUTIZE")}</Button>
                                        </div> : ""
                                    }
                                    <div className="list-item">
                                        <p className="list-item-label">{t("CLASSIFICATION_ID")}</p>
                                        <div className="list-item-value id-section">
                                            <p className="id-string" title={classificationID}>: {classificationID}</p>
                                            <Copy
                                                id={classificationID}/>
                                        </div>
                                    </div>
                                    <div className="list-item">
                                        <p className="list-item-label">{t("IDENTITY_ID")}</p>
                                        <div className="list-item-value id-section">
                                            <p className="id-string" title={id}>: {id}</p>
                                            <Copy
                                                id={id}/>
                                        </div>
                                    </div>

                                    {keys !== null ?
                                        keys.map((keyName, index1) => {
                                            if (maintainerPropertyList[keyName] !== "") {
                                                return (<div key={index + keyName} className="list-item"><p className="list-item-label">{keyName} </p>: <p
                                                    id={`maintainedTraits` + index + `${index1}`} className="list-item-value"></p></div>)
                                            } else {
                                                return (
                                                    <div key={index + keyName} className="list-item"><p className="list-item-label">{keyName} </p>: <p className="list-item-hash-value">{maintainerPropertyList[keyName]}</p></div>)
                                            }
                                        })
                                        : ""
                                    }
                                </div>
                            </div>
                        )
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
})

export default MaintainerList;
