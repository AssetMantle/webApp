import React, {useState, useEffect} from "react";
import burnAssetJS from "persistencejs/transaction/assets/burn";
import {Form, Button, Modal} from "react-bootstrap";
import Helpers from "../../../utilities/helper";

const burnAsset = new burnAssetJS(process.env.REACT_APP_ASSET_MANTLE_API)

const BurnAsset = (props) => {
    const Helper = new Helpers();
    const [show, setShow] = useState(false);
    const [responseData, setResponseData] = useState("");
    const [errorData, setErrorData] = useState("");
    const [assetItemsList, setAssetItemsList] = useState([]);
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
        const burnResponse = burnAsset.burn(userAddress, "test", userTypeToken, FromId, assetId, 25, "stake", 200000, "block");
        console.log(burnResponse, "result burnResponse")
    };
    const handleBurn = () =>{
        const asset = props.asset;
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const assetId = Helper.GetAssetID(asset.result.value.assets.value.list[0])
        const burnResponse = burnAsset.burn(userAddress, "test", userTypeToken, assetId, 25, "stake", 200000, "block");
        console.log(burnResponse, "result burnResponse")
    }
    return (
        <div className="accountInfo">

            <Modal.Header closeButton>
                Burn Asset
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
                <p>Are you sure</p>
                    <Button variant="primary" type="submit">
                        Yes
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        No
                    </Button>
                </Form>
            </Modal.Body>
        </div>
    );
};

export default BurnAsset;
