import React, {useState, useCallback} from "react";
import {Modal, Form, Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import keyUtils from "persistencejs/utilities/keys";
import DownloadLink from "react-download-link";

const SignUp = ({currentState, onShowChange}) => {
    const history = useHistory();
    const [show, setShow] = useState(false);
    const [jsonName, getJsonname] = useState({});
    const [showEncrypt, setShowEncrypt] = useState(false);
    const [mnemonic, setMnemonic] = useState("");
    const [formName, setFormName] = useState("");
    const [showDownload, setShowDownload] = useState(false);

    const handleClose = useCallback(()=> {
        onShowChange(false)
    }, [onShowChange])

    const handleSubmit = e => {
        e.preventDefault()
        setShowEncrypt(true)
        setShowDownload(true)
        const password = document.getElementById("password").value
        const error = keyUtils.createRandomWallet(password)
        if (error.error != null) {
            return (<div>ERROR!!</div>)
        }

        const create = keyUtils.createStore(error.mnemonic, password)
        if (create.error != null) {
            return (<div>ERROR!!</div>)
        }
        const jsonContent = JSON.stringify(create.Response);
        getJsonname(jsonContent)
        setMnemonic(error.mnemonic)
        localStorage.setItem("address", error.address)
        localStorage.setItem("mnemonic", error.mnemonic)
    }

        const handleEncrypt = (name) =>{
            setFormName(name)
            setShowEncrypt(true)

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
                        onClick={()=>handleEncrypt("Login with PrivateKey")}
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
                    {formName}
                </Modal.Header>
                <Modal.Body>
                    {!showDownload ?
                        <Form onSubmit={handleSubmit}>
                            <Form.Label>Enter password to encrypt keystore file</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                id="password"
                                placeholder="password"
                                required={true}
                            />
                            <Button
                                variant="primary"
                                type="submit"
                            >
                                Next
                            </Button>

                        </Form>
                        : ""
                    }
                    {showDownload ?
                        <div >
                            <p><b>Please save mnemonic:</b> {mnemonic}</p>
                            <DownloadLink
                                label="Download Key File for future use"
                                filename="key.json"
                                exportFile={() =>`${jsonName}`}
                            />
                            <br/>
                            After download, please login with private key
                            <br/>
                            <Button
                                variant="primary"
                                onClick={handleClose}
                            >
                                Done
                            </Button>
                        </div>
                        :
                        ""
                    }
                </Modal.Body>
            </Modal>

        </div>
    );
}
export default SignUp