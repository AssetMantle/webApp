import React, {useState, useEffect} from "react";
import {Form, Button, Modal} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import Loader from "../../../components/loader";
import CommonKeystore from '../login/CommonKeystore';


const TakeOrder = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [loader, setLoader] = useState(false);
    const [fromID, setFromID] = useState("");
    const [totalDefineObject, setTotalDefineObject] = useState({});
    const [externalComponent, setExternalComponent] = useState("");

    useEffect(()=>{
        let fromIDValue = localStorage.getItem('identityId');
        setFromID(fromIDValue);
    },[]);
    const handleSubmit = (event) => {
        setLoader(true);
        event.preventDefault();
        const orderId = props.id;
        const FromId = event.target.FromId.value;
        const ownableAmount = event.target.ownableAmount.value;

        let totalData = {
            fromID:FromId,
            ownableAmount:ownableAmount,
            orderId:orderId,
        };
        setTotalDefineObject(totalData);
        setExternalComponent('Keystore');
        setShow(false);
        setLoader(false);
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
                            <Form.Label>{t("FROM_ID")}*</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="FromId"
                                required={true}
                                defaultValue={fromID !== null ? fromID : ""}
                                placeholder={t("FROM_ID")}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{t("TAKER_OWNABLE_AMOUNT")}*</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="ownableAmount"
                                required={true}
                                placeholder={t("TAKER_OWNABLE_AMOUNT")}
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
            {
                externalComponent === 'Keystore' ?
                    <CommonKeystore
                        setExternalComponent={setExternalComponent}
                        totalDefineObject={totalDefineObject} TransactionName={'take order'}
                        ActionName={props.ActionName}
                        handleClose={handleClose}
                    /> :
                    null
            }
        </div>
    );
};

export default TakeOrder;
