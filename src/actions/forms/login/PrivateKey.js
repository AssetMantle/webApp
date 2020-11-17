import React, {useState} from "react";
import {Modal, Form, Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import keyUtils from "persistencejs/utilities/keys";

const PrivateKey = () => {
    const history = useHistory();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [files, setFiles] = useState("");
    const handleSubmit = e => {
        e.preventDefault()
        const password = document.getElementById("password").value
        const fileReader = new FileReader();
        fileReader.readAsText(e.target.uploadFile.files[0], "UTF-8");
        fileReader.onload = e => {
            const res = JSON.parse(e.target.result)
            setFiles(e.target.result);
            const error = keyUtils.decryptStore(res, password)
            if (error.error != null) {
                alert("Incorrect password.")
                return (<div>ERROR!!</div>)
            }else{
                alert("You have been logged in.")
                const wallet = keyUtils.getWallet(error.mnemonic)
                localStorage.setItem("address", wallet.address)
                localStorage.setItem("mnemonic", error.mnemonic)
                 history.push('/ActionsSwitcher');
            }
        };
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
                        <input type="file" name="uploadFile" accept=".json" required  />
                    </Form.Group>
                    <Form.Label>Enter password to decrypt keystore file</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        id="password"
                        placeholder="password"
                        required={true}
                    />
                    <div className="submitButtonSection">
                        <Button
                            variant="primary"
                            type="submit"
                        >
                            Sign In
                        </Button>
                    </div>
                </Form>
            </Modal.Body>

        </div>
    );
}
export default PrivateKey