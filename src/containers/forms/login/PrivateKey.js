import React, {useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import transactions from "../../../utilities/Helpers/transactions";
import Loader from "../../../components/loader";
import Icon from "../../../icons";
import helper from "../../../utilities/helper";

const PrivateKey = (props) => {
    const {t} = useTranslation();
    const history = useHistory();
    const [show, setShow] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [loader, setLoader] = useState(false);
    const keyStoreSubmitHandler = async (e) => {
        e.preventDefault();
        const userName = props.userData.userName;
        const password = e.target.password.value;
        if(password.length >3) {
            let promise = transactions.PrivateKeyReader(e.target.uploadFile.files[0], password);
            let userMnemonic;
            await promise.then(async function (result) {
                userMnemonic = result;
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
                    setErrorMessage("");
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
                    setErrorMessage('Address Not Present');
                }
            }).catch(err => {
                setLoader(false);
                console.log(err, "err");
                setErrorMessage(err);
            });


        }else {
            setLoader(false);
            setErrorMessage("Password length must be greater than 3");
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
                            <Form.Group className="m-0">
                                <Form.Label>{t("DECRYPT_KEY_STORE")}</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    id="password"
                                    onKeyPress={helper.handleChangePassword}
                                    placeholder="password"
                                    required={true}
                                />
                            </Form.Group>
                        </>
                        <div className="error-section"><p className="error-response">
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
        </div>
    );
};
export default PrivateKey;
