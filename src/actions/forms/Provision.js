import React, {useState, useEffect} from "react";
import identitiesProvisionJS from "persistencejs/transaction/identity/provision";
import {Form, Button, Modal} from "react-bootstrap";

const identitiesProvision = new identitiesProvisionJS(process.env.REACT_APP_ASSET_MANTLE_API)

const Provision = (props) => {
    const [show, setShow] = useState(false);
    const [response, setResponse] = useState({});
    const handleClose = () => {
        setShow(false);
        window.location.reload();
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const toAddress = event.target.toAddress.value;
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const provisionResponse = identitiesProvision.provision(userAddress, "test", userTypeToken, props.identityId, toAddress, 25, "stake", 200000, "block");
        console.log(provisionResponse, "result provision")
        provisionResponse.then(function (item) {
            const data = JSON.parse(JSON.stringify(item));
            setResponse(data)
            console.log(data, "result define Identity")
        })
    };

    return (
        <div className="accountInfo">

            <Modal.Header closeButton>
                Provision
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
                    {response.code ?
                        <p> {response.raw_log}</p>
                        :
                        <p> {response.txhash}</p>
                    }
                </Form>
            </Modal.Body>
        </div>
    );
};

export default Provision;
