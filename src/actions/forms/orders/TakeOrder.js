import React, {useState, useEffect} from "react";
import TakeOrderJS from "persistencejs/transaction/orders/take";
import {Form, Button, Modal} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import Loader from "../../../components/loader"
import ModalCommon from "../../../components/modal"

import config from "../../../constants/config.json"

const takeOrder = new TakeOrderJS(process.env.REACT_APP_ASSET_MANTLE_API)

const TakeOrder = (props) => {
    const {t} = useTranslation();
    const [response, setResponse] = useState({});
    const [show, setShow] = useState(true);
    const [loader, setLoader] = useState(false)

    const handleSubmit = (event) => {
        setLoader(true)
        event.preventDefault();
        const orderId = props.id;
        const FromId = event.target.FromId.value;
        const ownableAmount = event.target.ownableAmount.value;
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const takeOrderResponse = takeOrder.take(userAddress, "test", userTypeToken, FromId, ownableAmount, orderId, config.feesAmount, config.feesToken, config.gas, config.mode);
        takeOrderResponse.then(function (item) {
            const data = JSON.parse(JSON.stringify(item));
            setResponse(data)
            setShow(false);
            setLoader(false)
        })
    };
    const handleClose = () => {
        setShow(false);
        props.setExternalComponent("");
    };
    return (
        <div>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    {props.FormName}
                </Modal.Header>
                <div>
                    {loader ?
                        <Loader/>
                        : ""
                    }
                </div>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>{t("FROM_ID")}</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="FromId"
                                required={true}
                                placeholder="FromId"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{t("TAKER_OWNABLE_AMOUNT")}</Form.Label>
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

export default TakeOrder;