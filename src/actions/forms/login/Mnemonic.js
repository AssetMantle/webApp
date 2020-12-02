import React from "react";
import {Modal, Form, Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import keyUtils from "persistencejs/utilities/keys";
import {useTranslation} from "react-i18next";

const LoginMnemonic = () => {
    const history = useHistory();
    const {t} = useTranslation();
    const handleSubmit = async event => {
        const error = keyUtils.createWallet(event.target.mnemonic.value)
        if (error.error != null) {
            return (<div>ERROR!!</div>)
        }
        const wallet = keyUtils.getWallet(event.target.mnemonic.value)
        localStorage.setItem("address", wallet.address)
        localStorage.setItem("mnemonic", event.target.mnemonic.value)
        history.push('/ActionsSwitcher');
    }

    return (
        <div className="accountInfo">
            <Modal.Header closeButton>
                {t("LOGIN_MNEMONIC")}
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Label>{t("MNEMONIC")}</Form.Label>
                    <Form.Control
                        type="text"
                        name="mnemonic"
                        placeholder="Enter Mnemonic"
                        required={true}
                    />
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
        </div>
    );
}
export default LoginMnemonic