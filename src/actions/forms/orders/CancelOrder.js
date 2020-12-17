import React, {useState} from "react";
import ordersCancelJS from "persistencejs/transaction/orders/cancel";
import {Form, Button, Modal} from "react-bootstrap";
import Helpers from "../../../utilities/Helper";
import {useTranslation} from "react-i18next";
import config from "../../../constants/config.json"
import Loader from "../../../components/loader"
import ModalCommon from "../../../components/modal"
const ordersCancel = new ordersCancelJS(process.env.REACT_APP_ASSET_MANTLE_API)

const CancelOrder = (props) => {
    const Helper = new Helpers();
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [loader, setLoader] = useState(false)
    const [response, setResponse] = useState({});
    const handleSubmit = (event) => {
        setLoader(true)
        event.preventDefault();
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const cancelOrderResponse = ordersCancel.cancel(userAddress, "test", userTypeToken, props.order.value.id.value.makerID.value.idString, Helper.GetOrderID(props.order), config.feesAmount, config.feesToken, config.gas, config.mode);
        cancelOrderResponse.then(function (item) {
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
            <Modal show={show} onHide={handleClose}  centered>
            <Modal.Header closeButton>
                {t("ORDER_CANCEL")}
            </Modal.Header>
            <div>
                {loader ?
                    <Loader/>
                    : ""
                }
            </div>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <p>{t("ARE_YOU_SURE")}</p>
                    <Button variant="primary" type="submit">
                        {t("YES")}
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        {t("NO")}
                    </Button>
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

export default CancelOrder;
