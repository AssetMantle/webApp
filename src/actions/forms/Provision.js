import React, {useState, useEffect} from "react";
import Identities from "persistencejs/transaction/identity/provision";
import InputField from '../../components/inputField'
import {Form, Button, Modal} from "react-bootstrap";

const Provision = (props) => {
    const [show, setShow] = useState(false);
    const [responseData, setResponseData] = useState("");
    const [errorData, setErrorData] = useState("");
    const [assetItemsList, setAssetItemsList] = useState([]);
    const handleClose = () => {
        setShow(false);
        window.location.reload();
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const toAddress = event.target.toAddress.value;
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const provisionResponse = Identities.provision(userAddress, "test", userTypeToken, props.identityId, toAddress, 25, "stake", 200000, "block");
        console.log(provisionResponse, "result provision")
    };

    return (
        <div className="accountInfo">

            <Modal.Header closeButton>
                Nub
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>New Address to Provision</Form.Label>
                        <Form.Control
                            type="text"
                            className=""
                            name="toAddress"
                            required={true}
                            placeholder="Input Address"
                        />
                    </Form.Group>
                    <div className="submitButtonSection">
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </div>
    );
};

export default Provision;
