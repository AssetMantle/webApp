import React, {useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import transactions from "../../../utilities/Helpers/transactions";
import Loader from "../../../components/loader";
import Icon from "../../../icons";

const PrivateKey = (props) => {
    const {t} = useTranslation();
    const history = useHistory();
    const [show, setShow] = useState(true);
    const [errorMessage, setErrorMessage] = useState(false);
    const [loader, setLoader] = useState(false);
    const [idErrorMessage, setIdErrorMessage] = useState("");
    const keyStoreSubmitHandler = async (e) => {
        e.preventDefault();
        const userName = props.userData.userName;
        const password = e.target.password.value;
        let promise = transactions.PrivateKeyReader(e.target.uploadFile.files[0], password);
        let userMnemonic;
        await promise.then(function (result) {
            userMnemonic = result;
        }).catch(err => {
            setLoader(false);
            setErrorMessage(err);
        });
        const wallet = await transactions.MnemonicWalletWithPassphrase(userMnemonic, "");
        let list = [];
        let idList = [];

        const addressList = localStorage.getItem("addresses");
        const userList = localStorage.getItem("userList");
        const identityList = localStorage.getItem("identityList");
        if (identityList !== null) {
            idList = JSON.parse(identityList);
        }
        if (userList !== null) {
            list = JSON.parse(userList);
        }
        if (addressList.includes(wallet[1])) {
            idList.push({[userName]: props.userData.identityId});
            setErrorMessage(false);
            setLoader(false);
            list.push(userName);
            localStorage.setItem("identityId", props.userData.identityId);
            localStorage.setItem("userList", JSON.stringify(list));
            localStorage.setItem("userName", userName);
            localStorage.setItem("userAddress", wallet[1]);
            localStorage.setItem("loginMode", "normal");
            localStorage.setItem("identityList", JSON.stringify(idList));
            history.push('/profile');
            window.location.reload();
        } else {
            setLoader(false);
            setIdErrorMessage('Address Not Present');
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
        } else {
            setShow(false);
            props.setShow(true);
            props.setExternalComponent('');
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
                    {t("KEYSTORE_LOGIN")}
                </Modal.Header>
                <Modal.Body>
                    {loader ?
                        <Loader/>
                        : ''
                    }
                    <Form onSubmit={keyStoreSubmitHandler}>
                        <>
                            <Form.Group>
                                <Form.File id="exampleFormControlFile1" name="uploadFile" accept=".json"
                                    label="Upload Keystore file" required={true}/>
                            </Form.Group>
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
                        </>

                        <div className="submitButtonSection">
                            <Button
                                variant="primary"
                                type="submit"
                                className="button-double-border"
                            >
                                {t("SUBMIT")}
                            </Button>
                        </div>
                        {errorMessage !== "" ?
                            <div className="login-error"><p className="error-response">{idErrorMessage}</p></div>
                            : ""
                        }
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default PrivateKey;
