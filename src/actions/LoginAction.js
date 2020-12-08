import React, {useState} from "react";
import {Modal, Button} from "react-bootstrap";
import {LoginMnemonic, PrivateKey, Ledger} from "./forms/login";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import MnemonicIcon from "../assets/images/MnemonicIcon.svg"
import PrivatekeyIcon from "../assets/images/PrivatekeyIcon.svg"
import LedgerIcon from "../assets/images/LedgerIcon.svg"
import arrowRightIcon from "../assets/images/arrowRightIcon.svg"

const Login = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const [show, setShow] = useState(true);
    const [externalComponent, setExternalComponent] = useState("");
    const handleClose = () => {
        setShow(false)
        history.push('/');
    };
    const handleRoute = (route) => {
        setShow(false);
        setExternalComponent(route)
    };
    return (
        <div className="accountInfo">
            <Modal show={show} onHide={handleClose} className="signup-section login-section" centered>
                <Modal.Header closeButton>
                    {t("LOGIN_FORM")}
                </Modal.Header>
                <Modal.Body>
                    <div className="mrt-10">
                        <div className="button-view"
                            onClick={() => handleRoute("LoginMnemonic")}
                        >
                            <div className="icon-section">
                                <div className="icon"><img src={MnemonicIcon} alt="MnemonicIcon"/> </div>
                                {t("LOGIN_MNEMONIC")}</div>
                            <img src={arrowRightIcon} alt="arrowRightIcon"/>
                        </div>
                    </div>
                    <div className="mrt-10">
                        <div className="button-view"
                             onClick={() => handleRoute("PrivateKey")}
                        >
                            <div className="icon-section">
                                <div className="icon"><img src={PrivatekeyIcon} alt="PrivatekeyIcon"/> </div>
                                {t("LOGIN_PRIVATE_KEY")}
                            </div>
                            <img src={arrowRightIcon} alt="arrowRightIcon"/>
                        </div>
                    </div>
                    <div className="mrt-10">
                        <div className="button-view"
                             onClick={() => handleRoute("Ledger")}
                        >
                            <div className="icon-section">
                                <div className="icon"><img src={LedgerIcon} alt="LedgerIcon"/> </div>
                                {t("LEDGER_LOGIN")}
                            </div>
                            <img src={arrowRightIcon} alt="arrowRightIcon"/>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <div>
                {
                    externalComponent === 'LoginMnemonic' ?
                        <LoginMnemonic setExternalComponent={setExternalComponent}/> :
                        null
                }
                {
                    externalComponent === 'PrivateKey' ?
                        <PrivateKey setExternalComponent={setExternalComponent}/> :
                        null
                }
                {
                    externalComponent === 'Ledger' ?
                        <Ledger setExternalComponent={setExternalComponent}/> :
                        null
                }

            </div>
        </div>
    );
}
export default Login