import React, {useState, useEffect} from "react";
import {Modal, Form, Button} from "react-bootstrap";
import SendCoinJS from "persistencejs/transaction/bank/sendCoin";

const SendCoinQuery = new SendCoinJS(process.env.REACT_APP_ASSET_MANTLE_API)
const SendCoin = () => {
    const [response, setResponse] = useState({});
    const handleSubmit = (event) => {
        event.preventDefault();
        const denom = event.target.denom.value;
        const amountData = event.target.amount.value;
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const sendCoinResponse = SendCoinQuery.sendCoin("test", userTypeToken, userAddress, denom, amountData, 25, "stake", 200000, "block");
        sendCoinResponse.then(function (item) {
            const data = JSON.parse(JSON.stringify(item));
            setResponse(data)
            console.log(data, "result WrapResponse")
        })
        event.preventDefault();
        event.target.reset();
    };

    return (
        <div className="accountInfo">
            <Modal.Header closeButton>
                Send Coin
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Denom </Form.Label>
                        <Form.Control
                            type="text"
                            className=""
                            name="denom"
                            required={true}
                            placeholder="Denom"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                            type="text"
                            name="amount"
                            placeholder="Enter Amount"
                            required={true}
                        />
                    </Form.Group>
                    <div className="submitButtonSection">
                        <Button
                            variant="primary"
                            type="submit"
                        >
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
export default SendCoin;
