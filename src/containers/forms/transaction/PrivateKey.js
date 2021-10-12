import React, {useState} from "react";
import {Modal, Form, Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import {getWallet} from "persistencejs/build/utilities/keys";
import {useTranslation} from "react-i18next";
import transactions from "../../../utilities/Helpers/transactions";
import Loader from "../../../components/loader";
import Icon from "../../../icons";
import queries from "../../../utilities/Helpers/query";
import GetID from "../../../utilities/Helpers/getID";
import GetMeta from "../../../utilities/Helpers/getMeta";
import {queryIdentities} from "persistencejs/build/transaction/identity/query";
import ModalCommon from "../../../components/modal";
const identitiesQuery = new queryIdentities(process.env.REACT_APP_ASSET_MANTLE_API);
const PrivateKeyTransaction = (props) => {
    const {t} = useTranslation();
    const history = useHistory();
    const [show, setShow] = useState(true);
    const [errorMessage, setErrorMessage] = useState(false);
    const [loader, setLoader] = useState(false);
    const [importMnemonic, setImportMnemonic] = useState(true);
    const [testID, setTestID] = useState('');
    const [nubID, setNubID] = useState('');
    const [response, setResponse] = useState({});
    const GetIDHelper = new GetID();
    const GetMetaHelper = new GetMeta();
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
    const handleClose = () => {
        setShow(false);
        props.setExternalComponent("");
        history.push('/');
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
                    {t("KEYSTORE_LOGIN")}
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
                    {errorMessage !== "" ?
                        <div className="login-error"><p className="error-response">{errorMessage}</p></div>
                        : ""
                    }
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
