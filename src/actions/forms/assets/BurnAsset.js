import React, {useState} from "react";
import burnAssetJS from "persistencejs/transaction/assets/burn";
import {Form, Button, Modal} from "react-bootstrap";
import Helpers from "../../../utilities/Helper";
import { useTranslation } from "react-i18next";
const burnAsset = new burnAssetJS(process.env.REACT_APP_ASSET_MANTLE_API)
import { pollTxHash } from '../../../utilities/Helper'
import config from "../../../constants/config.json"

const BurnAsset = (props) => {
    const url = process.env.REACT_APP_ASSET_MANTLE_API;
    const { t } = useTranslation();
    const Helper = new Helpers();
    const [show, setShow] = useState(false);
    const [response, setResponse] = useState({});
    const handleClose = () => {
        setShow(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const asset = props.asset;
        const FromId = event.target.FromId.value;
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
                    console.log(queryData, "queryHashResponse")
                })
            }
        })
    };

    return (
        <div className="accountInfo">
            <Modal.Header closeButton>
                {t("BURN_ASSET")}
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>{t("FROM_ID")}</Form.Label>
                        <Form.Control
                            type="text"
                            className=""
                            name="FromId"
                            required={true}
                            placeholder="FromId"
                        />
                    </Form.Group>
                    <p>{t("ARE_YOU_SURE")}</p>
                    <Button variant="primary" type="submit">
                        {t("YES")}
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        {t("NO")}
                    </Button>
                    {response.code ?
                        <p> {response.raw_log}</p>
                        :
                        <p> {response.txhash}</p>
                    }
                </Form>
            </Modal.Body>
        </div>
    );
};

export default BurnAsset;
