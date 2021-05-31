import React, { useState } from "react";
import {Modal, Form, Button} from "react-bootstrap";
import { LoginMnemonic, PrivateKey, Ledger } from "./forms/login";
import IdentityLogin from './forms/login/IdentityLogin';
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import MnemonicIcon from "../assets/images/MnemonicIcon.svg"
import PrivatekeyIcon from "../assets/images/PrivatekeyIcon.svg"
import LedgerIcon from "../assets/images/LedgerIcon.svg"
import Icon from "../icons";

const AddressLogin = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [errorMessage, setErrorMessage] = useState(false);
    const [show, setShow] = useState(true);
  
    const handleClose = () => {
        setShow(false)
        history.push('/');
    };
    const handleRoute = (route) => {
        setShow(false);
        setExternalComponent(route)
    };
    const handleSubmit = event => {
        
        const address = event.target.address.value
        history.push({
            pathname:'/allidentities',
            address:address
        });
    }
    return (
        <div className="accountInfo">
            <Modal show={show} onHide={handleClose} className="signup-section login-section" centered>
                <Modal.Header closeButton>
                    {t("ENTER_ADDRESS")}
                </Modal.Header>
                <Modal.Body>
                    <div className="mrt-10">
                        <Form onSubmit={handleSubmit}>
                            <Form.Control type="text" name="address"
                                placeholder="Enter Address"
                                required={true} />
                            {errorMessage ?
                                <div className="login-error"><p className="error-response">Address Not Exist</p></div>
                                : ""
                            }
                            <div className="submitButtonSection">
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="button-double-border"
                                >
                                    {t("SUBMIT")}
                                </Button>
                            </div>
                        </Form>
                    </div>


                </Modal.Body>
            </Modal>

         
        </div>
    );
}
export default AddressLogin