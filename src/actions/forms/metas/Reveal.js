import React, {useState, useEffect} from "react";
import RevealMetaJS from "persistencejs/transaction/meta/reveal";
import {Form, Button, Modal} from "react-bootstrap";
import InputField from "../../../components/inputField";
import {useTranslation} from "react-i18next";
import Loader from "../../../components/loader"
import ModalCommon from "../../../components/modal"
import config from "../../../constants/config.json"

const RevealMeta = new RevealMetaJS(process.env.REACT_APP_ASSET_MANTLE_API)

const Reveal = (props) => {
    const url = process.env.REACT_APP_ASSET_MANTLE_API;
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [response, setResponse] = useState({});
    const [loader, setLoader] = useState(false)
    const [dataTypeOption, setDataTypeOption] = useState("S|");
    const handleSelectChange = evt => {
        setDataTypeOption(evt.target.value);
    }
    const handleClose = () => {
        setShow(false);
        props.setExternalComponent("");
    };
    const handleSubmit = (event) => {
        setLoader(true)
        event.preventDefault();
        const MutableDataName = event.target.MutableDataName.value;
        const metaFact = dataTypeOption + MutableDataName
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const RevealMetaResponse = RevealMeta.reveal(userAddress, "test", userTypeToken, metaFact, config.feesAmount, config.feesToken, config.gas, config.mode);
        RevealMetaResponse.then(function (item) {
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
                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>{t("DATA_TYPE")}</Form.Label>
                        <Form.Control as="select" value={dataTypeOption} name="MutableDataType"
                                      onChange={handleSelectChange}
                                      required={true}>
                            <option value="S|">{t("STRING")}</option>
                            <option value="D|">{t("DECIMAL")}</option>
                            <option value="H|">{t("HEIGHT")}</option>
                            <option value="I|">{t("ID_TYPE")}</option>
                        </Form.Control>
                    </Form.Group>
                    <InputField
                        type="text"
                        className=""
                        name="MutableDataName"
                        required={true}
                        placeholder="Data Name"
                        label="Data Name "
                        disabled={false}
                    />
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
