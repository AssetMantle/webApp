import React, {useState, useEffect} from "react";
import identitiesProvisionJS from "persistencejs/transaction/identity/provision";
import InputField from '../../components/inputField'
import {Form, Button, Modal} from "react-bootstrap";
import axios from "axios";


const Faucet = (props) => {
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        window.location.reload();
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const userAddress = localStorage.getItem('address');
        axios.post(process.env.REACT_APP_FAUCET_SERVER + "/faucetRequest", {address: userAddress})
            .then(response => console.log(response)).catch(err => console.log(err))
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
                            name="myAddress"
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

export default Faucet;
