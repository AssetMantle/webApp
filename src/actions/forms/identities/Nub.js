import React, {useState, useEffect} from "react";
import identitiesNubJS from "persistencejs/transaction/identity/nub";
import {Form, Button, Modal} from "react-bootstrap";
import InputField from "../../../components/inputField"
import {useTranslation} from "react-i18next";
import config from "../../../constants/config.json"
import Loader from "../../../components/loader"
import ModalCommon from "../../../components/modal"

const identitiesNub = new identitiesNubJS(process.env.REACT_APP_ASSET_MANTLE_API)

const Nub = (props) => {
    const [response, setResponse] = useState({});
    const [loader, setLoader] = useState(false)
    const [showIdentity, setShowIdentity] = useState(true);
    const {t} = useTranslation();
    const handleSubmit = (event) => {
        event.preventDefault();
        setLoader(true)
        const nubId = event.target.nubID.value;
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const nubResponse = identitiesNub.nub(userAddress, "test", userTypeToken, nubId, config.feesAmount, config.feesToken, config.gas, config.mode);
        nubResponse.then(function (item) {
            const data = JSON.parse(JSON.stringify(item));
            setLoader(false)
            setShowIdentity(false);
            setResponse(data)
        })
    };

    const handleClose = () => {
        setShowIdentity(false);
        props.setExternalComponent("");
    };

    return (
        <div>

            <Modal
                show={showIdentity}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
            >
                <div>
                    {loader ?
                        <Loader/>
                        : ""
                    }
                </div>
                <Modal.Header closeButton>
                    {t("NUB")}
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <InputField
                            type="text"
                            className=""
                            name="nubID"
                            required={true}
                            placeholder="nubID"
                            label="nubID"
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

export default Nub;
