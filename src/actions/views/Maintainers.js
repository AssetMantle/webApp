import React, {useState, useEffect} from "react";
import maintainersQueryJS from "persistencejs/transaction/maintainers/query";
import Helpers from "../../utilities/Helper";
import identitiesQueryJS from "persistencejs/transaction/identity/query";
import {Button, Modal} from "react-bootstrap";
import {Deputize} from "../forms";

const identitiesQuery = new identitiesQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const maintainersQuery = new maintainersQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)

const Maintainers = () => {
    const Helper = new Helpers();
    const [maintainersList, setMaintainersList] = useState([]);
    const [maintainer, setMaintainer] = useState({});
    const userAddress = localStorage.getItem('address');
    const [show, setShow] = useState(false);
    const [externalComponent, setExternalComponent] = useState("");
    const [showAsset, setShowAsset] = useState(false);
    const handleClose = () => {
        setShow(false);
        setShowAsset(false);
    };
    useEffect(() => {
        const fetchOrder = () => {
            const identities = identitiesQuery.queryIdentityWithID("all")
            identities.then(function (item) {
                const data = JSON.parse(item);
                const dataList = data.result.value.identities.value.list;
                if(dataList) {
                    const filterIdentities = Helper.FilterIdentitiesByProvisionedAddress(dataList, userAddress)
                    const maintainersData = maintainersQuery.queryMaintainerWithID("all")
                    maintainersData.then(function (item) {
                        const parsedMaintainersData = JSON.parse(item);
                        const maintainersDataList = parsedMaintainersData.result.value.maintainers.value.list;
                        if (maintainersDataList) {
                            const filterMaintainersByIdentity = Helper.FilterMaintainersByIdentity(filterIdentities, maintainersDataList)
                            setMaintainersList(filterMaintainersByIdentity);
                        } else {
                            console.log("no maintainers found")
                        }
                    })
                }
            })
        }
        fetchOrder();
    }, []);

    const handleModalData = (formName, maintainer1) => {
        setMaintainer(maintainer1)
        setExternalComponent(formName)
        setShowAsset(formName);
    }

    return (
        <div className="container">

            <div className="accountInfo">
                <div className="row row-cols-1 row-cols-md-2 card-deck ">
                    {maintainersList.map((maintainer, index) => {
                        const maintainerPropertyList = Helper.ParseProperties(maintainer.value.maintainedTraits.value.properties.value.propertyList)
                        let keys = Object.keys(maintainerPropertyList);
                        return (<div className="col-md-6" key={index}>
                                <div className="card">
                                    {(maintainer.value.addMaintainer) ?
                                        <div>
                                            <Button
                                                onClick={() => handleModalData('BurnAsset', maintainer)}>Deputize</Button>
                                        </div> : ""
                                    }
                                    <a href="#" key={index}>{maintainer.value.id.value.classificationID.value.idString}*{maintainer.value.id.value.identityID.value.idString}</a>
                                    {
                                        keys.map((keyName) => {
                                            return (
                                                <a key={index + keyName}>{keyName} {maintainerPropertyList[keyName]}</a>)
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>
            <Modal
                show={showAsset}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
            >

                {
                    externalComponent === 'BurnAsset' ?
                        <Deputize maintainerData={maintainer}/> :
                        null
                }
            </Modal>
        </div>
    );
};

export default Maintainers;
