import React, { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import {mintAsset} from "persistencejs/build/transaction/assets/mint";
import KeplerWallet from "../../../utilities/Helpers/kelplr";
import {getWallet} from "persistencejs/build/utilities/keys";
import { useTranslation } from "react-i18next";
import queries from '../../../utilities/Helpers/query';
import Loader from "../../../components/loader";
import {bank} from "persistencejs/build/transaction/bank/sendCoin";
import ModalCommon from "../../../components/modal";
import {wrapSplits} from "persistencejs/build/transaction/splits/wrap";
import {unwrapsplits} from "persistencejs/build/transaction/splits/unwrap";
import {issueIdentity} from "persistencejs/build/transaction/identity/issue";
import {nubIdentity} from "persistencejs/build/transaction/identity/nub";
import {defineIdentity} from "persistencejs/build/transaction/identity/define";
import {defineAsset} from 'persistencejs/build/transaction/assets/define';
import {defineOrder} from 'persistencejs/build/transaction/orders/define';
import {sendSplits} from 'persistencejs/build/transaction/splits/send';
import {makeOrder} from 'persistencejs/build/transaction/orders/make';
import {mutateAsset} from 'persistencejs/build/transaction/assets/mutate';
import {cancelOrder} from 'persistencejs/build/transaction/orders/cancel';
import {burnAsset} from 'persistencejs/build/transaction/assets/burn';
import {deputizeMaintainer as dm} from 'persistencejs/build/transaction/maintainers/deputize';
import {provisionIdentity} from 'persistencejs/build/transaction/identity/provision';
import {unprovisionIdentity} from 'persistencejs/build/transaction/identity/unprovision';
import transactions from '../../../utilities/Helpers/transactions';
import {takeOrder as takeOrderQuery} from 'persistencejs/build/transaction/orders/take';
import {revealMeta} from 'persistencejs/build/transaction/meta/reveal';
const identitiesDefine = new defineIdentity(process.env.REACT_APP_ASSET_MANTLE_API);
const assetDefine = new defineAsset(process.env.REACT_APP_ASSET_MANTLE_API);
const ordersDefine = new defineOrder(process.env.REACT_APP_ASSET_MANTLE_API);
const assetMint = new mintAsset(process.env.REACT_APP_ASSET_MANTLE_API);
const SendCoinQuery = new bank(process.env.REACT_APP_ASSET_MANTLE_API);
const WrapQuery = new wrapSplits(process.env.REACT_APP_ASSET_MANTLE_API);
const identitiesIssue = new issueIdentity(process.env.REACT_APP_ASSET_MANTLE_API);
const identitiesNub = new nubIdentity(process.env.REACT_APP_ASSET_MANTLE_API);
const UnWrapQuery = new unwrapsplits(process.env.REACT_APP_ASSET_MANTLE_API);
const sendSplitQuery = new sendSplits(process.env.REACT_APP_ASSET_MANTLE_API);
const ordersMake = new makeOrder(process.env.REACT_APP_ASSET_MANTLE_API);
const assetMutate = new mutateAsset(process.env.REACT_APP_ASSET_MANTLE_API);
const ordersCancel = new cancelOrder(process.env.REACT_APP_ASSET_MANTLE_API);
const assetBurn = new burnAsset(process.env.REACT_APP_ASSET_MANTLE_API);
const deputizeMaintainer = new dm(process.env.REACT_APP_ASSET_MANTLE_API);
const identitiesProvision = new provisionIdentity(process.env.REACT_APP_ASSET_MANTLE_API);
const identitiesUnprovision = new unprovisionIdentity(process.env.REACT_APP_ASSET_MANTLE_API);
const takeOrder = new takeOrderQuery(process.env.REACT_APP_ASSET_MANTLE_API);
const RevealMeta = new revealMeta(process.env.REACT_APP_ASSET_MANTLE_API);

const CommonKeystore = (props) => {
    const { t } = useTranslation();
    const [show, setShow] = useState(true);
    const [response, setResponse] = useState({});
    const [importMnemonic, setImportMnemonic] = useState(true);
    const [loader, setLoader] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [keplrTxn, setKeplrTxn] = useState(false);

    useEffect(() => {
        const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
        if (encryptedMnemonic !== null) {
            setImportMnemonic(false);
        } else {
            setImportMnemonic(true);
        }
    }, []);

    const transactionDefination = async (address, userMnemonic, type) => {
        // const addressList = await queries.getProvisionList();
        // console.log(addressList, "list from get provionlist ",);
        // if(addressList || addressList.length){
        //     return Error("provision address empty please add");
        // }


        let queryResponse;
        if (props.TransactionName === 'assetMint') {
            queryResponse = queries.mintAssetQuery(address, userMnemonic, props.totalDefineObject, assetMint, type);
        }  else if (props.TransactionName === 'wrap') {
            queryResponse = queries.wrapQuery(address, userMnemonic, props.totalDefineObject, WrapQuery, type);
        }  else if (props.TransactionName === 'unwrap') {
            queryResponse = queries.unWrapQuery(address, userMnemonic, props.totalDefineObject, UnWrapQuery, type);
        }  else if (props.TransactionName === 'nubid') {
            queryResponse = queries.nubIdQuery(address, userMnemonic, props.totalDefineObject, identitiesNub, type);
        }  else if (props.TransactionName === 'issueidentity') {
            queryResponse = queries.issueIdentityQuery(address, userMnemonic, props.totalDefineObject, identitiesIssue, type);
        } else if (props.TransactionName === 'Define Asset') {
            queryResponse = queries.defineAssetQuery(address, userMnemonic, props.totalDefineObject, assetDefine, type);
        }  else if (props.TransactionName === 'Define Order') {
            queryResponse = queries.defineOrderQuery(address, userMnemonic, props.totalDefineObject, ordersDefine, type);
        } else if (props.TransactionName === 'Define Identity') {
            queryResponse = queries.defineQuery(address, userMnemonic, props.totalDefineObject, identitiesDefine, type);
        } else if (props.TransactionName === 'sendcoin') {
            queryResponse = queries.sendCoinQuery(address, userMnemonic, props.totalDefineObject, SendCoinQuery,type);
        } else if (props.TransactionName === 'send splits') {
            queryResponse = queries.sendSplitsQuery(address, userMnemonic, props.totalDefineObject, sendSplitQuery, type);
        } else if (props.TransactionName === 'make order') {
            queryResponse = queries.makeOrderQuery(address, userMnemonic, props.totalDefineObject, ordersMake, type);
        }else if (props.TransactionName === 'take order') {
            queryResponse = queries.takeOrderQuery(address, userMnemonic, props.totalDefineObject, takeOrder, type);
        } else if (props.TransactionName === 'mutate Asset') {
            queryResponse = queries.mutateAssetQuery(address, userMnemonic, props.totalDefineObject, assetMutate,type);
        } else if (props.TransactionName === 'cancel order') {
            queryResponse = queries.cancelOrderQuery(address, userMnemonic, props.totalDefineObject, ordersCancel, type);
        } else if (props.TransactionName === 'burn asset') {
            queryResponse = queries.burnAassetQuery(address, userMnemonic, props.totalDefineObject, assetBurn, type);
        } else if (props.TransactionName === 'deputize') {
            queryResponse = queries.deputizeQuery(address, userMnemonic, props.totalDefineObject, deputizeMaintainer, type);
        } else if (props.TransactionName === 'provision') {
            queryResponse = queries.provisionQuery(address, userMnemonic, props.totalDefineObject, identitiesProvision, type);
        } else if (props.TransactionName === 'un provision') {
            queryResponse = queries.unProvisionQuery(address, userMnemonic, props.totalDefineObject, identitiesUnprovision, type);
        } else if (props.TransactionName === 'reveal') {
            queryResponse = queries.revealHashQuery(address, userMnemonic, props.totalDefineObject, RevealMeta, type);
        }

        return queryResponse;
    };

    const handleKepler = () => {
        setLoader(true);
        setErrorMessage("");
        const kepler = KeplerWallet();
        kepler.then(function () {
            const keplrAddress = localStorage.getItem("keplerAddress");
            const loginAddress =  localStorage.getItem("address");
            if(keplrAddress !== loginAddress){
                setLoader(false);
                setErrorMessage("Adress Mismatch: Login address not matched with keplr address");
                return;
            }
            let queryResponse = transactionDefination(loginAddress , "", "keplr");
            queryResponse.then((result) => {
                console.log("response finale", result);
                setShow(false);
                setLoader(false);
                setKeplrTxn(true);
                setResponse(result);
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
                userMnemonic = decryptedData.mnemonic;
                setErrorMessage("");
            }
        }
        if (userMnemonic !== undefined) {
            const wallet = await getWallet(userMnemonic, "");
            let queryResponse =  transactionDefination(wallet.address , userMnemonic, "normal");
            queryResponse.then(function (item) {
                setShow(false);
                setLoader(false);
                setResponse(item);
            }).catch(err => {
                setLoader(false);
                setErrorMessage(err.response
                    ? err.response.data.message
                    : err.message);
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
    const handleClose = () => {
        setShow(false);
        props.setExternalComponent("");
        props.handleClose();
    };
    return (
        <div>
            <Modal show={show} onHide={handleClose} className="mnemonic-login-section login-section key-select" centered>
                <Modal.Header closeButton>
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
                        <div className="submitButtonSection">
                            <button type={"button"} variant="primary" className="button-double-border" onClick={() => handleKepler("kepler")}>{t("USE_KEPLER")}
                            </button>
                        </div>

                    </Form>
                    {errorMessage !=="" ?
                        <p className="error-response"> {errorMessage}</p> : null
                    }
                </Modal.Body>
            </Modal>
            {!(Object.keys(response).length === 0) ?
                <ModalCommon data={response} handleClose={handleClose} keplrTxn={keplrTxn}/>
                : ""
            }
        </div>
    );
};
export default CommonKeystore;
