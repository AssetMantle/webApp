import React, {useState} from "react";
import {Modal, Form, Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import keyUtils from "persistencejs/utilities/keys";
import {useTranslation} from "react-i18next";
import MnemonicIcon from "../../../assets/images/MnemonicIcon.svg";
import Icon from "../../../icons";

const LoginMnemonic = React.memo((props) => {
    const history = useHistory();
    const [show, setShow] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const {t} = useTranslation();
    const handleSubmit = async event => {
        event.preventDefault();
        const error = keyUtils.createWallet(event.target.mnemonic.value)
        if (error.error != null) {
            setErrorMessage(error.error);
        }
        else {
            const wallet = keyUtils.getWallet(event.target.mnemonic.value)
            localStorage.setItem("address", wallet.address)
            localStorage.setItem("mnemonic", event.target.mnemonic.value)
            history.push('/assets');
        }
    }
    const handleClose = () => {
        setShow(false);
        history.push('/');
        props.setExternalComponent("");
    };
    return (
        <div>
            <Modal show={show} onHide={handleClose}  className="mnemonic-login-section login-section" centered>
            <Modal.Header closeButton>
                {t("LOGIN_FORM")}
            </Modal.Header>
            <Modal.Body>
                <div className="mrt-10">
                    <div className="button-view">
                        <div className="icon-section">
                            <div className="icon"><img src={MnemonicIcon} alt="MnemonicIcon"/> </div>
                            {t("LOGIN_MNEMONIC")}</div>
                        <Icon viewClass="arrow-icon" icon="arrow" />
                    </div>
                </div>
                <Form onSubmit={handleSubmit}>
                    <Form.Control as="textarea" rows={5} name="mnemonic"
                                  placeholder="Enter Mnemonic"
                                  required={true}/>
                    {errorMessage !== "" ?
                        <div className="login-error"><p className="error-response">{errorMessage}</p></div>
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
        </div>
    );
})
export default LoginMnemonic