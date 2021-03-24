import React, {useState, useEffect} from "react";
import identitiesUnprovisionJS from "persistencejs/transaction/identity/unprovision";
import {Form, Button, Modal} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import config from "../../../constants/config.json"
import Loader from "../../../components/loader"
import ModalCommon from "../../../components/modal"
const identitiesUnprovision = new identitiesUnprovisionJS(process.env.REACT_APP_ASSET_MANTLE_API)

const UnProvision = (props) => {
    const [response, setResponse] = useState({});
    const [show, setShow] = useState(true);
    const [loader, setLoader] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState("");
    const [provisionAddressList, setProvisionAddressList] = useState([]);
    const {t} = useTranslation();
    const fromID = localStorage.getItem('fromID');
    useEffect(() => {
        const provisionedAddressList = props.identityIdList.value.provisionedAddressList;
        if(provisionedAddressList !== null) {
            provisionedAddressList.map((address) => {
                setProvisionAddressList((provisionAddressList) => [
                    ...provisionAddressList,
                    address,
                ]);
            })
        }
    }, []);
    const handleClose = () => {
        setShow(false);
        props.setExternalComponent("");
    };
    const handleSubmit = (event) => {
        setLoader(true)
        event.preventDefault();
        const selectValue = event.target.selectAddress.value;
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const UnProvisionResponse = identitiesUnprovision.unprovision(userAddress, "test", userTypeToken, fromID, selectValue, config.feesAmount, config.feesToken, config.gas, config.mode);
        UnProvisionResponse.then(function (item) {
            const data = JSON.parse(JSON.stringify(item));
            setResponse(data)
            setShow(false);
            setLoader(false)
        })
    };
    const handleSelectChange = (evt) => {
        setSelectedAddress(evt.target.value);
    };
    return (
        <div>
            <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                {t("UN_PROVISION")}
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
                        <Form.Label>{t("ADDRESS_TO_PROVISION")}*</Form.Label>
                        <Form.Control
                            as="select"
                            name="selectAddress"
                            value={selectedAddress}
                            onChange={handleSelectChange}
                        >
                            {provisionAddressList.map((address, index) => {
                                return (
                                    <option key={index} value={address}>
                                        {address}
                                    </option>
                                );
                            })}
                        </Form.Control>
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

export default UnProvision;
