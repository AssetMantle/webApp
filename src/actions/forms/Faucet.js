import React, {useState, useEffect} from "react";
import identitiesProvisionJS from "persistencejs/transaction/identity/provision";
import InputField from '../../components/inputField'
import {FAUCET_LIST_LIMIT, FaucetList} from '../../constants/faucet'
import {Form, Button, Modal} from "react-bootstrap";


const Faucet = (props) => {
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        window.location.reload();
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const myAddress = event.target.myAddress.value;
        const userAddress = localStorage.getItem('address');
        fetch(process.env.REACT_APP_ASSET_MANTLE_API + "/auth/accounts/" + userAddress)
            .then((response) => response.json())
            .then(function (accountResponse) {
                if (FaucetList.length < FAUCET_LIST_LIMIT && !FaucetList.includes(userAddress) && accountResponse.result.value.address == "") {
                    FaucetList.push(userAddress)
                    console.log(userAddress, myAddress, "ADDED TO LIST", FAUCET_LIST_LIMIT, FaucetList)
                } else {
                    console.log(userAddress, myAddress, "NOT ADDED", FAUCET_LIST_LIMIT, FaucetList)
                }

            });
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
