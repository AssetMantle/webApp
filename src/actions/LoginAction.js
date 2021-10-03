import React, {useState} from "react";
import {Modal} from 'react-bootstrap';
import {CreateIdentity, PrivateKey, Ledger} from "./forms/login";
import IdentityLogin from './forms/login/IdentityLogin';
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import MnemonicIcon from "../assets/images/MnemonicIcon.svg";
import Icon from "../icons";

const Login = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const [show, setShow] = useState(true);

    const [externalComponent, setExternalComponent] = useState("");
    const handleClose = () => {
        setShow(false);
        history.push('/');
    };
    const handleRoute = (route) => {
        setShow(false);
        setExternalComponent(route);
    };

    return (
        <div className="accountInfo">
            <Modal show={show} onHide={handleClose} className="signup-section login-section" centered>
                <Modal.Header closeButton>
                    {t("LOGIN_FORM")}
                </Modal.Header>
                <Modal.Body className="text-center">
                    <div className="mrt-10">
                        <div className="button-view"
                            onClick={() => handleRoute("IdentityLogin")}
                        >
                            <div className="icon-section">
                                <div className="icon"><img src={MnemonicIcon} alt="MnemonicIcon"/></div>
                                {t("LOGIN_WITH_USER_NAME")}</div>
                            <Icon viewClass="arrow-icon" icon="arrow"/>
                        </div>
                    </div>
                    {/*<div className="submitButtonSection">*/}
                    {/*    <Button*/}
                    {/*        variant="primary"*/}
                    {/*        type="button"*/}
                    {/*        className="button-double-border"*/}
                    {/*        onClick={() => handleRoute("CreateIdentity")}*/}
                    {/*    >*/}
                    {/*        Create Identity*/}
                    {/*    </Button>*/}
                    {/*</div>*/}
                </Modal.Body>
            </Modal>

            <div>
                {
                    externalComponent === 'IdentityLogin' ?
                        <IdentityLogin setExternalComponent={setExternalComponent} setShow={setShow} pageName="LoginAction"/> :
                        null
                }
                {
                    externalComponent === 'CreateIdentity' ?
                        <CreateIdentity setExternalComponent={setExternalComponent} setShow={setShow} pageName="LoginAction"/> :
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
};
export default Login;
