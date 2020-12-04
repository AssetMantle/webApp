import React, {useState} from "react";
import {Modal, Button} from "react-bootstrap";
import {LoginMnemonic, PrivateKey, Ledger} from "./forms/login";
import {useTranslation} from "react-i18next";

const LoginAction = () => {
    const {t} = useTranslation();
    const [show, setShow] = useState(false);
    const [externalComponent, setExternalComponent] = useState("");
    const handleClose = () => {
        setShow(false)
    };
    const handleRoute = (route) => {
        setShow(true);
        setExternalComponent(route)
    };
    return (
        <div className="container">
            <div className="accountInfo">
                <div className="row row-cols-1 row-cols-md-2 card-deck createAccountSection">
                    <div className="col-md-6 signup-box">
                        <div className="mrt-10">
                            <Button
                                variant="primary"
                                onClick={() => handleRoute("LoginMnemonic")}
                            >
                                {t("LOGIN_MNEMONIC")}
                            </Button>
                        </div>
                        <div className="mrt-10">
                            <Button
                                variant="primary"
                                onClick={() => handleRoute("PrivateKey")}
                            >
                                {t("LOGIN_PRIVATE_KEY")}
                            </Button>
                        </div>
                        <div className="mrt-10">
                            <Button
                                variant="primary"
                                onClick={() => handleRoute("Ledger")}
                            >
                                {t("LEDGER_LOGIN")}
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
            <Modal show={show} onHide={handleClose} centered>
                {
                    externalComponent === 'LoginMnemonic' ?
                        <LoginMnemonic/> :
                        null
                }
                {
                    externalComponent === 'PrivateKey' ?
                        <PrivateKey/> :
                        null
                }
                {
                    externalComponent === 'Ledger' ?
                        <Ledger/> :
                        null
                }

            </Modal>
        </div>
    );
}
export default LoginAction