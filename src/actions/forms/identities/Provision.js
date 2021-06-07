import React, {useState} from "react";
import identitiesProvisionJS from "persistencejs/transaction/identity/provision";
import {Form, Button, Modal} from "react-bootstrap";
import InputField from "../../../components/inputField";
import {useTranslation} from "react-i18next";
import config from "../../../constants/config.json";
import Loader from "../../../components/loader";
import ModalCommon from "../../../components/modal";

const identitiesProvision = new identitiesProvisionJS(process.env.REACT_APP_ASSET_MANTLE_API);

const Provision = (props) => {

    const [response, setResponse] = useState({});
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [loader, setLoader] = useState(false);
    const fromID = localStorage.getItem('fromID');
    const handleSubmit = (event) => {
        setLoader(true);
        event.preventDefault();
        const toAddress = event.target.toAddress.value;
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const provisionResponse = identitiesProvision.provision(userAddress, "test", userTypeToken, fromID, toAddress, config.feesAmount, config.feesToken, config.gas, config.mode);
        provisionResponse.then(function (item) {
            const data = JSON.parse(JSON.stringify(item));
            setResponse(data);
            setShow(false);
            setLoader(false);
        });
    };
    const handleClose = () => {
        setShow(false);
        props.setExternalComponent("");
    };
    return (
        <div>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    {t("PROVISION")}
                </Modal.Header>
                <div>
                    {loader ?
                        <Loader />
                        : ""
                    }
                </div>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <InputField
                            type="text"
                            className=""
                            name="toAddress"
                            required={true}
                            placeholder="Input Address"
                            label="New Address to Provision"
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

export default Provision;
