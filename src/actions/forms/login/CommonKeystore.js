import React, { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import {mintAsset} from "persistencejs/build/transaction/assets/mint";
import KeplerWallet from "../../../utilities/Helpers/kelplr";
import {getWallet} from "persistencejs/build/utilities/keys";
import { useTranslation } from "react-i18next";
import { pollTxHash } from "../../../utilities/Helpers/filter";
import queries from '../../../utilities/Helpers/query';
import Loader from "../../../components/loader";
import {bank} from "persistencejs/build/transaction/bank/sendCoin";
import ModalCommon from "../../../components/modal";
import {wrapSplits} from "persistencejs/build/transaction/splits/wrap";
import {unwrapsplits} from "persistencejs/build/transaction/splits/unwrap";
import {issueIdentity} from "persistencejs/build/transaction/identity/issue";
import {nubIdentity} from "persistencejs/build/transaction/identity/nub";
import Msgs from "../../../utilities/Helpers/Msgs";
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
const { SigningCosmosClient } = require("@cosmjs/launchpad");
const restAPI = process.env.REACT_APP_API;
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

const CommonKeystore = (props) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [show, setShow] = useState(true);
    const [response, setResponse] = useState({});
    const [importMnemonic, setImportMnemonic] = useState(true);
    const [loader, setLoader] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [keplrTxn, setKeplrTxn] = useState(false);
    const [address, setAddress] = useState("");

    useEffect(() => {
        setErrorMessage("");
        const kepler = KeplerWallet();
        kepler.then(function () {
            const address = localStorage.getItem("keplerAddress");
            console.log(address,'address');
            setAddress(address);
        }).catch(err => {
            setErrorMessage(err.message);
        });
        const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
        if (encryptedMnemonic !== null) {
            setImportMnemonic(false);
        } else {
            setImportMnemonic(true);
        }
    }, []);

    const TransactionWithKeplr = async (msgs, fee, memo, chainID) => {
        await window.keplr.enable(chainID);
        const offlineSigner = window.getOfflineSigner(chainID);
        const accounts = await offlineSigner.getAccounts();
        console.log(offlineSigner, address, "offlineSigner nd address");
        const cosmJS = new SigningCosmosClient(restAPI, accounts[0].address, offlineSigner );
        return await cosmJS.signAndBroadcast(msgs, fee, memo);
    };

    const handleKepler = () => {
        setLoader(true);
        let queryResponse;
        if (props.TransactionName === 'sendcoin') {
            queryResponse = TransactionWithKeplr([Msgs.SendMsg(address,props.totalDefineObject.toAddress, props.totalDefineObject.amountData, props.totalDefineObject.denom)],Msgs.Fee(5000, 200000), "", process.env.REACT_APP_CHAIN_ID);
        }
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
        });

    };
    const handleSubmit = async e => {
        e.preventDefault();
        setLoader(true);
        let userMnemonic;
        if (importMnemonic) {
            const password = e.target.password.value;
            let promise = queries.PrivateKeyReader(e.target.uploadFile.files[0], password);
            await promise.then(function (result) {
                userMnemonic = result;
                console.log(userMnemonic, 'userMnemonic');
            }).catch(err => {
                setLoader(false);
                setErrorMessage(err.message);
            });
        } else {
            const password = e.target.password.value;
            const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
            const res = JSON.parse(encryptedMnemonic);
            const decryptedData = queries.decryptStore(res, password);
            if (decryptedData.error != null) {
                setErrorMessage(decryptedData.error);
            } else {
                userMnemonic = decryptedData.mnemonic;
                setErrorMessage("");
            }
        }


        if (userMnemonic !== undefined) {
            console.log(userMnemonic, "out memonic");
            const wallet = await getWallet(userMnemonic, "");
            console.log(wallet, "in memonic");
            let queryResponse;
            if (props.TransactionName === 'assetMint') {
                queryResponse = queries.mintAssetQuery(wallet.address, userMnemonic, props.totalDefineObject, assetMint);
            }  else if (props.TransactionName === 'wrap') {
                queryResponse = queries.wrapQuery(wallet.address, userMnemonic, props.totalDefineObject, WrapQuery);
            }  else if (props.TransactionName === 'unwrap') {
                queryResponse = queries.unWrapQuery(wallet.address, userMnemonic, props.totalDefineObject, UnWrapQuery);
            }  else if (props.TransactionName === 'nubid') {
                queryResponse = queries.nubIdQuery(wallet.address, userMnemonic, props.totalDefineObject, identitiesNub);
            }  else if (props.TransactionName === 'issueidentity') {
                queryResponse = queries.issueIdentityQuery(wallet.address, userMnemonic, props.totalDefineObject, identitiesIssue);
            } else if (props.TransactionName === 'Define Asset') {
                queryResponse = queries.defineIdentityQuery(wallet.address, userMnemonic, props.totalDefineObject, assetDefine);
            }  else if (props.TransactionName === 'Define Order') {
                queryResponse = queries.defineOrderQuery    (wallet.address, userMnemonic, props.totalDefineObject, ordersDefine);
            } else if (props.TransactionName === 'Define Identity') {
                queryResponse = queries.defineQuery(wallet.address, userMnemonic, props.totalDefineObject, identitiesDefine);
            } else if (props.TransactionName === 'sendcoin') {
                queryResponse = queries.sendCoinQuery(wallet.address, userMnemonic, props.totalDefineObject, SendCoinQuery);
            } else if (props.TransactionName === 'send splits') {
                queryResponse = queries.sendSplitsQuery(wallet.address, userMnemonic, props.totalDefineObject, sendSplitQuery);
            } else if (props.TransactionName === 'make order') {
                queryResponse = queries.makeOrderQuery(wallet.address, userMnemonic, props.totalDefineObject, ordersMake);
            } else if (props.TransactionName === 'mutate Asset') {
                queryResponse = queries.mutateAssetQuery(wallet.address, userMnemonic, props.totalDefineObject, assetMutate);
            } else if (props.TransactionName === 'cancel order') {
                queryResponse = queries.cancelOrderQuery(wallet.address, userMnemonic, props.totalDefineObject, ordersCancel);
            } else if (props.TransactionName === 'burn asset') {
                queryResponse = queries.burnAassetQuery(wallet.address, userMnemonic, props.totalDefineObject, assetBurn);
            } else if (props.TransactionName === 'deputize') {
                queryResponse = queries.deputizeQuery(wallet.address, userMnemonic, props.totalDefineObject, deputizeMaintainer);
            } else if (props.TransactionName === 'provision') {
                queryResponse = queries.provisionQuery(wallet.address, userMnemonic, props.totalDefineObject, identitiesProvision);
            } else if (props.TransactionName === 'un provision') {
                queryResponse = queries.unProvisionQuery(wallet.address, userMnemonic, props.totalDefineObject, identitiesUnprovision);
            }
            queryResponse.then(function (item) {
                const data = JSON.parse(JSON.stringify(item));
                console.log(data, "befoer poll");
                const pollResponse = pollTxHash(process.env.REACT_APP_ASSET_MANTLE_API, data.transactionHash);
                pollResponse.then(function (pollData) {
                    const pollObject = JSON.parse(pollData);
                    console.log(pollObject,'pollObject');
                    setShow(false);
                    setLoader(false);
                    setResponse(data);
                }).catch(err => {
                    setLoader(false);
                    setErrorMessage(err.response
                        ? err.response.data.message
                        : err.message);
                });
            });
        } else {
            setLoader(false);
        }



    };
    const handleClose = () => {
        setShow(false);
        props.setExternalComponent("");
        history.push('/');
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
                        <p> {errorMessage}</p> : null
                    }
                </Modal.Body>
            </Modal>
            {!(Object.keys(response).length === 0) ?
                <ModalCommon data={response} setExternal={handleClose} keplrTxn={keplrTxn}/>
                : ""
            }
        </div>
    );
};
export default CommonKeystore;
