import React, {useState} from "react";
import {Modal, Button, Form} from "react-bootstrap";
import {LoginMnemonic, PrivateKey, Ledger} from "./forms/login";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import config from "../constants/config";
import keyUtils from "persistencejs/utilities/keys";

const Login = () => {
    const {t} = useTranslation();
    const history = useHistory()
    const [errorMessage, setErrorMessage] = useState(false);
    const handleRoute = (route) => {
        history.push(route);
    };
    const handleChange = () => {
        setErrorMessage(false)
    };


    const handleSubmit = async event => {
        event.preventDefault();
        const userEmail = event.target.email.value;
        const userPassword = document.getElementById("password").value;
        localStorage.setItem("assetClassificationID",  config.AssetClassificationID);
        localStorage.setItem("orderClassificationID",  config.OrderClassificationID);
        config.users.forEach((user) => {
            const email = user.accountInfo.email;
            const password = user.accountInfo.password;
            if (userEmail === email && userPassword === password) {
                localStorage.setItem("name", user.accountInfo.name);
                localStorage.setItem("address", user.accountInfo.address);
                localStorage.setItem("mnemonic", user.accountInfo.mnemonic);
                localStorage.setItem("userType", user.accountInfo.userType);
                localStorage.setItem("identityID", user.identityID);
                history.push('/marketplace');
            } else {
                setErrorMessage(true)
            }
        });
    };
    return (
        <div className="accountInfo">
            <div className="form-section">
                <p className="form-title">Login</p>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email Address"
                            onChange={handleChange}
                            required={true}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            id="password"
                            onChange={handleChange}
                            placeholder="password"
                            required={true}
                        />
                    </Form.Group>
                    {errorMessage ?
                        <div className="login-error"><p className="error-response">Account not exists</p></div>
                        : ""
                    }
                    <div className="buttons-group">
                        <Button type="submit">Login</Button>
                        <p className="note1">Not a member ?</p>
                        <Button variant="secondary" onClick={() => handleRoute("/signup")}>Sign Up</Button>
                    </div>

                </Form>

            </div>
        </div>

    );
}
export default Login