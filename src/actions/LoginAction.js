import React, {useState} from "react";
import {Modal, Button} from "react-bootstrap";
import {LoginMnemonic, PrivateKey, Ledger} from "./forms/login";
import IdentityLogin from './forms/login/IdentityLogin';
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import MnemonicIcon from "../assets/images/MnemonicIcon.svg"
import PrivatekeyIcon from "../assets/images/PrivatekeyIcon.svg"
import LedgerIcon from "../assets/images/LedgerIcon.svg"
import Icon from "../icons";

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
                             onClick={() => handleRoute("IdentityLogin")}
                        >
                            <div className="icon-section">
                                <div className="icon"><img src={MnemonicIcon} alt="MnemonicIcon"/></div>
                                Login with Identity</div>
                            <Icon viewClass="arrow-icon" icon="arrow"/>
                        </div>
                    </div>
                    <div className="mrt-10">
                        <div className="button-view"
                             onClick={() => handleRoute("LoginMnemonic")}
                        >
                            <div className="icon-section">
                                <div className="icon"><img src={MnemonicIcon} alt="MnemonicIcon"/></div>
                                {t("LOGIN_MNEMONIC")}</div>
                            <Icon viewClass="arrow-icon" icon="arrow"/>
                        </div>
                    </div>
                    <div className="mrt-10">
                        <div className="button-view"
                             onClick={() => handleRoute("PrivateKey")}
                        >
                            <div className="icon-section">
                                <div className="icon"><img src={PrivatekeyIcon} alt="PrivatekeyIcon"/></div>
                                {t("LOGIN_PRIVATE_KEY")}
                            </div>
                            <Icon viewClass="arrow-icon" icon="arrow"/>
                        </div>
                    </div>
                    <div className="mrt-10">
                        <div className="button-view disabled"
                            // onClick={() => handleRoute("Ledger")}
                             title="To be implemented"
                        >
                            <div className="icon-section">
                                <div className="icon"><img src={LedgerIcon} alt="LedgerIcon"/></div>
                                {t("LEDGER_LOGIN")}
                            </div>
                            <Icon viewClass="arrow-icon" icon="arrow"/>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <div>
                {
                    externalComponent === 'IdentityLogin' ?
                        <IdentityLogin setExternalComponent={setExternalComponent}/> :
                        null
                }
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