import React, {useState, useEffect} from "react";
import ordersCancelJS from "persistencejs/transaction/orders/cancel";
import {Form, Button, Modal} from "react-bootstrap";
import helper from "../../utilities/helper";
import Helpers from "../../utilities/helper";

const ordersCancel = new ordersCancelJS(process.env.REACT_APP_ASSET_MANTLE_API)

const CancelOrder = (props) => {
    const Helper = new Helpers();

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        window.location.reload();
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // const toAddress = event.target.toAddress.value;
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        console.log(props.order)
        const cancelOrderResponse = ordersCancel.cancel(userAddress, "test", userTypeToken, props.order.value.id.value.makerID.value.idString, Helper.GetOrderID(props.order), 25, "stake", 200000, "block");
        console.log(cancelOrderResponse, "result provision")
    };

    return (
        <div className="accountInfo">

            <Modal.Header closeButton>
                Cancel
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="sure"
                                    name="name"
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

export default CancelOrder;
