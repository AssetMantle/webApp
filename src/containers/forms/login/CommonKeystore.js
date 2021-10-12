import React, { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import KeplerWallet from "../../../utilities/Helpers/kelplr";
import {getWallet} from "persistencejs/build/utilities/keys";
import { useTranslation } from "react-i18next";
import queries from '../../../utilities/Helpers/query';
import Loader from "../../../components/loader";
import ModalCommon from "../../../components/modal";
import transactions from '../../../utilities/Helpers/transactions';
import Icon from "../../../icons";
import GetMeta from '../../../utilities/Helpers/getMeta';
import GetID from '../../../utilities/Helpers/getID';
import {fetchAddress} from "../../../utilities/Helpers/ledger";
import {queryIdentities} from "persistencejs/build/transaction/identity/query";
const identitiesQuery = new queryIdentities(process.env.REACT_APP_ASSET_MANTLE_API);
const CommonKeystore = (props) => {
    const { t } = useTranslation();
    const [show, setShow] = useState(true);
    const [response, setResponse] = useState({});
    const [importMnemonic, setImportMnemonic] = useState(true);
    const [loader, setLoader] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [keplrTxn, setKeplrTxn] = useState(false);
    const [testID, setTestID] = useState('');
    const [nubID, setNubID] = useState('');

    const GetIDHelper = new GetID();
    const GetMetaHelper = new GetMeta();

    useEffect(() => {
        const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
        if (encryptedMnemonic !== null) {
            setImportMnemonic(false);
        } else {
            setImportMnemonic(true);
        }
    }, []);

    const getIdentityId = (userIdHash) => {
        const identities = identitiesQuery.queryIdentityWithID('all');
        if (identities) {
            identities.then(function(item) {
                const data = JSON.parse(item);
                const dataList = data.result.value.identities.value.list;
                dataList.map((identity) => {
                    if (identity.value.immutables.value.properties.value.propertyList !== null) {
                        const immutablePropertyList = identity.value.immutables.value.properties.value.propertyList[0];
                        if (immutablePropertyList.value.fact.value.hash === userIdHash) {
                            console.log("new id",GetIDHelper.GetIdentityID(identity) );
                            setTestID(GetIDHelper.GetIdentityID(identity));
                        }
                    }
                });

            });
        }
    };


    // const transactionDefination = async (address, userMnemonic, type) => {
    //     let queryResponse;
    //     if (props.TransactionName === 'assetMint') {
    //         queryResponse = queries.mintAssetQuery(address, userMnemonic, props.totalDefineObject, assetMint, type);
    //     }  else if (props.TransactionName === 'wrap') {
    //         queryResponse = queries.wrapQuery(address, userMnemonic, props.totalDefineObject, WrapQuery, type);
    //     }  else if (props.TransactionName === 'unwrap') {
    //         queryResponse = queries.unWrapQuery(address, userMnemonic, props.totalDefineObject, UnWrapQuery, type);
    //     }  else if (props.TransactionName === 'nubid') {
    //         console.log(address, userMnemonic, props.totalDefineObject, identitiesNub, type, 'nubIdQuery');
    //         queryResponse = queries.nubIdQuery(address, userMnemonic, props.totalDefineObject, identitiesNub, type, 'nub');
    //     }  else if (props.TransactionName === 'issueidentity') {
    //         queryResponse = queries.issueIdentityQuery(address, userMnemonic, props.totalDefineObject, identitiesIssue, type);
    //     } else if (props.TransactionName === 'Define Asset') {
    //         queryResponse = queries.defineAssetQuery(address, userMnemonic, props.totalDefineObject, assetDefine, type);
    //     }  else if (props.TransactionName === 'Define Order') {
    //         queryResponse = queries.defineOrderQuery(address, userMnemonic, props.totalDefineObject, ordersDefine, type);
    //     } else if (props.TransactionName === 'Define Identity') {
    //         queryResponse = queries.defineQuery(address, userMnemonic, props.totalDefineObject, identitiesDefine, type);
    //     } else if (props.TransactionName === 'sendcoin') {
    //         queryResponse = queries.sendCoinQuery(address, userMnemonic, props.totalDefineObject, SendCoinQuery,type);
    //     } else if (props.TransactionName === 'send splits') {
    //         queryResponse = queries.sendSplitsQuery(address, userMnemonic, props.totalDefineObject, sendSplitQuery, type);
    //     } else if (props.TransactionName === 'make order') {
    //         queryResponse = queries.makeOrderQuery(address, userMnemonic, props.totalDefineObject, ordersMake, type);
    //     }else if (props.TransactionName === 'take order') {
    //         queryResponse = queries.takeOrderQuery(address, userMnemonic, props.totalDefineObject, takeOrder, type);
    //     } else if (props.TransactionName === 'mutate Asset') {
    //         queryResponse = queries.mutateAssetQuery(address, userMnemonic, props.totalDefineObject, assetMutate,type);
    //     } else if (props.TransactionName === 'cancel order') {
    //         queryResponse = queries.cancelOrderQuery(address, userMnemonic, props.totalDefineObject, ordersCancel, type);
    //     } else if (props.TransactionName === 'burn asset') {
    //         queryResponse = queries.burnAassetQuery(address, userMnemonic, props.totalDefineObject, assetBurn, type);
    //     } else if (props.TransactionName === 'deputize') {
    //         queryResponse = queries.deputizeQuery(address, userMnemonic, props.totalDefineObject, deputizeMaintainer, type);
    //     } else if (props.TransactionName === 'provision') {
    //         queryResponse = queries.provisionQuery(address, userMnemonic, props.totalDefineObject, identitiesProvision, type);
    //     } else if (props.TransactionName === 'un provision') {
    //         queryResponse = queries.unProvisionQuery(address, userMnemonic, props.totalDefineObject, identitiesUnprovision, type);
    //     } else if (props.TransactionName === 'reveal') {
    //         queryResponse = queries.revealHashQuery(address, userMnemonic, props.totalDefineObject, RevealMeta, type);
    //     }
    //     return queryResponse;
    // };

    const handleKepler = () => {
        setLoader(true);
        setErrorMessage("");
        const kepler = KeplerWallet();
        kepler.then(function () {
            const keplrAddress = localStorage.getItem("keplerAddress");
            let queryResponse = queries.transactionDefination(keplrAddress , "", "keplr", props.TransactionName, props.totalDefineObject);
            queryResponse.then((result) => {
                console.log("response finale", result);
                if(result.code){
                    setLoader(false);
                    if(props.TransactionName === "nubid"){
                        setErrorMessage(result.rawLog);
                    }else
                    {
                        setErrorMessage(result.rawLog);

                    }
                    const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
                    if (encryptedMnemonic !== null) {
                        setImportMnemonic(false);
                    } else {
                        setImportMnemonic(true);
                    }
                }else {
                    if(props.TransactionName === "nubid"){
                        setNubID(props.totalDefineObject.nubId);
                        const hashGenerate = GetMetaHelper.Hash(props.totalDefineObject.nubId);
                        getIdentityId(hashGenerate);
                    }
                    setShow(false);
                    setLoader(false);
                    setKeplrTxn(true);
                    setResponse(result);
                }
            }).catch((error) => {
                setLoader(false);
                setErrorMessage(error.message);
                console.log(error,'error');
                const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
                if (encryptedMnemonic !== null) {
                    setImportMnemonic(false);
                } else {
                    setImportMnemonic(true);
                }
            });
        }).catch(err => {
            setLoader(false);
            setErrorMessage(err.message);
        });
    };
    const handleSubmit = async e => {
        e.preventDefault();
        setLoader(true);
        setErrorMessage("");
        let userMnemonic;
        if (importMnemonic) {
            const password = e.target.password.value;
            let promise = transactions.PrivateKeyReader(e.target.uploadFile.files[0], password);
            await promise.then(function (result) {
                userMnemonic = result;
            }).catch(err => {
                setLoader(false);
                setErrorMessage(err);
            });
        } else {
            const password = e.target.password.value;
            const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
            const res = JSON.parse(encryptedMnemonic);
            const decryptedData = transactions.decryptStore(res, password);
            if (decryptedData.error != null) {
                setErrorMessage(decryptedData.error);
            } else {
                userMnemonic = transactions.mnemonicTrim(decryptedData.mnemonic);
                setErrorMessage("");
            }
        }
        if (userMnemonic !== undefined) {
            const wallet = await getWallet(userMnemonic, "");
            let queryResponse =  queries.transactionDefination(wallet.address , userMnemonic, "normal", props.TransactionName, props.totalDefineObject);
            queryResponse.then(function (item) {
                if(item.code){
                    localStorage.setItem('loginMode','normal');
                    if(props.TransactionName === "nubid"){
                        setErrorMessage(item.rawLog);
                    }else
                    {
                        setErrorMessage(item.rawLog);
                    }
                    setLoader(false);
                    const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
                    if (encryptedMnemonic !== null) {
                        setImportMnemonic(false);
                    } else {
                        setImportMnemonic(true);
                    }
                }
                else {
                    localStorage.setItem('loginMode','normal');
                    if(props.TransactionName === "nubid"){
                        setNubID(props.totalDefineObject.nubId);
                        const hashGenerate = GetMetaHelper.Hash(props.totalDefineObject.nubId);
                        getIdentityId(hashGenerate);
                    }
                    setShow(false);
                    setLoader(false);
                    setResponse(item);
                }
            }).catch(err => {
                setLoader(false);
                setErrorMessage(err.response
                    ? err.response.data.message
                    : err.message);
                if(props.TransactionName === "nubid"){
                    localStorage.clear();
                }
                const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
                if (encryptedMnemonic !== null) {
                    setImportMnemonic(false);
                } else {
                    setImportMnemonic(true);
                }
            });
        } else {
            setLoader(false);
        }
    };


    const handleLedgerSubmit = async () => {

        let loginAddress;
        if(props.TransactionName === "nubid"){
            let ledgerResponse = await fetchAddress("cosmos", 0, 0);
            loginAddress = ledgerResponse;
        }else {
            loginAddress = localStorage.getItem('userAddress');
        }

        setLoader(true);

        let queryResponse = queries.transactionDefination(loginAddress , "", "ledger", props.TransactionName, props.totalDefineObject);
        queryResponse.then((result) => {
            if(result.code){
                localStorage.setItem('loginMode','ledger');
                setLoader(false);
                if(props.TransactionName === "nubid"){
                    setErrorMessage(result.rawLog);
                }else
                {
                    setErrorMessage(result.rawLog);

                }
                const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
                if (encryptedMnemonic !== null) {
                    setImportMnemonic(false);
                } else {
                    setImportMnemonic(true);
                }
            }else {
                if(props.TransactionName === "nubid"){
                    setNubID(props.totalDefineObject.nubId);
                    const hashGenerate = GetMetaHelper.Hash(props.totalDefineObject.nubId);
                    getIdentityId(hashGenerate);
                }
                localStorage.setItem('loginMode','ledger');
                setShow(false);
                setLoader(false);
                setKeplrTxn(true);
                setResponse(result);
            }
        }).catch((error) => {
            setLoader(false);
            setErrorMessage(error.message);
            console.log(error,'error');
            const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
            if (encryptedMnemonic !== null) {
                setImportMnemonic(false);
            } else {
                setImportMnemonic(true);
            }
        });
    };


    const handleClose = () => {
        setShow(false);
        props.setExternalComponent("");
        props.handleClose();
    };

    const backHandler = () => {
        if (props.TransactionName === "nubid") {
            setShow(false);
            props.setShow(true);
            props.setExternalComponent('');
        }else {
            setShow(false);
            props.setShow(true);
            props.setExternalComponent('');
        }
    };

    return (
        <div>
            <Modal show={show} onHide={handleClose} className="mnemonic-login-section login-section key-select" centered>
                <Modal.Header closeButton>
                    <div className="back-button" onClick={backHandler}>
                        <Icon viewClass="arrow-icon" icon="arrow"/>
                    </div>
                    {t("Choose Option")}
                </Modal.Header>
                {loader ?
                    <Loader />
                    : ""
                }
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        {
                            importMnemonic ?
                                <>
                                    <Form.Group>
                                        <Form.File id="exampleFormControlFile1" name="uploadFile" accept=".json" label="upload private key file" required={true} />
                                    </Form.Group>
                                    <Form.Label>{t("DECRYPT_KEY_STORE")}</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="password"
                                        required={true}
                                    />
                                </>
                                :
                                <Form.Group>
                                    <Form.Label>{t("DECRYPT_KEY_STORE")}</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="password"
                                        required={true}
                                    />
                                </Form.Group>
                        }

                        <div className="submitButtonSection">
                            <Button
                                variant="primary"
                                type="submit"
                                className="button-double-border"
                            >
                                {t("SUBMIT")}
                            </Button>
                        </div>
                    </Form>
                    <div className="submitButtonSection text-center">
                        <button type="button" variant="primary" className="button-double-border" onClick={() => handleKepler("kepler")}>{t("USE_KEPLR")}
                        </button>
                    </div>
                    <div className="submitButtonSection text-center">
                        <button type="button" variant="primary" className="button-double-border" onClick={handleLedgerSubmit}>{t("USE_LEDGER")}
                        </button>
                    </div>
                    {errorMessage !=="" ?
                        <p className="error-response"> {errorMessage}</p> : null
                    }
                </Modal.Body>
            </Modal>
            {!(Object.keys(response).length === 0) ?
                <ModalCommon
                    data={response}
                    handleClose={handleClose}
                    keplrTxn={keplrTxn}
                    setErrorMessage={setErrorMessage}
                    testID={testID}
                    transactionName={props.TransactionName}
                    nubID={nubID}
                />
                : ""
            }
        </div>
    );
};
export default CommonKeystore;
