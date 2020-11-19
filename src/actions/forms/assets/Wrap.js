import React, {useState, useEffect} from "react";
import WrapJS from "persistencejs/transaction/splits/wrap";
import {Form, Button, Modal} from "react-bootstrap";
import { useHistory } from "react-router-dom";
const WrapQuery = new WrapJS(process.env.REACT_APP_ASSET_MANTLE_API)

const Wrap = (props) => {
    const history = useHistory();
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const FromId = event.target.FromId.value;
        const CoinDemon = event.target.CoinDemon.value;
        const CoinAmount = event.target.CoinAmount.value;
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const WrapResponse = WrapQuery.wrap(userAddress, "test", userTypeToken, FromId, CoinDemon, CoinAmount, 25, "stake", 200000, "block");
        console.log(WrapResponse, "result WrapResponse")
    };

    return (
        <div className="accountInfo">

            <Modal.Header closeButton>
                {props.FormName}
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>FromId </Form.Label>
                        <Form.Control
                            type="text"
                            className=""
                            name="FromId"
                            required={true}
                            placeholder="FromId"
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Coin Demon </Form.Label>
                        <Form.Control
                            type="text"
                            className=""
                            name="CoinDemon"
                            required={true}
                            placeholder="Coin Demon"
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Coin Amount </Form.Label>
                        <Form.Control
                            type="text"
                            className=""
                            name="CoinAmount"
                            required={true}
                            placeholder="Coin Amount"
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

export default Wrap;
