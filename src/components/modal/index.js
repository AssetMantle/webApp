import React, {useState} from 'react';
import {Form, Modal} from "react-bootstrap";
import {useTranslation} from "react-i18next";

const ModalCommon = (props) => {
    const {t} = useTranslation();
    const [showIdentity, setShowIdentity] = useState(true);
    const handleClose = () => {
        setShowIdentity(false);
        // window.location.reload();
    };
    return (
        <Modal
            show={showIdentity}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                {t("Result")}
            </Modal.Header>
            <Modal.Body>
                {props.data.code ?
                    <p>Error: {props.data.raw_log}</p>
                    :
                    <p className="tx-hash">TxHash: {props.data.txhash}</p>

                }
            </Modal.Body>
        </Modal>

    );
};


export default ModalCommon;
