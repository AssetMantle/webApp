import React, {useState} from "react";
import {Modal, Form, Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";

const Ledger = () => {
    const history = useHistory();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);


    return (
        <div className="accountInfo">
            <Modal.Header closeButton>
                Login with Ledger
            </Modal.Header>
            <Modal.Body>
            <p>Connecting Ledger</p>
            </Modal.Body>

        </div>
    );
}
export default Ledger