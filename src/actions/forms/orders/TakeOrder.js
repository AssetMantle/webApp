import React, {useState, useEffect} from "react";
import TakeOrderJS from "persistencejs/transaction/orders/take";
import {Form, Button, Modal} from "react-bootstrap";

const takeOrder = new TakeOrderJS(process.env.REACT_APP_ASSET_MANTLE_API)

const TakeOrder = (props) => {
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        window.location.reload();
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const orderId = props.id;
        const FromId = event.target.FromId.value;
        const ownableAmount = event.target.ownableAmount.value;
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const takeOrderResponse = takeOrder.take(userAddress, "test", userTypeToken, FromId, ownableAmount, orderId,25, "stake", 200000, "block");
        console.log(takeOrderResponse, "result takeOrderResponse")
    };

    return (
        <div className="accountInfo">
            <Modal.Header closeButton>
                {props.FormName}
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>FromId</Form.Label>
                        <Form.Control
                            type="text"
                            className=""
                            name="FromId"
                            required={true}
                            placeholder="FromId"
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Taker Ownable Amount</Form.Label>
                        <Form.Control
                            type="text"
                            className=""
                            name="ownableAmount"
                            required={true}
                            placeholder="Taker Ownable Amount"
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

export default TakeOrder;