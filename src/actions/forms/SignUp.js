import React, {useState, useCallback} from "react";
import {Modal, Form, Button} from "react-bootstrap";
import keyUtils from "persistencejs/utilities/keys";
import DownloadLink from "react-download-link";
import {useTranslation} from "react-i18next";

const SignUp = ({currentState, onShowChange}) => {
    const {t} = useTranslation();
    const [jsonName, getJsonname] = useState({});
    const [showEncrypt, setShowEncrypt] = useState(false);
    const [mnemonic, setMnemonic] = useState("");
    const [formName, setFormName] = useState("");
    const [showDownload, setShowDownload] = useState(false);

    const handleClose = useCallback(() => {
        onShowChange(false)
    }, [onShowChange])

    const handleSubmit = e => {
        e.preventDefault()
        setShowEncrypt(true)
        setShowDownload(true)
        const password = document.getElementById("password").value
        const error = keyUtils.createRandomWallet(password)
        if (error.error != null) {
            return (<div>ERROR!!</div>)
        }

        const create = keyUtils.createStore(error.mnemonic, password)
        if (create.error != null) {
            return (<div>ERROR!!</div>)
        }
        const jsonContent = JSON.stringify(create.Response);
        getJsonname(jsonContent)
        setMnemonic(error.mnemonic)
        localStorage.setItem("address", error.address)
        localStorage.setItem("mnemonic", error.mnemonic)
    }

    const handleEncrypt = (name) => {
        setFormName(name)
        setShowEncrypt(true)
    }

    return (
        <div className="accountInfo">
            <Modal.Header closeButton>
                {t("SIGNUP")}
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <p> {t("SIGNUP_NOTE")}</p>
                    <Button
                        variant="primary"
                        onClick={() => handleEncrypt("Login with PrivateKey")}
                    >
                        {t("MNEMONIC")}/{t("PRIVATE_KEY")}
                    </Button>
                    <Button
                        variant="primary"
                    >
                        {t("LEDGER_STORE")}
                    </Button>

                </Form>
            </Modal.Body>
            <Modal
                show={showEncrypt}
                onHide={handleClose}
                centered
            >
                <Modal.Header closeButton>
                    {formName}
                </Modal.Header>
                <Modal.Body>
                    {!showDownload ?
                        <Form onSubmit={handleSubmit}>
                            <Form.Label>{t("ENCRYPT_KEY_STORE")}</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                id="password"
                                placeholder="password"
                                required={true}
                            />
                            <Button
                                variant="primary"
                                type="submit"
                            >
                                {t("NEXT")}
                            </Button>

                        </Form>
                        : ""
                    }
                    {showDownload ?
                        <div>
                            <p><b>{t("SAVE_MNEMONIC")}:</b> {mnemonic}</p>
                            <DownloadLink
                                label="Download Key File for future use"
                                filename="key.json"
                                exportFile={() => `${jsonName}`}
                            />
                            <br/>
                            {t("DOWNLOAD_KEY")}
                            <br/>
                            <Button
                                variant="primary"
                                onClick={handleClose}
                            >
                                {t("DONE")}
                            </Button>
                        </div>
                        :
                        ""
                    }
                </Modal.Body>
            </Modal>

        </div>
    );
}
export default SignUp