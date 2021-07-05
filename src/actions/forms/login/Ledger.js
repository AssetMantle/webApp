import React, {useState} from "react";
import {Modal} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";

const Ledger = (props) => {
    const {t} = useTranslation();
    const history = useHistory();
    const [show, setShow] = useState(true);
    const handleClose = () => {
        setShow(false);
        history.push('/');
        props.setExternalComponent("");
    };
    return (
        <div>
            <Modal show={show} onHide={handleClose}  className="mnemonic-login-section login-section"centered>
                <Modal.Header closeButton>
                    {t("LEDGER_LOGIN")}
                </Modal.Header>
                <Modal.Body>
                    <p>{t("LEDGER_CONNECT")}</p>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default Ledger;
