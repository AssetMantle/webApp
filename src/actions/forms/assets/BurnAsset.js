import React, {useState} from "react";
import burnAssetJS from "persistencejs/transaction/assets/burn";
import {Form, Button, Modal} from "react-bootstrap";
import Helpers from "../../../utilities/Helper";
import { useTranslation } from "react-i18next";
import Loader from "../../../components/loader"
import ModalCommon from "../../../components/modal"
const burnAsset = new burnAssetJS(process.env.REACT_APP_ASSET_MANTLE_API)
import { pollTxHash } from '../../../utilities/Helper'
import config from "../../../constants/config.json"

const BurnAsset = (props) => {
    const url = process.env.REACT_APP_ASSET_MANTLE_API;
    const { t } = useTranslation();
    const Helper = new Helpers();
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
        const asset = props.asset;
        const FromId =  props.assetId;
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const assetId = Helper.GetAssetID(asset.result.value.assets.value.list[0])
        const burnResponse = burnAsset.burn(userAddress, "test", userTypeToken, FromId, assetId, config.feesAmount, config.feesToken, config.gas, config.mode);
        burnResponse.then(function (item) {
            const data = JSON.parse(JSON.stringify(item));
            if(data.txhash){
                let queryHashResponse =  pollTxHash(url, data.txhash);
                queryHashResponse.then(function (queryItem) {
                    const queryData = JSON.parse(queryItem);
                    setResponse(queryData)
                    setShow(false);
                    setLoader(false)
                })
            }
        })
    };

    return (
        <div className="accountInfo">
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
                <ModalCommon data={response}/>
                : ""
            }
        </div>
    );
};

export default BurnAsset;
