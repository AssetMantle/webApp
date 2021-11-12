import React, {useEffect, useState} from "react";
import {Modal} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import Icon from "../../../icons";
import {Keplr, Ledger, PrivateKey} from "./index";
import LedgerTransaction from "../transaction/Ledger";
import KeplrTransaction from "../transaction/Keplr";
import PrivateKeyTransaction from "../transaction/PrivateKey";
import {useHistory} from "react-router-dom";
import KeysCreate from "../createKeys/KeysCreate";

const TransactionOptions = (props) => {
    const history = useHistory();
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [externalComponent, setExternalComponent] = useState("");
    const [loginMode, setLoginMode] = useState("");

    useEffect(()=>{
        setLoginMode(localStorage.getItem('loginMode'));
    },[]);
    const handleClose = () => {
        setShow(false);
        props.setExternalComponent("");
        if (props.TransactionName === "nubid" || props.TransactionName === "login") {
            history.push('/');
        }else if(props.TransactionName !== "login"){
            props.handleClose();
        }
    };

    const handleRoute = (route) => {
        setShow(false);
        setExternalComponent(route);
    };

    const backHandler = () => {
        setShow(false);
        props.setExternalComponent('');
        if (props.TransactionName !== "assetMint") {
            props.setShow(true);
            if (props.TransactionName === "nubid") {
                props.setLoader(false);
            }
        }
    };

    return (
        <div>
            {props.TransactionName === "login" || props.TransactionName === "nubid" ?
                <Modal show={show} onHide={handleClose} className="mnemonic-login-section login-section key-select"
                    centered>
                    <Modal.Header closeButton>
                        <div className="back-button" onClick={backHandler}>
                            <Icon viewClass="arrow-icon" icon="arrow"/>
                        </div>
                        {t("Choose Option")}
                    </Modal.Header>

                    <Modal.Body>
                        <div className="options-container">
                            <div className="option-box" onClick={() => handleRoute("Keystore")}>
                                <Icon viewClass="key-icon" icon="keystore"/>
                                <p>Keystore</p>
                            </div>
                            <div className="option-box" onClick={() => handleRoute("Keplr")}>
                                <Icon viewClass="key-icon" icon="keplr"/>
                                <p>Keplr</p>
                            </div>
                            <div className="option-box" onClick={() => handleRoute("Ledger")}>
                                <Icon viewClass="key-icon" icon="ledger"/>
                                <p>Ledger</p>
                            </div>
                        </div>
                        {props.TransactionName === "nubid" ?
                            <div className="submitButtonSection">
                                <p onClick={() => handleRoute('create')} className="text-link"> Don&apos;t have an
                                    existing
                                    keys? Create One</p>
                            </div>
                            : ""}
                    </Modal.Body>
                </Modal>
                : ""
            }
            {props.TransactionName === "login" ?
                <>
                    {
                        externalComponent === 'Keystore' ?
                            <PrivateKey
                                setExternalComponent={setExternalComponent}
                                setShow={setShow}
                                userData={props.userData}
                                pageName="LoginAction"
                            /> :
                            null
                    }
                    {
                        externalComponent === 'Keplr' ?
                            <Keplr setExternalComponent={setExternalComponent}
                                userData={props.userData}
                                setShow={setShow}/> :
                            null
                    }
                    {
                        externalComponent === 'Ledger' ?
                            <Ledger setExternalComponent={setExternalComponent}
                                userData={props.userData}
                                setShow={setShow}
                            /> :
                            null
                    }
                </>
                :
                <>
                    {
                        externalComponent === 'Keystore' || loginMode === "normal" ?
                            <PrivateKeyTransaction
                                setExternalComponent={setExternalComponent}
                                userData={props.userData}
                                totalDefineObject={props.totalDefineObject}
                                TransactionName={props.TransactionName}
                                handleClose={handleClose}
                                setShow={setShow}
                            /> :
                            null
                    }
                    {
                        externalComponent === 'Keplr' || loginMode === "keplr" ?
                            <KeplrTransaction
                                setExternalComponent={setExternalComponent}
                                userData={props.userData}
                                totalDefineObject={props.totalDefineObject}
                                TransactionName={props.TransactionName}
                                handleClose={handleClose}
                                setShow={setShow}
                            /> :
                            null
                    }
                    {
                        externalComponent === 'Ledger' || loginMode === "ledger" ?
                            <LedgerTransaction
                                setExternalComponent={setExternalComponent}
                                userData={props.userData}
                                totalDefineObject={props.totalDefineObject}
                                TransactionName={props.TransactionName}
                                handleClose={handleClose}
                                setShow={setShow}

                            /> :
                            null
                    }
                </>
            }
            {
                externalComponent === 'create' ?
                    <KeysCreate
                        setExternalComponent={setExternalComponent}
                        setShow={setShow}
                        totalDefineObject={props.totalDefineObject}
                        TransactionName={props.TransactionName}
                    /> :
                    null
            }
        </div>
    );
};
export default TransactionOptions;
