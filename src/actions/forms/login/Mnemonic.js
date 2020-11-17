import React, {useState} from "react";
import {Modal, Form, Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import keyUtils from "persistencejs/utilities/keys";

const LoginMnemonic = () => {
    const history = useHistory();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
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

    return (
            <div className="accountInfo">
                <Modal.Header closeButton>
                    Login with mnemonic
                </Modal.Header>
                <Modal.Body>
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
                        </div>
                    </Form>
                </Modal.Body>
                <Modal show={show} onHide={handleClose}  centered>
                    <Modal.Body>

                    </Modal.Body>
                </Modal>
            </div>
    );
}
export default LoginMnemonic