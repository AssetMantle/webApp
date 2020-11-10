import React, {useState} from "react";
import {Modal, Form, Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import keyUtils from "persistencejs/utilities/keys";

const LoginAction = () => {
    const history = useHistory();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [accountData, setAccountData] = useState({});
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
    const handleCreateWallet = () => {
        setShow(true);
        const walletInfo = keyUtils.createRandomWallet();
        setAccountData(walletInfo)
    }
    return (
        <div className="container">
            <div className="accountInfo">
                <div className="row row-cols-1 row-cols-md-2 card-deck createAccountSection">
                    <div className="col-md-6 custom-pad signup-box">
                        <Form onSubmit={handleSubmit}>
                            <Form.Label>Mnemonic</Form.Label>
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
                                    Submit
                                </Button>
                                <p className="mrt-10">New User ?</p>
                                <Button
                                    variant="primary"
                                    onClick={handleCreateWallet}
                                >
                                    Sign Up
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
            <Modal show={show} onHide={handleClose} className="accountInfoModel" centered>
                <Modal.Header>
                    <div className="icon success-icon">
                        <i className="mdi mdi-check"></i>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div className="content">
                            <p><b>Address: </b> {`${accountData.address}`}</p>
                            <p><b>Mnemonic:</b> {`${accountData.mnemonic}`}</p>
                            <p className="note">Note: Welcome
                                Your account have been created.
                                Please save above details for future use:</p>
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        ok
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
export default LoginAction