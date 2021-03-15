import React, {useState} from 'react';
import {Form, Modal} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import base64url from "base64url";

const ModalCommon = (props) => {
    const {t} = useTranslation();
    const [showIdentity, setShowIdentity] = useState(true);
    const handleClose = () => {
        setShowIdentity(false);
        props.setExternal();
        window.location.reload();
    };
    return (
        <Modal
            show={showIdentity}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
            className={props.name === "mint" ? "tx-result minting-modal" : "tx-modal"}
        >
            <Modal.Header closeButton>
                {props.name === "mint" ?
                    <span className="success-title">Succesfully Minted an NFT!</span>
                    : <span>{t("Result")}</span>
                }

            </Modal.Header>
            <Modal.Body >
                {props.data.code ?
                    <p>Error: {props.data.raw_log}</p>
                    :
                    <div>
                        {props.name === "mint" ?
                            <>
                                <div className="result-image">
                                    <img src={base64url.decode(props.uri)} />
                                </div>

                                <div className="result-item">
                                    <p className="title">Title</p>
                                    <p className="result">{props.title}</p>
                                </div>
                                <hr/>
                                <div className="result-item">
                                    <p className="title">Description</p>
                                    <p className="result description">{props.description}</p>
                                </div>
                            </>
                            : <p className="tx-hash">TxHash: {props.data.txhash}</p>
                        }
                    </div>

                }
            </Modal.Body>
        </Modal>

    );
};


export default ModalCommon;
