import React, {useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import transactions from "../../../utilities/Helpers/transactions";
import Loader from "../../../components/loader";
import Icon from "../../../icons";
import queries from "../../../utilities/Helpers/query";
import GetMeta from "../../../utilities/Helpers/getMeta";
import ModalCommon from "../../../components/modal";
import config from "../../../config";
import {pollTxHash} from "../../../utilities/Helpers/filter";
const url = process.env.REACT_APP_ASSET_MANTLE_API;
const PrivateKeyTransaction = (props) => {
    const {t} = useTranslation();
    const history = useHistory();
    const [show, setShow] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [loader, setLoader] = useState(false);
    const [importMnemonic, setImportMnemonic] = useState(true);
    const [testID, setTestID] = useState('');
    const [nubID, setNubID] = useState('');
    const [response, setResponse] = useState({});
    // const GetIDHelper = new GetID();
    const GetMetaHelper = new GetMeta();

    useEffect(() => {
        const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
        if (encryptedMnemonic !== null) {
            setImportMnemonic(false);
        } else {
            setImportMnemonic(true);
        }
    }, []);
    const handleSubmit = async e => {
        e.preventDefault();
        setLoader(true);
        setErrorMessage("");
        const password = e.target.password.value;
        if(password.length > 3) {
            let userMnemonic;
            if (importMnemonic) {
                let promise = transactions.PrivateKeyReader(e.target.uploadFile.files[0], password);
                await promise.then(function (result) {
                    userMnemonic = result;
                }).catch(err => {
                    setLoader(false);
                    setErrorMessage(err);
                });
            } else {
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
                const wallet = await transactions.MnemonicWalletWithPassphrase(userMnemonic, '');
                let queryResponse = queries.transactionDefinition(wallet[1], userMnemonic, "normal", props.TransactionName, props.totalDefineObject);

                queryResponse.then(async function (item) {
                    if(item.transactionHash){
                        let queryHashResponse =  pollTxHash(url, item.transactionHash);
                        queryHashResponse.then(function (queryItem) {
                            const parsedQueryItem = JSON.parse(queryItem);
                            if (parsedQueryItem.code) {
                                localStorage.setItem('loginMode', 'normal');
                                if (props.TransactionName === "nubid") {
                                    setErrorMessage(parsedQueryItem.rawLog);
                                } else {
                                    setErrorMessage(parsedQueryItem.rawLog);
                                }
                                setLoader(false);
                                const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
                                if (encryptedMnemonic !== null) {
                                    setImportMnemonic(false);
                                } else {
                                    setImportMnemonic(true);
                                }
                            } else {
                                localStorage.setItem('loginMode', 'normal');
                                if (props.TransactionName === "nubid") {
                                    setNubID(props.totalDefineObject.nubId);
                                    const identityID = config.nubClassificationID+'|'+ GetMetaHelper.Hash(GetMetaHelper.Hash(props.totalDefineObject.nubId));
                                    setTestID(identityID);
                                    let totalData = {
                                        fromID: identityID,
                                        CoinAmountDenom: '5000000' + config.coinDenom,
                                    };

                                    let queryResponse = queries.transactionDefinition(wallet[1], userMnemonic, "normal", 'wrap', totalData);
                                    queryResponse.then(async function (queryItem) {
                                        console.log(queryItem, "item wrap response");
                                    }).catch(err => {
                                        console.log(err, "err wrap");
                                    });
                                }
                                setShow(false);
                                setLoader(false);
                                setResponse(item);
                            }
                        });
                    }
                }).catch(err => {
                    setLoader(false);
                    setErrorMessage(err.response
                        ? err.response.data.message
                        : err.message);
                    if (props.TransactionName === "nubid") {
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
        }else {
            setLoader(false);
            setErrorMessage("Password length must be greater than 3");
        }
    };
    const handleClose = () => {
        setShow(false);
        props.setExternalComponent("");
        props.handleClose();
        if (props.TransactionName === "nubid") {
            history.push('/');
        }
    };
    const backHandler = () => {
        if(props.loginMode !== null) {
            props.backHandler();
        }else{
            if (props.TransactionName === "nubid") {
                setShow(false);
                props.setShow(true);
                props.setExternalComponent('');
            } else {
                setShow(false);
                props.setShow(true);
                props.setExternalComponent('');
            }
        }
    };
    return (
        <div>
            <Modal show={show} onHide={handleClose} className="mnemonic-login-section login-section key-select"
                centered>
                <Modal.Header closeButton>
                    <div className="back-button" onClick={backHandler}>
                        <Icon viewClass="arrow-icon" icon="arrow"/>
                    </div>
                    {t("KEYSTORE")}
                </Modal.Header>
                <Modal.Body>
                    {loader ?
                        <Loader/>
                        : ''
                    }
                    <Form onSubmit={handleSubmit}>
                        {
                            importMnemonic ?
                                <>
                                    <Form.Group>
                                        <Form.File id="exampleFormControlFile1" name="uploadFile" accept=".json"
                                            label="Upload private key file" required={true}/>
                                    </Form.Group>
                                    <Form.Group className="m-0">
                                        <Form.Label>{t("DECRYPT_KEY_STORE")}</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            id="password"
                                            placeholder="password"
                                            required={true}
                                        />
                                    </Form.Group>
                                </>
                                :
                                <Form.Group className="m-0">
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
                        <div className="error-section">
                            <p className="error-response">
                                {errorMessage !== "" ?
                                    errorMessage
                                    : ""
                                }
                            </p>
                        </div>

                        <div className="submitButtonSection">
                            <Button
                                variant="primary"
                                type="submit"
                            >
                                {t("SUBMIT")}
                            </Button>
                        </div>
                    </Form>

                </Modal.Body>
            </Modal>
            {!(Object.keys(response).length === 0) ?
                <ModalCommon
                    data={response}
                    handleClose={handleClose}
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
export default PrivateKeyTransaction;
