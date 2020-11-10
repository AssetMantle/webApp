import React, {useState} from "react";
import {Modal, Form, Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import keyUtils from "persistencejs/utilities/keys";

const SignUp = () => {
    const history = useHistory();
    const [show, setShow] = useState(false);

    const [showEncrypt, setShowEncrypt] = useState(false);
    const [showDownload, setShowDownload] = useState(false);
    const handleClose = () =>{
        setShowDownload(false)
        setShowEncrypt(false)
        setShow(false);
    }
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
        const handleEncrypt = () =>{
            setShowEncrypt(true)
        }
        const handleEncryptFinal = () =>{
            setShowDownload(true)
        }
    return (
        <div className="accountInfo">
            <Modal.Header closeButton>
                Login with PrivateKey
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                     <p>choose how you store your key</p>
                    <Button
                        variant="primary"
                        onClick={handleEncrypt}
                    >
                        mnemonic/privatekey
                    </Button>
                    <Button
                        variant="primary"
                    >
                        store in ledger
                    </Button>

                </Form>
            </Modal.Body>
            <Modal
                show={showEncrypt}
                onHide={handleClose}
                centered
            >
                <Modal.Header closeButton>
                    Login with PrivateKey
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                                <Form.Label>Enter password to encrypt keystore file</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="password"
                                    placeholder="password"
                                    required={true}
                                />
                                <Button
                                    variant="primary"
                                    type="submit"
                                    onClick={handleEncryptFinal}
                                >
                                    Next
                                </Button>

                    </Form>
                </Modal.Body>
            </Modal>
            <Modal
                show={showDownload}
                onHide={handleClose}
                centered
            >
                <Modal.Header closeButton>
                    Login with PrivateKey
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>

                                <p>download file</p>
                                <a href="#" download>keystore.txt</a>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    onClick={handleEncryptFinal}
                                >
                                    SignIn
                                </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
export default SignUp