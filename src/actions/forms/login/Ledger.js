import React from "react";
import {Modal} from "react-bootstrap";

const Ledger = () => {
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