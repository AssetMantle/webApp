import React from "react";
import {Form, Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import keyUtils from "persistenceJS/utilities/keys";

const LoginAction = () => {
    const history = useHistory();

    const handleSubmit = async event => {
        const error = keyUtils.createWallet(event.target.mnemonic.value)
        if (error.error != null) {
            console.log("returned error")
            return (<div>ERROR!!</div>)
        }
        const wallet = keyUtils.getWallet(event.target.mnemonic.value)
        localStorage.setItem("address", wallet.address)
        localStorage.setItem("mnemonic", event.target.mnemonic.value)
        history.push('/IdentityList');
    }

    return (
        <div className="container">
            <div className="accountInfo">
                <div className="row row-cols-1 row-cols-md-2 card-deck createAccountSection">
                    <div className="col-md-6 custom-pad signup-box">
                        <Form onSubmit={handleSubmit}>
                            <Form.Label>Mnemonic</Form.Label>
                            <Form.Control
                                type="text"
                                name="mnemonic"
                                placeholder="Enter Mnemonic"
                                required="true"
                            />
                              <div className="submitButtonSection">
                            <Button
                                variant="primary"
                                type="submit"
                            >
                                Submit
                            </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default LoginAction