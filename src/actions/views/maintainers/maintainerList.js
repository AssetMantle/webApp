import React, {useState, useEffect} from "react";
import maintainersQueryJS from "persistencejs/transaction/maintainers/query";
import Helpers from "../../../utilities/Helper";
import identitiesQueryJS from "persistencejs/transaction/identity/query";
import {Button, Modal} from "react-bootstrap";
import {Deputize} from "../../forms/maintainers";
import {useTranslation} from "react-i18next";
import Loader from "../../../components/loader"
import Copy from "../../../components/copy";

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
                            setMaintainersList(filterMaintainersByIdentity);
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
                        const maintainerPropertyList = Helper.ParseProperties(maintainer.value.maintainedTraits.value.properties.value.propertyList)
                        let keys = Object.keys(maintainerPropertyList);
                        let id = maintainer.value.id.value.classificationID.value.idString+"*"+maintainer.value.id.value.identityID.value.idString
                        return (
                            <div className="col-xl-4 col-lg-6 col-md-6  col-sm-12" key={index}>
                                <div className="card height-medium">
                                    {(maintainer.value.addMaintainer) ?
                                        <div>
                                            <Button size="sm" variant="secondary"
                                                onClick={() => handleModalData('BurnAsset', maintainer)}>Deputize</Button>
                                        </div> : ""
                                    }
                                    <div className="list-item">
                                        <p className="list-item-label">{t("ID")}</p>
                                        <div className="list-item-value id-section">
                                            <p className="id-string" title={id}>: {id}</p>
                                            <Copy
                                                id={id}/>
                                        </div>
                                    </div>
                                    {
                                        keys.map((keyName) => {
                                            return (
                                                <div key={index + keyName} className="list-item"><p className="list-item-label">{keyName} </p>: <p className="list-item-hash-value id-string" title={maintainerPropertyList[keyName]}>{maintainerPropertyList[keyName]}</p></div>
                                                )
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                    : <p className="empty-list">{t("MAINTAINERS_NOT_FOUND")}</p>}

            </div>
            <div>
                {
                    externalComponent === 'BurnAsset' ?
                        <Deputize setExternalComponent={setExternalComponent} maintainerData={maintainer}/> :
                        null
                }
            </div>
        </div>
    );
})

export default MaintainerList;
