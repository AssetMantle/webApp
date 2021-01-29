import React, {useState} from "react";
import burnAssetJS from "persistencejs/transaction/assets/burn";
import {Form, Button, Modal} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Loader from "../../../components/loader"
import ModalCommon from "../../../components/modal"
const burnAsset = new burnAssetJS(process.env.REACT_APP_ASSET_MANTLE_API)
import config from "../../../constants/config.json"

const BurnAsset = (props) => {
    const { t } = useTranslation();
    const [show, setShow] = useState(true);
    const [loader, setLoader] = useState(false)
    const [response, setResponse] = useState({});
    const handleClose = () => {
        setShow(false);
        props.setExternalComponent("");
    };

    const handleSubmit = (event) => {
        setLoader(true)
        event.preventDefault();
        const FromId =  props.ownerId;
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const assetId =  props.ownableId;
        const burnResponse = burnAsset.burn(userAddress, "test", userTypeToken, FromId, assetId, config.feesAmount, config.feesToken, config.gas, config.mode);
        burnResponse.then(function (item) {
            const data = JSON.parse(JSON.stringify(item));
                    setResponse(data)
                    setShow(false);
                    setLoader(false)
        })
    };

    return (
        <div>
            <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                {t("BURN_ASSET")}
            </Modal.Header>
                <div>
                    {loader ?
                        <Loader />
                        : ""
                    }
                </div>
            <Modal.Body>
                <Form onSubmit={handleSubmit} className="burn-confirmation-buttons">
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

export default BurnAsset;
