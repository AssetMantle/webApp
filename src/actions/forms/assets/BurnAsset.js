import React, {useState} from "react";
import burnAssetJS from "persistencejs/transaction/assets/burn";
import {Form, Button, Modal} from "react-bootstrap";
import Helpers from "../../../utilities/Helper";
import { useTranslation } from "react-i18next";
const burnAsset = new burnAssetJS(process.env.REACT_APP_ASSET_MANTLE_API)

const BurnAsset = (props) => {
    const Helper = new Helpers();
    const [show, setShow] = useState(false);
    const [response, setResponse] = useState({});
    const handleClose = () => {
        setShow(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const { t } = useTranslation();
        const asset = props.asset;
        const FromId = event.target.FromId.value;
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const assetId = Helper.GetAssetID(asset.result.value.assets.value.list[0])
        const burnResponse = burnAsset.burn(userAddress, "test", userTypeToken, FromId, assetId, 25, "stake", 200000, "block");
        burnResponse.then(function (item) {
            const data = JSON.parse(JSON.stringify(item));
            setResponse(data)
            console.log(data, "result burnResponse")
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
                        <Form.Label>From Id </Form.Label>
                        <Form.Control
                            type="text"
                            className=""
                            name="FromId"
                            required={true}
                            placeholder="FromId"
                        />
                    </Form.Group>
                    <p>{T("ARE_YOU_SURE")}</p>
                    <Button variant="primary" type="submit">
                        {T("YES")}
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        {T("NO")}
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
