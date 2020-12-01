import React, {useState, useEffect} from "react";
import identitiesProvisionJS from "persistencejs/transaction/identity/provision";
import {Form, Button, Modal} from "react-bootstrap";
import InputField from "../../../components/inputField"
import {useTranslation} from "react-i18next";

const identitiesProvision = new identitiesProvisionJS(process.env.REACT_APP_ASSET_MANTLE_API)

const Provision = (props) => {
    const [response, setResponse] = useState({});
    const {t} = useTranslation();
    const handleSubmit = (event) => {
        event.preventDefault();
        const toAddress = event.target.toAddress.value;
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const provisionResponse = identitiesProvision.provision(userAddress, "test", userTypeToken, props.identityId, toAddress, 25, "stake", 200000, "block");
        console.log(provisionResponse, "result provision")
        provisionResponse.then(function (item) {
            const data = JSON.parse(JSON.stringify(item));
            setResponse(data)
            window.location.reload();
            console.log(data, "result define Identity")
        })
    };

    return (
        <div className="accountInfo">
            <Modal.Header closeButton>
                {t("PROVISION")}
            </Modal.Header>
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

export default Provision;
