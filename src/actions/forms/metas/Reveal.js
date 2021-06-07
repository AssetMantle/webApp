import React, {useState} from "react";
import RevealMetaJS from "persistencejs/transaction/meta/reveal";
import {Form, Button, Modal} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import Loader from "../../../components/loader";
import ModalCommon from "../../../components/modal";
import config from "../../../constants/config.json";
import GetProperty from "../../../utilities/Helpers/getProperty";

const RevealMeta = new RevealMetaJS(process.env.REACT_APP_ASSET_MANTLE_API);

const Reveal = (props) => {
    const PropertyHelper = new GetProperty();
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [response, setResponse] = useState({});
    const [loader, setLoader] = useState(false);
    const [dataTypeOption, setDataTypeOption] = useState("S|");
    const handleSelectChange = evt => {
        setDataTypeOption(evt.target.value);
    };
    const handleChangeMutable = (evt) => {
        const newValue = evt.target.value;
        const selectValue = document.getElementById("RevealMutableType" ).value;
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
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const RevealMetaResponse = RevealMeta.reveal(userAddress, "test", userTypeToken, metaFact, config.feesAmount, config.feesToken, config.gas, config.mode);
        RevealMetaResponse.then(function (item) {
            const data = JSON.parse(JSON.stringify(item));
            setResponse(data);
            setShow(false);
            setLoader(false);
        });
    };

    return (
        <div>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    {t("META_REVEAL")}
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
            {!(Object.keys(response).length === 0) ?
                <ModalCommon data={response} setExternal={handleClose}/>
                : ""
            }
        </div>
    );
};

export default Reveal;
