import React, { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import AssetMintJS from "persistencejs/transaction/assets/mint";
import KeplerWallet from "../../../utilities/Helpers/kelplr";
import keyUtils from "persistencejs/utilities/keys";
import { useTranslation } from "react-i18next";
import { pollTxHash } from "../../../utilities/Helpers/filter";
import queries from '../../../utilities/Helpers/query';
import Loader from "../../../components/loader";
import SendCoinJS from "persistencejs/transaction/bank/sendCoin";
import ModalCommon from "../../../components/modal";
import WrapJS from "persistencejs/transaction/splits/wrap";
import UnWrapJS from "persistencejs/transaction/splits/unwrap";
import IdentitiesIssueJS from "persistencejs/transaction/identity/issue";
import identitiesNubJS from "persistencejs/transaction/identity/nub";
import Msgs from "../../../utilities/Helpers/Msgs";
import identitiesDefineJS from "persistencejs/transaction/identity/define";
const { SigningCosmosClient } = require("@cosmjs/launchpad");
const restAPI = process.env.REACT_APP_API;
const identitiesDefine = new identitiesDefineJS(process.env.REACT_APP_ASSET_MANTLE_API);
const assetMint = new AssetMintJS(process.env.REACT_APP_ASSET_MANTLE_API);
const SendCoinQuery = new SendCoinJS(process.env.REACT_APP_ASSET_MANTLE_API);
const WrapQuery = new WrapJS(process.env.REACT_APP_ASSET_MANTLE_API);
const identitiesIssue = new IdentitiesIssueJS(process.env.REACT_APP_ASSET_MANTLE_API);
const identitiesNub = new identitiesNubJS(process.env.REACT_APP_ASSET_MANTLE_API);
const UnWrapQuery = new UnWrapJS(process.env.REACT_APP_ASSET_MANTLE_API);


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
        const cosmJS = new SigningCosmosClient(restAPI, accounts[0].address, offlineSigner );
        return await cosmJS.signAndBroadcast(msgs, fee, memo);
    };

    const handleKepler = () => {
        setLoader(true);
        console.log(address,'address');
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
            const wallet = keyUtils.getWallet(userMnemonic);
            let queryResponse;
            if (props.TransactionName === 'assetMint') {
                console.log('mintasset');
                queryResponse = queries.mintAssetQuery(wallet.address, userMnemonic, props.totalDefineObject, assetMint);
            }  else if (props.TransactionName === 'wrap') {
                queryResponse = queries.wrapQuery(wallet.address, userMnemonic, props.totalDefineObject, WrapQuery);
            }  else if (props.TransactionName === 'unwrap') {
                queryResponse = queries.unWrapQuery(wallet.address, userMnemonic, props.totalDefineObject, UnWrapQuery);
            }  else if (props.TransactionName === 'nubid') {
                queryResponse = queries.nubIdQuery(wallet.address, userMnemonic, props.totalDefineObject, identitiesNub);
            }  else if (props.TransactionName === 'issueidentity') {
                queryResponse = queries.issueIdentityQuery(wallet.address, userMnemonic, props.totalDefineObject, identitiesIssue);
            } else if (props.TransactionName === 'defineIdentity') {
                queryResponse = queries.defineQuery(wallet.address, userMnemonic, props.totalDefineObject, identitiesDefine);
            } else if (props.TransactionName === 'sendcoin') {
                queryResponse = queries.sendCoinQuery(userMnemonic, props.totalDefineObject, SendCoinQuery);
            }
            queryResponse.then(function (item) {
                const data = JSON.parse(JSON.stringify(item));
                const pollResponse = pollTxHash(process.env.REACT_APP_ASSET_MANTLE_API, data.txhash);
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
                    {t("LOGIN_WITH_KEYSTORE")}
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
                                {t("LOGIN")}
                            </Button>
                        </div>
                        <div className="submitButtonSection">
                            <button type={"button"} variant="primary" className="button-double-border" onClick={() => handleKepler("kepler")}>{t("SIGN_IN_KEPLER")}
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
