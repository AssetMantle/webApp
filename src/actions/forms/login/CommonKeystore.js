import React, { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import config from "../../../constants/config.json";
import AssetMintJS from "persistencejs/transaction/assets/mint";
import KeplerWallet from "../../../utilities/Helpers/kelplr";
import keyUtils from "persistencejs/utilities/keys";
import { useTranslation } from "react-i18next";
import { pollTxHash } from "../../../utilities/Helpers/filter";
import queries from '../../../utilities/Helpers/query';
import Loader from "../../../components/loader";
import ModalCommon from "../../../components/modal";
import WrapJS from "persistencejs/transaction/splits/wrap";
import UnWrapJS from "persistencejs/transaction/splits/unwrap";
import IdentitiesIssueJS from "persistencejs/transaction/identity/issue";
import identitiesNubJS from "persistencejs/transaction/identity/nub";
import privateKeyIcon from "../../../assets/images/PrivatekeyIcon.svg";
import Icon from "../../../icons";
// import {cosmosSignTxAndBroadcast} from '../../../utilities/Helpers/kelplr';
import identitiesDefineJS from "persistencejs/transaction/identity/define";
const restAPI = process.env.REACT_APP_API;
const identitiesDefine = new identitiesDefineJS(process.env.REACT_APP_ASSET_MANTLE_API)
const assetMint = new AssetMintJS(process.env.REACT_APP_ASSET_MANTLE_API)
const WrapQuery = new WrapJS(process.env.REACT_APP_ASSET_MANTLE_API)
const identitiesIssue = new IdentitiesIssueJS(process.env.REACT_APP_ASSET_MANTLE_API)
const identitiesNub = new identitiesNubJS(process.env.REACT_APP_ASSET_MANTLE_API)
const UnWrapQuery = new UnWrapJS(process.env.REACT_APP_ASSET_MANTLE_API)
const CommonKeystore = (props) => {
    console.log(props, 'props')

    const { t } = useTranslation();
    const history = useHistory();
    const [show, setShow] = useState(true);
    const [response, setResponse] = useState({});
    const [importMnemonic, setImportMnemonic] = useState(true);
    const [loader, setLoader] = useState(false)
    const [incorrectPassword, setIncorrectPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [files, setFiles] = useState("");
    const [address, setAddress] = useState("");

    useEffect(() => {
        setErrorMessage("");
        const kepler = KeplerWallet();
        kepler.then(function () {
            const address = localStorage.getItem("keplerAddress");
            console.log(address,'address')
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
    const cosmosSignTxAndBroadcast = async (tx, address, cb) => {
    
       
            await window.keplr && window.keplr.enable(process.env.REACT_APP_CHAIN_ID);
            const offlineSigner = window.getOfflineSigner && window.getOfflineSigner(process.env.REACT_APP_CHAIN_ID);
            const cosmJS = new SigningCosmosClient(restAPI, address, offlineSigner );
            console.log(offlineSigner,'offlineSigner');
            console.log(cosmJS,'cosmJS');
    
            cosmJS.signAndBroadcast(tx.msg, tx.fee, tx.memo).then((result) => {
                console.log(result,'result')
                if (result && result.code !== undefined && result.code !== 0) {
                    // console.log(result,'result')
                    cb(result.log || result.rawLog);
                } else {
                    cb(null, result);
                }
            }).catch((error) => {
                console.log(error,'error')
                cb(error && error.message);
            });
      
    };
    const handleKepler = () => { 
              const tx = {
                msg: [{
                    type: "cosmos-sdk/MsgSend",
                    value: {
                        from_address: address,
                        to_address: address,
                        amount: [{ amount: String(5000), denom: 'stake' }],
                    },
                }],
                fee: { amount: [{ amount: String(5000), denom: 'stake' }], gas: String(200000) },
                memo: '',
            };
    
            cosmosSignTxAndBroadcast(tx, address, (error, result) => {
                if (error) {
                   console.log(error,'error')
                    return;
                }
    
              
                console.log(result && result.transactionHash, 'success')
            });
          
    }
    const handleSubmit = async e => {
        e.preventDefault()
        setLoader(true);
        let userMnemonic;
        const password = document.getElementById("password").value
        const fileReader = new FileReader();
        if (importMnemonic) {
            const password = e.target.password.value;
            let promise = queries.PrivateKeyReader(e.target.uploadFile.files[0], password);
            await promise.then(function (result) {
                userMnemonic = result;
                console.log(userMnemonic, 'userMnemonic')
            }).catch(err => {
                setLoader(false);
                // setErrorMessage(err);
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
            const wallet = keyUtils.getWallet(userMnemonic)
            let queryResponse;
            if (props.TransactionName === 'assetMint') {
                console.log('mintasset')
                queryResponse = queries.mintAssetQuery(wallet.address, userMnemonic, props.totalDefineObject, assetMint)
            }  else if (props.TransactionName === 'wrap') {
                queryResponse = queries.wrapQuery(wallet.address, userMnemonic, props.totalDefineObject, WrapQuery)
            }  else if (props.TransactionName === 'unwrap') {
                queryResponse = queries.unWrapQuery(wallet.address, userMnemonic, props.totalDefineObject, UnWrapQuery)
            }  else if (props.TransactionName === 'nubid') {
                queryResponse = queries.nubIdQuery(wallet.address, userMnemonic, props.totalDefineObject, identitiesNub)
            }  else if (props.TransactionName === 'issueidentity') {
                queryResponse = queries.issueIdentityQuery(wallet.address, userMnemonic, props.totalDefineObject, identitiesIssue)
            } else if (props.TransactionName === 'defineIdentity') {
                queryResponse = queries.defineQuery(wallet.address, userMnemonic, props.totalDefineObject, identitiesDefine)
            }
            queryResponse.then(function (item) {
                const data = JSON.parse(JSON.stringify(item));
                const pollResponse = pollTxHash(process.env.REACT_APP_ASSET_MANTLE_API, data.txhash);
                pollResponse.then(function (pollData) {
                    const pollObject = JSON.parse(pollData);
                    console.log(pollObject,'pollObject')
                    setShow(false)
                    setLoader(false);
                    setResponse(data)
                })
            })
        } else {
            setLoader(false);
        }



    }
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
                        {incorrectPassword ?
                            <Form.Text className="error-response">
                                {t("INCORRECT_PASSWORD")}
                            </Form.Text>
                            : ""
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
                            <button  variant="primary" className="button-double-border" onClick={() => handleKepler("kepler")}>{t("SIGN_IN_KEPLER")}
                            </button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            {!(Object.keys(response).length === 0) ?
                <ModalCommon data={response} setExternal={handleClose} />
                : ""
            }
        </div>
    );
}
export default CommonKeystore