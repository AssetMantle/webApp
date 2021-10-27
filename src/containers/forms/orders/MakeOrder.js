import React, {useState} from "react";
import {Form, Button, Modal} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import Loader from "../../../components/loader";
import TransactionOptions from "../login/TransactionOptions";
import base64url from "base64url";
const MakeOrder = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [loader, setLoader] = useState(false);

    const [totalDefineObject, setTotalDefineObject] = useState({});
    const [externalComponent, setExternalComponent] = useState("");

    const handleClose = () => {
        setShow(false);
        props.setExternalComponent("");
    };


    const handleFormSubmit = (event) => {
        setLoader(false);
        event.preventDefault();
        const assetId = props.ownableId;
        const FromId = event.target.FromId.value;
        const TakerOwnableId = event.target.TakerOwnableId.value;
        const Makersplit = event.target.Makersplit.value;
        const ExpiresIn = event.target.expiresInD.value;
        const price = event.target.price.value;
        let mutableValues = "";
        let immutableValues = "";
        let mutableMetaValues = "";
        let immutableMetaValues = "";

        const name = props.asset.totalData && props.asset.totalData.name;
        const description = props.asset.totalData && props.asset.totalData.description;
        const category = props.asset.totalData && props.asset.totalData.category;
        const style = props.asset.totalData && props.asset.totalData.style;
        // const typeOption = props.asset.totalData && props.asset.totalData.type;
        console.log(base64url.decode(category), "categpru");
        let staticMutables = `propertyName:S|propertyValue`;

        let staticImmutableMeta = `category:S|${category},name:S|${name},description:S|${description}`;
        let staticImMutables = `style:S|${style},type:S|order`;

        mutableValues = staticMutables;

        mutableMetaValues = `exchangeRate:D|${price},takerID:I|`;


        immutableValues = `${staticImMutables}`;

        immutableMetaValues = staticImmutableMeta;

        let totalData = {
            fromID:FromId,
            classificationId:'test.O-qPtlWEqmo9WQmZgwfguoj0F0A=',
            makerOwnableID:assetId,
            TakerOwnableId:TakerOwnableId,
            ExpiresIn:ExpiresIn,
            Makersplit:Makersplit,
            mutableValues:mutableValues,
            immutableValues:immutableValues,
            mutableMetaValues:mutableMetaValues,
            immutableMetaValues:immutableMetaValues,
        };
        console.log(totalData, "totaldata");
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
                                value={props.ownerId}
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
                                value="umantle"
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
                                value="0.000000000000000001"
                                placeholder={t("MAKER_SPLIT")}
                            />
                        </Form.Group>
                        <Form.Group className="hidden">
                            <Form.Label>{t("EXPIRES_IN")}*</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="expiresInD"
                                value="100000000"
                                required={true}
                                placeholder={t("EXPIRES_IN")}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>{t("PRICE")}*</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="price"
                                required={true}
                                placeholder={t("Price")}
                            />
                        </Form.Group>

                        {/*{errorMessage !== "" ?*/}
                        {/*    <span className="error-response">{errorMessage}</span>*/}
                        {/*    : ""*/}

                        {/*}*/}
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
