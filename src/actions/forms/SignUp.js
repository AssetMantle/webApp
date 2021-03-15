import React, {useState} from "react";
import {Modal, Button, Form} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";


const Login = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const [show, setShow] = useState(true);
    const handleRoute = (route) => {
        history.push(route);
    }
    return (
        <div className="accountInfo">
            <div className="form-section">
                <p className="main-heading">Join HYPEBEAST now</p>
                <p className="form-title">Sign up with your email address.</p>
                <Form.Group>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        id="password"
                        placeholder="Email Address"
                        required={true}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        id="password"
                        placeholder="password"
                        required={true}
                    />
                </Form.Group>

                <p className="note">By signing up, you confirm to have read and agree to our Terms of Use and Privacy Policy.
                </p>
                <Button>SignUp</Button>
                <p className="note1">Already a member ?</p>
                <Button onClick={()=>handleRoute("/login")}>Login</Button>
            </div>
        </div>

    );
}
export default Login