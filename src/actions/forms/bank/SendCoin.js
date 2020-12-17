import React, {useState, useEffect} from "react";
import {Modal, Form, Button} from "react-bootstrap";
import SendCoinJS from "persistencejs/transaction/bank/sendCoin";
import {useTranslation} from "react-i18next";
import config from "../../../constants/config.json"
import Loader from "../../../components/loader"
import ModalCommon from "../../../components/modal"
const SendCoinQuery = new SendCoinJS(process.env.REACT_APP_ASSET_MANTLE_API)
const SendCoin = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [response, setResponse] = useState({});
    const [loader, setLoader] = useState(false)
    const handleClose = () => {
        setShow(false);
        props.setExternalComponent("");
    };
    const handleSubmit = (event) => {
        setLoader(true)
        event.preventDefault();
        const toAddress = event.target.toAddress.value;
        const denom = event.target.denom.value;
        const amountData = event.target.amount.value;
        const userTypeToken = localStorage.getItem('mnemonic');
        const sendCoinResponse = SendCoinQuery.sendCoin("test", userTypeToken, toAddress, denom, amountData, config.feesAmount, config.feesToken, config.gas, config.mode);
        sendCoinResponse.then(function (item) {
            const data = JSON.parse(JSON.stringify(item));

                    setResponse(data)
                    setShow(false);
                    setLoader(false)
        })
    };

    return (
        <div className="accountInfo">
            <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                {t("SEND_COIN")}
            </Modal.Header>
            <div>
                {loader ?
                    <Loader />
                    : ""
                }
            </div>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
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

                </Form>
            </Modal.Body>
            </Modal>
            {!(Object.keys(response).length === 0) ?
                <ModalCommon data={response} setExternal={handleClose}/>
                : ""
            }
        </div>

    );
};
export default SendCoin;
