import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Loader from "../../../components/loader";
import config from "../../../constants/config.json";
import Copy from "../../../components/copy";
import {useDispatch, useSelector} from "react-redux";
import * as faucet from "../../../store/actions/faucet";
import {Button} from "react-bootstrap";
import {Provision, UnProvision} from "../../forms/identities";

const IdentityList = React.memo(() => {
    const {t} = useTranslation();
    const identityId = localStorage.getItem('identityId');
    const userAddress = localStorage.getItem('userAddress');
    const userName = localStorage.getItem('userName');
    const [externalComponent, setExternalComponent] = useState("");
    const [identity, setIdentity] = useState([]);
    const identityList = useSelector((state) => state.identities.identityList);

    const loader = useSelector((state) => state.identities.loading);
    const faucetData = useSelector((state) => state.faucet.faucetData);
    console.log(faucetData, "faucetData");
    // const error = useSelector((state) => state.identities.error);
    let ImageData;
    let mutableContentData  = [];
    let imMutableContentData  = [];

    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchData = async () => {
            await dispatch(faucet.fetchFaucet(userAddress));
        };
        fetchData();
    },[]);

    if(identityList.length && identityList[0]['mutableProperties'])
    {
        const identity= identityList[0];
        Object.keys(identity['mutableProperties']).map((key, index) => {
            if(key !== config.URI) {
                let content =
                    <div className="row property-section" key={index}>
                        <div
                            className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                            {key !== 'style' && key !== config.URI ?
                                <div className="list-item">
                                    <p
                                        className="list-item-label">{key} </p>
                                    <p
                                        className="list-item-value">{identity['mutableProperties'][key]}</p>
                                </div>
                                : ""
                            }
                        </div>
                    </div>;

                mutableContentData.push(content);
            }
        });
    }
    if(identityList.length && identityList[0]['immutableProperties'])
    {
        const identity= identityList[0];
        Object.keys(identity.immutableProperties).map((key, index) => {
            if(key !== config.URI) {
                let content =
                    <div className="row property-section" key={index}>
                        <div
                            className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                            {key !== 'style' && key !== config.URI ?
                                <div className="list-item">
                                    <p
                                        className="list-item-label">{key} </p>
                                    <p
                                        className="list-item-value">{identity['immutableProperties'][key]}</p>
                                </div>
                                : ""
                            }
                        </div>
                    </div>;
                imMutableContentData.push(content);
            }
        });
    }

    const handleModalData = (formName, identityId, identity) => {
        setExternalComponent(formName);
        setIdentity(identity);
    };
    
    return (
        <div className="list-container profile-section">
            {loader ?
                <Loader/>
                : ""
            }
            <div className="row card-deck">
                <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12" >
                    <div className="card identity-card">
                        <div className="list-item">
                            <p className="list-item-label">{t("USER_NAME")}:</p>
                            <div className="list-item-value profile-data-item">
                                <p className="id-string"> {userName}</p>
                            </div>
                        </div>
                        <div className="list-item profile-data">
                            <p className="list-item-label">{t("IDENTITY_ID")}:</p>
                            <div className="list-item-value profile-data-item">
                                <p className="id-string" title={identityId}> {identityId}</p>
                            </div>
                            <Copy
                                id={identityId}/>
                        </div>
                        <div className="list-item">
                            <p className="list-item-label">{t("ADDRESS")}:</p>
                            <div className="list-item-value profile-data-item">
                                <p className="id-string"> {userAddress}</p>
                            </div>
                        </div>
                        {faucetData.length ?
                            <div className="list-item">
                                <p className="list-item-label">{t("Amount")}:</p>
                                <div className="list-item-value profile-data-item">
                                    <p className="id-string"> {faucetData[0].amount}{faucetData[0].denom}</p>
                                </div>
                            </div>
                            :""
                        }
                        {ImageData}
                        <div className="properties-section">
                            <div className="property">
                                <p className="sub-title">{t("MUTABLES")}</p>
                                {mutableContentData}
                            </div>
                            <div className="property">
                                <p className="sub-title">{t("IMMUTABLES")}</p>
                                {imMutableContentData}
                            </div>
                        </div>
                        <div className="address-container">
                            <p className="sub-title">provisionedAddressList</p>
                            {identityList[0] && identityList[0].provisionedAddressList && identityList[0].provisionedAddressList !== "" ?
                                identityList[0].provisionedAddressList.map((provisionedAddress, addressKey) => {
                                    return (<p className="provision-address" key={addressKey}>{provisionedAddress}</p>);
                                })
                                : <p className="provision-address">Empty</p>
                            }
                        </div>
                        <div className="address-container">
                            <p className="sub-title">UnProvisionedAddressList</p>
                            {identityList[0] && identityList[0].unprovisionedAddressList && identityList[0].unprovisionedAddressList !== "" ?
                                identityList[0].unprovisionedAddressList.map((unprovisionedAddress, unprovisionedAddressKey) => {
                                    return (
                                        <p className="provision-address" key={unprovisionedAddressKey}>{unprovisionedAddress}</p>);
                                })
                                : <p className="provision-address">Empty</p>
                            }
                        </div>
                        <div className="property-actions">
                            <Button variant="primary" size="sm"
                                onClick={() => handleModalData("Provision", identityId)}>{t("PROVISION")}</Button>
                            <Button variant="primary" size="sm"
                                onClick={() => handleModalData("UnProvision", identityId, identityList[0].provisionedAddressList)}>{t("UN_PROVISION")}</Button>
                        </div>
                    </div>
                </div>
                  

                {/*<div className="col-xl-5 col-lg-5 col-md-6 col-sm-12">*/}
                {/*    <div className="card identity-card">*/}
                {/*        <div className="info-section">*/}

                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*<div className="col-xl-3 col-lg-4 col-md-12 col-sm-12">*/}
                {/*    <div className="card">*/}
                {/*        <h4 className="card-heading">{t("HARDWARE_DEVICES")}</h4>*/}
                {/*        <div className="ledger-box">*/}
                {/*            <div className="image-section">*/}
                {/*                <div className="ledger-image">*/}
                {/*                    <img src={ledger} alt="ledger"/>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <p className="heading">{t("ENABLE_LEDGER")}</p>*/}
                {/*            <div className="button-view" title="To be implemented">*/}
                {/*                <p className="icon-section">{t("CONNECT")}</p>*/}
                {/*                <Icon viewClass="arrow-icon" icon="arrow"/>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

            </div>
            {externalComponent === 'Provision' ?
                <Provision setExternalComponent={setExternalComponent} identityId={identityId}/> :
                null
            }
            {externalComponent === 'UnProvision' ?
                <UnProvision setExternalComponent={setExternalComponent} identityId={identityId}
                    userList={identity}/> :
                null
            }
        </div>
    );
});
IdentityList.displayName = 'IdentityList';
export default IdentityList;
