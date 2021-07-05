import React, {useState} from "react";
import {Modal, Form, Button} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import CommonKeystore from '../../../actions/forms/login/CommonKeystore';
import Loader from "../../../components/loader";
const SendCoin = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [loader, setLoader] = useState(false);
    const [externalComponent, setExternalComponent] = useState("");
    const [totalDefineObject, setTotalDefineObject] = useState({});
    const handleClose = () => {
        setShow(false);
        props.setExternalComponent("");
    };
    const handleSubmit = (event) => {
        setLoader(true);
        event.preventDefault();
        const toAddress = event.target.toAddress.value;
        const denom = event.target.denom.value;
        const amountData = event.target.amount.value;
        let totalData = {
            amountData:amountData,
            denom:denom,
            toAddress:toAddress
        };
        setTotalDefineObject(totalData);
        setExternalComponent('Keystore');
        setShow(false);
        setLoader(false);
    };

    return (
        <div>
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
                            <Form.Label>{t("TO_ADDRESS")}*</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="toAddress"
                                required={true}
                                placeholder="toAddress"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{t("DENOM")}* </Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="denom"
                                required={true}
                                placeholder="Denom"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{t("AMOUNT")}*</Form.Label>
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
            <div>
                {
                    externalComponent === 'Keystore' ?
                        <CommonKeystore
                            setExternalComponent={setExternalComponent}
                            totalDefineObject={totalDefineObject}
                            TransactionName={'sendcoin'}
                            handleClose={handleClose}
                        /> :
                        null
                }
            </div>
        </div>

    );
};
export default SendCoin;
