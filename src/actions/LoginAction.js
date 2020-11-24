import React, {useState} from "react";
import {Modal, Form, Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import keyUtils from "persistencejs/utilities/keys";
import {LoginMnemonic, PrivateKey, Ledger} from "./forms/login";
import {SignUp} from "./forms";

const LoginAction = () => {
    const history = useHistory();
    const [show, setShow] = useState(false);
    const [singUpShow, setSingUpShow] = useState(false);
    const [accountData, setAccountData] = useState({});
    const [externalComponent, setExternalComponent] = useState("");
    const handleClose = () => {
        setShow(false)
    };
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
    const handleRoute = (route) => {
        setShow(true);
        setExternalComponent(route)
    };
    // const handleCreateWallet = () => {
    //     setSingUpShow(true);
    //     const walletInfo = keyUtils.createRandomWallet();
    //     setAccountData(walletInfo)
    // }
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
                                Login with mnemonic
                            </Button>
                        </div>
                        <div className="mrt-10">
                            <Button
                                variant="primary"
                                onClick={() => handleRoute("PrivateKey")}
                            >
                                Login with privateKey
                            </Button>
                        </div>
                        <div className="mrt-10">
                            <Button
                                variant="primary"
                                onClick={() => handleRoute("Ledger")}
                            >
                                Login with ledger
                            </Button>
                        </div>
                        <div className="mrt-10">
                            <Button
                                variant="primary"
                                onClick={() => handleRoute("SignUp")}
                            >
                                Sign Up
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
                    externalComponent === 'SignUp' ?
                        <SignUp currentState={show} onShowChange={setShow}/> :
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