import React, {useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";

const AddressLogin = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const [show, setShow] = useState(true);

    const handleClose = () => {
        setShow(false);
        history.push('/');
    };

    const handleSubmit = event => {
        const address = event.target.address.value;
        history.push({
            pathname: '/identities/all',
            address: address
        });
    };
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
                                required={true}/>
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
};
export default AddressLogin;
