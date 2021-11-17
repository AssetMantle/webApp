import React, {useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import Loader from "../../../components/loader";
import TransactionOptions from "../login/TransactionOptions";
import config from "../../../config";
import helper from "../../../utilities/helper";

const bigdecimal = require("bigdecimal");
const bigDecimal = require('js-big-decimal');
const MakeOrder = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [loader, setLoader] = useState(false);
    const [amount, setAmount] = useState('');

    const [totalDefineObject, setTotalDefineObject] = useState({});
    const [externalComponent, setExternalComponent] = useState("");

    const handleClose = () => {
        setShow(false);
        props.setExternalComponent("");
    };

    const handleChangeExchangeRate = (evt) => {
        let rex = /^\d*\.?\d{0,6}$/;
        if (rex.test(evt.target.value)) {
            let inputValue = new bigdecimal.BigDecimal(((evt.target.value * 1) * config.denomValue).toString());
            let biggestNumber = new bigdecimal.BigDecimal(1000000000000000000);
            let newValue = inputValue.multiply(biggestNumber);
            const value = bigDecimal.round(newValue, 18);
            document.getElementById("exchangeRateSplit").value = value;
            document.getElementById("exchangeRateSplit").innerHTML = value;
            setAmount(evt.target.value);

        }else {
            return false;
        }
    };

    const handleFormSubmit = (event) => {
        setLoader(false);
        event.preventDefault();
        const assetId = props.ownableId;
        const FromId = event.target.FromId.value;
        const TakerOwnableId = event.target.TakerOwnableId.value;
        const Makersplit = event.target.Makersplit.value;
        const ExpiresIn = event.target.expiresInD.value;
        let price = document.getElementById('exchangeRateSplit').value;
        let mutableValues = "";
        let immutableValues = "";
        let mutableMetaValues = "";
        let immutableMetaValues = "";

        const name = props.asset.totalData && props.asset.totalData.name;
        const description = props.asset.totalData && props.asset.totalData.description;
        const category = props.asset.totalData && props.asset.totalData.category;
        const style = props.asset.totalData && props.asset.totalData.style;
        let staticMutables = `propertyName:S|propertyValue`;

        let staticImmutableMeta = `category:S|${category},name:S|${name},description:S|${description}`;
        let staticImMutables = `style:S|${style},type:S|order`;

        mutableValues = staticMutables;

        mutableMetaValues = `exchangeRate:D|${price},takerID:I|`;


        immutableValues = `${staticImMutables}`;

        immutableMetaValues = staticImmutableMeta;

        let totalData = {
            fromID: FromId,
            classificationId: config.orderClassificationID,
            makerOwnableID: assetId,
            TakerOwnableId: TakerOwnableId,
            ExpiresIn: ExpiresIn,
            Makersplit: Makersplit,
            mutableValues: mutableValues,
            immutableValues: immutableValues,
            mutableMetaValues: mutableMetaValues,
            immutableMetaValues: immutableMetaValues,
        };
        setTotalDefineObject(totalData);
        setExternalComponent('Keystore');
        setShow(false);
        setLoader(false);
    };


    return (
        <div>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton>
                    {t("MAKE_ORDER")}
                </Modal.Header>
                <div>
                    {loader ?
                        <Loader/>
                        : ""
                    }
                </div>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group>
                            <Form.Label>{t("FROM_ID")}*</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="FromId"
                                required={true}
                                placeholder={t("FROM_ID")}
                                defaultValue={props.ownerId}
                                readOnly
                            />
                        </Form.Group>

                        <Form.Group className="hidden">
                            <Form.Label>{t("TAKER_OWNABLE_SPLIT")}*</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="TakerOwnableId"
                                required={true}
                                defaultValue="umantle"
                                placeholder={t("TAKER_OWNABLE_SPLIT")}
                            />
                        </Form.Group>
                        <Form.Group className="hidden">
                            <Form.Label>{t("MAKER_SPLIT")}*</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="Makersplit"
                                required={true}
                                defaultValue="0.000000000000000001"
                                placeholder={t("MAKER_SPLIT")}
                            />
                        </Form.Group>
                        <Form.Group className="hidden">
                            <Form.Label>{t("EXPIRES_IN")}*</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="expiresInD"
                                defaultValue="100000000"
                                required={true}
                                placeholder={t("EXPIRES_IN")}
                            />
                        </Form.Group>

                        <Form.Group>

                            <Form.Label>{t("PRICE")}*</Form.Label>
                            <Form.Control
                                type="number"
                                min={0}
                                value={amount}
                                step="any"
                                name="price"
                                required={true}
                                onKeyPress={helper.inputAmountValidation}
                                onChange={handleChangeExchangeRate}
                                placeholder={t("Price")}
                            />
                            <Form.Text id="exchangeRateSplit"
                                className="text-muted hidden">

                            </Form.Text>
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
                    <TransactionOptions
                        setExternalComponent={setExternalComponent}
                        totalDefineObject={totalDefineObject} TransactionName={'make order'}
                        ActionName={props.ActionName}
                        handleClose={handleClose}
                        setShow={setShow}
                    /> :
                    null
            }
        </div>
    );
};

export default MakeOrder;
