import React, {useState, useEffect} from "react";
import Identities from "persistenceJS/transaction/identity/query";
import Helpers from "../utilities/helper";
import metaQuery from "persistenceJS/transaction/meta/query";
import {Dropdown, Modal} from "react-bootstrap";
import Nub from './forms/Nub'

const IdentityList = () => {
    const Helper = new Helpers();
    const [show, setShow] = useState(false);
    const [externalComponent, setExternalComponent] = useState("");

    const [identityList, setIdentityList] = useState([]);
    const handleClose = () => {
        setShow(false);
      };
    const userAddress = localStorage.getItem('address');
    useEffect(() => {
        const fetchtoIdentities = () => {
            const identities = Identities.queryIdentityWithID("all")
            identities.then(function (item) {
                const data = JSON.parse(item);
                const dataList = data.result.value.identities.value.list;
                if(dataList){
                const filterIdentities = Helper.FilterIdentitiesByProvisionedAddress(dataList, userAddress);
                setIdentityList(filterIdentities);
                }
                else{
                    console.log("no identities found")
                }

            })
        }
        fetchtoIdentities();
    }, []);

const handelModalData = () =>{
    setShow(true)
    setExternalComponent("Nub")
}
    return (
        <div className="container">
            <div className="accountInfo">
                <div className="row row-cols-1 row-cols-md-2 card-deck">
                    {identityList.map((identity, index) => {
                        var immutableProperties="";
                        var mutableProperties="";
                        if(identity.value.immutables.value.properties.value.propertyList !== null){
                                immutableProperties = Helper.ParseProperties(identity.value.immutables.value.properties.value.propertyList);
                        }
                        if(identity.value.mutables.value.properties.value.propertyList !== null){
                            mutableProperties = Helper.ParseProperties(identity.value.mutables.value.properties.value.propertyList);
                            }
                            
                        var immutableKeys = Object.keys(immutableProperties);
                        var mutableKeys = Object.keys(mutableProperties);
                    return( 
                    <div className="col-md-6">
                        <div className="card">

                        <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Actions
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={handelModalData}>Nub Txn</Dropdown.Item>
                        </Dropdown.Menu>
                        </Dropdown>

                        <a href="#" key={index}>{identity.value.id.value.classificationID.value.idString}</a>
                        <p>Immutables</p>
                        {
                        immutableKeys.map((keyName) => {
                            const metaQueryResult = metaQuery.queryMetaWithID(immutableProperties[keyName]);
                            metaQueryResult.then(function(item) {
                            const data = JSON.parse(item);
                            let metaValue =  Helper.FetchMetaValue(data, immutableProperties[keyName])
                             return (<a key={index + keyName}>{keyName} {metaValue}</a>)
                            })
                          })
                        }
                        <p>Mutables</p>
                        {
                        mutableKeys.map((keyName) => {
                        return (<a key={index + keyName}>{keyName} {mutableProperties[keyName]}</a>)
                        })
                        }
                        </div>
                        </div>
                    )
                    })}
                </div>
            </div>
            <Modal
            show={show}
            onHide={handleClose}
            centered
            >
                {externalComponent === 'Nub' ?
                <Nub /> :
                null
                }
            </Modal>
        </div>
    );
}
export default IdentityList