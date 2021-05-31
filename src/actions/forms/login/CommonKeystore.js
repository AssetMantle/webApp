import React, { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import config from "../../../constants/config.json";
import AssetMintJS from "persistencejs/transaction/assets/mint";
import keyUtils from "persistencejs/utilities/keys";
import { useTranslation } from "react-i18next";
import queries from '../../../utilities/Helpers/query';
import Loader from "../../../components/loader";
import ModalCommon from "../../../components/modal";
import WrapJS from "persistencejs/transaction/splits/wrap";
import UnWrapJS from "persistencejs/transaction/splits/unwrap";
import IdentitiesIssueJS from "persistencejs/transaction/identity/issue";
import identitiesNubJS from "persistencejs/transaction/identity/nub";
import privateKeyIcon from "../../../assets/images/PrivatekeyIcon.svg";
import Icon from "../../../icons";
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
    useEffect(() => {
        const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
        if (encryptedMnemonic !== null) {
            setImportMnemonic(false);
        } else {
            setImportMnemonic(true);
        }
    }, []);
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
                queryResponse.then(function (item) {
                    const data = JSON.parse(JSON.stringify(item));
                    console.log(data, 'data')
                    setResponse(data)
                    setShow(false)
                    setLoader(false);
                })
            } if(props.TransactionName === 'wrap') { 
                queryResponse = queries.wrapQuery(wallet.address, userMnemonic, props.totalDefineObject, WrapQuery)
                queryResponse.then(function (item) {
                    const data = JSON.parse(JSON.stringify(item));
                    console.log(data, 'data')
                    setResponse(data)
                    setShow(false)
                    setLoader(false);
                })
            } if(props.TransactionName === 'unwrap') { 
                queryResponse = queries.unWrapQuery(wallet.address, userMnemonic, props.totalDefineObject, UnWrapQuery)
                queryResponse.then(function (item) {
                    const data = JSON.parse(JSON.stringify(item));
                    console.log(data, 'data')
                    setResponse(data)
                    setShow(false)
                    setLoader(false);
                })
            }  if(props.TransactionName === 'nubid') {
                queryResponse = queries.nubIdQuery(wallet.address, userMnemonic, props.totalDefineObject, identitiesNub)
                queryResponse.then(function (item) {
                    const data = JSON.parse(JSON.stringify(item));
                    console.log(data, 'data')
                    setResponse(data)
                    setShow(false)
                    setLoader(false);
                })
            } if(props.TransactionName === 'issueidentity') {
                queryResponse = queries.issue(wallet.address, userMnemonic, props.totalDefineObject, identitiesIssue)
                queryResponse.then(function (item) {
                    const data = JSON.parse(JSON.stringify(item));
                    console.log(data, 'data')
                    setResponse(data)
                    setShow(false)
                    setLoader(false);
                })
            } else {
                queryResponse = queries.defineQuery(wallet.address, userMnemonic, props.totalDefineObject, props.ActionName)
                queryResponse.then(function (item) {
                    const data = JSON.parse(JSON.stringify(item));
                    console.log(data, 'data')
                    setResponse(data)
                    setShow(false)
                    setLoader(false);
                })
            }
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