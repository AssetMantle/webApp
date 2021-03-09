import React, {useEffect, useState} from "react";
import sendSplitJS from "persistencejs/transaction/splits/send";
import {Form, Button, Modal} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Loader from "../../../components/loader"
import ModalCommon from "../../../components/modal"
const sendSplitQuery = new sendSplitJS(process.env.REACT_APP_ASSET_MANTLE_API)
import config from "../../../constants/config.json"

const SendSplit = (props) => {
    const { t } = useTranslation();
    const [show, setShow] = useState(true);
    const [loader, setLoader] = useState(false)
    const [response, setResponse] = useState({});

    const handleClose = () => {
        setShow(false);
        props.setExternalComponent("");
    };

    const handleSubmit = (event) => {
        setLoader(true)
        event.preventDefault();
        const IdentityID = event.target.IdentityID.value;
        const splitId = props.ownableId;
        const fromId = props.ownerId;
        const splitAmount = event.target.splitAmount.value;
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const sendSplitResponse = sendSplitQuery.send(userAddress, "test", userTypeToken, fromID, IdentityID, splitId, splitAmount, config.feesAmount, config.feesToken, config.gas, config.mode);
        sendSplitResponse.then(function (item) {
            const data = JSON.parse(JSON.stringify(item));
                    setResponse(data)
                    setShow(false);
                    setLoader(false)
        })
    };

    return (
        <div>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    {t("SEND")}
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
                            <Form.Label>{t("SEND_TO_ID")}* </Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="IdentityID"
                                required={true}
                                placeholder="IdentityID"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{t("SPLIT_AMOUNT")}* </Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="splitAmount"
                                required={true}
                                placeholder="splitAmount"
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

export default SendSplit;
