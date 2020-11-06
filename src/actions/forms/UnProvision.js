import React, {useState, useEffect} from "react";
import identitiesUnprovisionJS from "persistencejs/transaction/identity/unprovision";
import InputField from '../../components/inputField'
import {Form, Button, Modal} from "react-bootstrap";

const identitiesUnprovision = new identitiesUnprovisionJS(process.env.REACT_APP_ASSET_MANTLE_API)

const UnProvision = (props) => {
    const [show, setShow] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [provisionAddressList, setProvisionAddressList] = useState([]);
    const handleClose = () => {
        setShow(false);
        window.location.reload();
    };
    useEffect(() => {
        const provisionedAddressList = props.identityIdList.value.provisionedAddressList;
        provisionedAddressList.map((address) => {
            setProvisionAddressList((provisionAddressList) => [
                ...provisionAddressList,
                address,
            ]);
        })
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const selectValue = event.target.selectAddress.value;
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const UnProvisionResponse = identitiesUnprovision.unprovision(userAddress, "test", userTypeToken, props.identityId, selectValue, 25, "stake", 200000, "block");
        console.log(UnProvisionResponse, "result Unprovision")
    };
    const handleSelectChange = (evt) => {
        setSelectedAddress(evt.target.value);
    };
    return (
        <div className="accountInfo">

            <Modal.Header closeButton>
                Provision
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>New Address to Provision</Form.Label>
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
                            Submit
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </div>
    );
};

export default UnProvision;
