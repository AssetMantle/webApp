import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import Loader from "../../../components/loader";
import Copy from "../../../components/copy";
import {useSelector} from "react-redux";
// import * as faucet from "../../../store/actions/faucet";
import {Button} from "react-bootstrap";
import {Provision, UnProvision} from "../../forms/identities";
import {UnWrap, Wrap} from "../../forms/assets";
import config from "../../../config";

const IdentityList = () => {
    const {t} = useTranslation();
    const identityId = localStorage.getItem('identityId');
    const userAddress = localStorage.getItem('userAddress');
    const userName = localStorage.getItem('userName');
    const [externalComponent, setExternalComponent] = useState("");
    const [identity, setIdentity] = useState([]);
    const identityList = useSelector((state) => state.identities.identityList);
    const loader = useSelector((state) => state.identities.loading);
    const faucetData = useSelector((state) => state.faucet.faucetData);
    const wrappedCoins = useSelector((state) => state.wrappedCoins.wrappedCoins);
    console.log(wrappedCoins, faucetData, "in profile");
    // const dispatch = useDispatch();
    // useEffect(()=> {
    //     const fetchData = async () => {
    //         console.log("rauu");
    //         await dispatch(faucet.fetchFaucet(userAddress));
    //     };
    //     fetchData();
    // },[]);

    const handleModalData = (formName, identityId, identity) => {
        setExternalComponent(formName);
        setIdentity(identity);
    };
    
    return (
        <div className="page-body">
            <div className="list-container profile-section container">
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
                                    <p className="list-item-label">{t("BALANCE")}:</p>
                                    <div className="list-item-value profile-data-item button-item">
                                        <p className=""> {faucetData[0].amount}{faucetData[0].denom}</p>
                                        <Button variant="primary" size="sm"
                                            onClick={() => handleModalData("Wrap")}>{t("WRAP")}</Button>
                                    </div>
                                </div>
                                :""
                            }
                            {/*<div className="list-item">*/}
                            {/*    <p className="list-item-label">{t("WRAPPED_AMOUNT")}:</p>*/}
                            {/*    <div className="list-item-value profile-data-item">*/}
                            {/*        <p className="id-string"> {(faucetData[0].amount*1) - (wrappedCoins*1)}</p>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            <div className="list-item">
                                <p className="list-item-label">{t("WRAPPED_BALANCE")}:</p>
                                <div className="list-item-value profile-data-item button-item">
                                    <p className=""> {(wrappedCoins*1).toFixed(3)}{config.coinDenom}</p>
                                    <Button variant="primary" size="sm" onClick={() => handleModalData("UnWrap")}>{t("UN_WRAP")}</Button>
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
                            <div className="property-actions">


                            </div>
                        </div>
                    </div>


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
                {
                    externalComponent === 'Wrap' ?
                        <Wrap setExternalComponent={setExternalComponent} FormName={'Wrap'}/> :
                        null
                }
                {
                    externalComponent === 'UnWrap' ?
                        <UnWrap setExternalComponent={setExternalComponent} FormName={'UnWrap'}/> :
                        null
                }
            </div>
        </div>
    );
};

export default IdentityList;
