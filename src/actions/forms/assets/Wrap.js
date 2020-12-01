import React, {useState, useEffect} from "react";
import WrapJS from "persistencejs/transaction/splits/wrap";
import {Form, Button, Modal} from "react-bootstrap";
import {useTranslation} from "react-i18next";

const WrapQuery = new WrapJS(process.env.REACT_APP_ASSET_MANTLE_API)

const Wrap = (props) => {
    const {t} = useTranslation();
    const [response, setResponse] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();
        const FromId = event.target.FromId.value;
        const CoinDenom = event.target.CoinDenom.value;
        const CoinAmount = event.target.CoinAmount.value;
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const WrapResponse = WrapQuery.wrap(userAddress, "test", userTypeToken, FromId, CoinAmount + CoinDenom, 25, "stake", 200000, "block");
        WrapResponse.then(function (item) {
            const data = JSON.parse(JSON.stringify(item));
            setResponse(data)
            window.location.reload();
            console.log(data, "result WrapResponse")
        })
    };

    return (
        <div className="accountInfo">

            <Modal.Header closeButton>
                {props.FormName}
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>{t("FROM_ID")} </Form.Label>
                        <Form.Control
                            type="text"
                            className=""
                            name="FromId"
                            required={true}
                            placeholder="FromId"
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>{t("COIN_DENOM")} </Form.Label>
                        <Form.Control
                            type="text"
                            className=""
                            name="CoinDenom"
                            required={true}
                            placeholder="Coin Denom"
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>{t("COIN_AMOUNT")}</Form.Label>
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

export default Wrap;
