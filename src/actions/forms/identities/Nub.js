import React, {useState, useEffect} from "react";
import identitiesNubJS from "persistencejs/transaction/identity/nub";
import {Form, Button, Modal} from "react-bootstrap";
import InputField from "../../../components/inputField"
import {useTranslation} from "react-i18next";

const identitiesNub = new identitiesNubJS(process.env.REACT_APP_ASSET_MANTLE_API)

const Nub = () => {
    const [response, setResponse] = useState({});
    const {t} = useTranslation();
    const handleSubmit = (event) => {
        event.preventDefault();
        const nubId = event.target.nubID.value;
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        const nubResponse = identitiesNub.nub(userAddress, "test", userTypeToken, nubId, 25, "stake", 200000, "block");
        nubResponse.then(function (item) {
            const data = JSON.parse(JSON.stringify(item));
            setResponse(data)
            window.location.reload();
            console.log(data, "result nub")
        })
    };

    return (
        <div className="accountInfo">

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

export default Nub;
