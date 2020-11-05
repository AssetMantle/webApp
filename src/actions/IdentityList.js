import React, {useState, useEffect} from "react";
import ReactDOM from 'react-dom';
import Identities from "persistencejs/transaction/identity/query";
import Helpers from "../utilities/helper";
import metaQuery from "persistencejs/transaction/meta/query";
import {Dropdown, Modal, Button} from "react-bootstrap";
import {Nub, DefineIdentity, IssueIdentity, Provision, UnProvision} from "./forms";

const IdentityList = () => {
    const Helper = new Helpers();
    const [showIdentity, setShowIdentity] = useState(false);
    const [externalComponent, setExternalComponent] = useState("");
    const [identityId, setIdentityId] = useState("");
    const [identity, setIdentity] = useState([]);
    const [filteredIdentitiesList, setFilteredIdentitiesList] = useState([]);
    const handleClose = () => {
        setShowIdentity(false);
    };
    const userAddress = localStorage.getItem('address');
    useEffect(() => {
        const fetchtoIdentities = () => {
            const identities = Identities.queryIdentityWithID("all")
            identities.then(function (item) {
                const data = JSON.parse(item);
                const dataList = data.result.value.identities.value.list;
                if (dataList) {
                    const filterIdentities = Helper.FilterIdentitiesByProvisionedAddress(dataList, userAddress);
                    setFilteredIdentitiesList(filterIdentities);
                } else {
                    console.log("no identities found")
                }

            })
        }
        fetchtoIdentities();
    }, []);

    const handleModalData = (formName, identityId, identity) => {
        setIdentity(identity);
        setIdentityId(identityId)
        setShowIdentity(true)
        setExternalComponent(formName)
    }
    return (
        <div className="container">
            <div className="accountInfo">
                <div className="row row-cols-1 row-cols-md-2 card-deck">
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Actions
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleModalData("Nub")}>Nub Txn</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleModalData("DefineIdentity")}>Define
                                Identity</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleModalData("IssueIdentity")}>Issue
                                Identity</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    {filteredIdentitiesList.map((identity, index) => {
                        var immutableProperties = "";
                        var mutableProperties = "";
                        const identityId = Helper.GetIdentityID(identity)
                        if (identity.value.immutables.value.properties.value.propertyList !== null) {
                            immutableProperties = Helper.ParseProperties(identity.value.immutables.value.properties.value.propertyList);
                        }
                        if (identity.value.mutables.value.properties.value.propertyList !== null) {
                            mutableProperties = Helper.ParseProperties(identity.value.mutables.value.properties.value.propertyList);
                        }
                        var immutableKeys = Object.keys(immutableProperties);
                        var mutableKeys = Object.keys(mutableProperties);
                        return (
                            <div className="col-md-6" key={index}>
                                <div className="card">
                                    <div>
                                        <Button variant="secondary"
                                                onClick={() => handleModalData("Provision", identityId)}>Provision</Button>
                                        <Button variant="secondary"
                                                onClick={() => handleModalData("UnProvision", identityId, identity)}>UnProvision</Button>
                                    </div>
                                    <a href="#">{identityId}</a>
                                    <p>Immutables</p>
                                    {
                                        immutableKeys.map((keyName, index1) => {
                                            if (immutableProperties[keyName] !== "") {
                                                const metaQueryResult = metaQuery.queryMetaWithID(immutableProperties[keyName]);
                                                metaQueryResult.then(function (item) {
                                                    const data = JSON.parse(item);
                                                    let myelement = "";
                                                    let metaValue = Helper.FetchMetaValue(data, immutableProperties[keyName])
                                                    myelement = <span>{metaValue}</span>;
                                                    ReactDOM.render(myelement, document.getElementById(`immutable` + index + `${index1}`));
                                                });
                                                return (<a key={index + keyName}><b>{keyName} </b>: <span
                                                    id={`immutable` + index + `${index1}`}></span></a>)
                                            } else {
                                                return (
                                                    <a key={index + keyName}><b>{keyName} </b>: <span>{immutableProperties[keyName]}</span></a>)
                                            }
                                        })
                                    }
                                    <p>Mutables</p>
                                    {
                                        mutableKeys.map((keyName, index1) => {
                                            if (mutableProperties[keyName] !== "") {
                                                const metaQueryResult = metaQuery.queryMetaWithID(mutableProperties[keyName]);
                                                metaQueryResult.then(function (item) {
                                                    const data = JSON.parse(item);
                                                    let myelement = "";
                                                    let metaValue = Helper.FetchMetaValue(data, mutableProperties[keyName])
                                                    myelement = <span>{metaValue}</span>;
                                                    ReactDOM.render(myelement, document.getElementById(`mutable` + index + `${index1}`));
                                                });
                                                return (<a key={index + keyName}><b>{keyName} </b>: <span
                                                    id={`mutable` + index + `${index1}`}></span></a>)
                                            } else {
                                                return (
                                                    <a key={index + keyName}><b>{keyName} </b>: <span>{mutableProperties[keyName]}</span></a>)
                                            }
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <Modal
                show={showIdentity}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
            >
                {externalComponent === 'Nub' ?
                    <Nub/> :
                    null
                }
                {externalComponent === 'DefineIdentity' ?
                    <DefineIdentity/> :
                    null
                }
                {externalComponent === 'IssueIdentity' ?
                    <IssueIdentity fetchToggle={handleClose}/> :
                    null
                }

                {externalComponent === 'Provision' ?
                    <Provision identityId={identityId}/> :
                    null
                }
                {externalComponent === 'UnProvision' ?
                    <UnProvision identityId={identityId} identityIdList={identity}/> :
                    null
                }
            </Modal>
        </div>
    );
}
export default IdentityList