import React, {useState} from "react";
import ordersCancelJS from "persistencejs/transaction/orders/cancel";
import {Form, Button, Modal} from "react-bootstrap";
import Helpers from "../../../utilities/Helper";

const ordersCancel = new ordersCancelJS(process.env.REACT_APP_ASSET_MANTLE_API)

const CancelOrder = (props) => {
    const Helper = new Helpers();
    const [response, setResponse] = useState({});
    const handleSubmit = (event) => {
        event.preventDefault();
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const cancelOrderResponse = ordersCancel.cancel(userAddress, "test", userTypeToken, props.order.value.id.value.makerID.value.idString, Helper.GetOrderID(props.order), 25, "stake", 200000, "block");
        cancelOrderResponse.then(function (item) {
            const data = JSON.parse(JSON.stringify(item));
            setResponse(data)
            console.log(data, "result provision")
        })
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

export default CancelOrder;
