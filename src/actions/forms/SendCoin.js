import React, {useState, useEffect} from "react";
import {Modal, Form, Button} from "react-bootstrap";
import SendCoinJS from "persistencejs/transaction/bank/sendCoin";
import {useTranslation} from "react-i18next";
import { pollTxHash } from '../../utilities/Helper'
const SendCoinQuery = new SendCoinJS(process.env.REACT_APP_ASSET_MANTLE_API)
const SendCoin = () => {
    const {t} = useTranslation();
    const url = process.env.REACT_APP_ASSET_MANTLE_API;
    const [response, setResponse] = useState({});
    const handleSubmit = (event) => {

        event.preventDefault();
        const toAddress = event.target.toAddress.value;
        const denom = event.target.denom.value;
        const amountData = event.target.amount.value;
        const userTypeToken = localStorage.getItem('mnemonic');
        const sendCoinResponse = SendCoinQuery.sendCoin("test", userTypeToken, toAddress, denom, amountData, 25, "stake", 200000, "block");
        sendCoinResponse.then(function (item) {
            const data = JSON.parse(JSON.stringify(item));
            if(data.txhash){
                let queryHashResponse =  pollTxHash(url, data.txhash);
                queryHashResponse.then(function (queryItem) {
                    const queryData = JSON.parse(queryItem);
                    setResponse(queryData)
                    console.log(queryData, "queryHashResponse")
                })
            }
        })
        event.preventDefault();
        event.target.reset();
    };

    return (
        <div className="accountInfo">
            <Modal.Header closeButton>
                {t("SEND_COIN")}
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>{t("TO_ADDRESS")}</Form.Label>
                        <Form.Control
                            type="text"
                            className=""
                            name="toAddress"
                            required={true}
                            placeholder="toAddress"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>{t("DENOM")} </Form.Label>
                        <Form.Control
                            type="text"
                            className=""
                            name="denom"
                            required={true}
                            placeholder="Denom"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>{t("AMOUNT")}</Form.Label>
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
                            {t("SUBMIT")}
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
