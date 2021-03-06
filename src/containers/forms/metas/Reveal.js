import React, {useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import Loader from "../../../components/loader";
import GetProperty from "../../../utilities/Helpers/getProperty";
import TransactionOptions from "../login/TransactionOptions";

const Reveal = (props) => {
    const PropertyHelper = new GetProperty();
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [loader, setLoader] = useState(false);
    const [totalDefineObject, setTotalDefineObject] = useState({});
    const [externalComponent, setExternalComponent] = useState("");
    const [dataTypeOption, setDataTypeOption] = useState("S|");
    const handleSelectChange = evt => {
        setDataTypeOption(evt.target.value);
    };
    const handleChangeMutable = (evt) => {
        const newValue = evt.target.value;
        const selectValue = document.getElementById("RevealMutableType").value;
        const checkError = PropertyHelper.DataTypeValidation(selectValue, newValue);
        PropertyHelper.showHideDataTypeError(checkError, 'RevealError');
    };
    const handleClose = () => {
        setShow(false);
        props.setExternalComponent("");
    };
    const handleSubmit = (event) => {
        setLoader(true);
        event.preventDefault();
        const MutableDataName = event.target.MutableDataName.value;
        const metaFact = dataTypeOption + MutableDataName;

        let totalData = {
            metaFact: metaFact,
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
                    {t("META_REVEAL")}
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
                            <Form.Label>{t("DATA_TYPE")}</Form.Label>
                            <Form.Control as="select" value={dataTypeOption} name="MutableDataType"
                                onChange={handleSelectChange}
                                id='RevealMutableType'
                                required={true}>
                                <option value="S|">{t("STRING")}</option>
                                <option value="D|">{t("DECIMAL")}</option>
                                <option value="H|">{t("HEIGHT")}</option>
                                <option value="I|">{t("ID_TYPE")}</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Data Name</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="MutableDataName"
                                required={true}
                                id="RevealMutable"
                                placeholder="Data Name"
                                onChange={(evt) => {
                                    handleChangeMutable(evt);
                                }}
                                disabled={false}
                            />
                        </Form.Group>
                        <Form.Text id="RevealError" className="text-muted none">
                            {t("DATA_TYPE_ERROR")}
                        </Form.Text>
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
                        totalDefineObject={totalDefineObject} TransactionName={'reveal'}
                        ActionName={props.ActionName}
                        handleClose={handleClose}
                        setShow={setShow}
                    /> :
                    null
            }
        </div>
    );
};

export default Reveal;
