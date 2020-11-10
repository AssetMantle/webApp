import React, {useState} from "react";
import {Modal, Form, Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import keyUtils from "persistencejs/utilities/keys";

const PrivateKey = () => {
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
                Login with PrivateKey
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                    <p>upload private key file</p>
                    <input type="file" id="exampleInputFile"/>
                    </Form.Group>
                    <Form.Label>Enter password to decrypt keystore file</Form.Label>
                    <Form.Control
                        type="text"
                        name="password"
                        placeholder="password"
                        required={true}
                    />
                        <Button
                            variant="primary"
                            type="submit"
                        >
                            Sign In
                        </Button>

                </Form>
            </Modal.Body>

        </div>
    );
}
export default PrivateKey