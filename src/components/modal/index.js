import React, {useState} from 'react';
import {Modal} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";

const ModalCommon = (props) => {
    const {t} = useTranslation();
    const history = useHistory();
    const [showIdentity, setShowIdentity] = useState(true);
    const handleClose = () => {
        setShowIdentity(false);
        props.handleClose();
        if (props.transactionName === "assetMint" ||
            props.transactionName === "Define Asset" ||
            props.transactionName === "wrap" ||
            props.transactionName ==="unwrap" ||
            props.transactionName ==="send splits" ||
            props.transactionName ==="burn asset" ||
            props.transactionName ==="mutate asset"){
            window.location.reload();
            history.push("/assets");
        }else if (props.transactionName === "Define Order"){
            history.push("/orders");
        }else if (props.transactionName === "Make Order"){
            history.push("/marketplace");
        }


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
                {
                    props.transactionName === 'nubid' ?
                        <>
                            <p><b>User Name:</b> {props.nubID}</p>
                            <p><b>IdentityID:</b> {props.testID}</p>
                        </>
                        : ""
                }

                { props.keplrTxn ?
                    props.data.code ?
                        <p>Error: {props.data.rawLog}</p>
                        :
                        <p className="tx-hash">TxHash: <a href={process.env.REACT_APP_ASSET_MANTLE_API + '/txs/' + props.data.transactionHash} target="_blank" rel="noreferrer">{props.data.transactionHash}</a></p>
                    :
                    props.data.code ?
                        <p>Error: {props.data.rawLog}</p>
                        :
                        <p className="tx-hash">TxHash: <a href={process.env.REACT_APP_ASSET_MANTLE_API + '/txs/' + props.data.transactionHash} target="_blank" rel="noreferrer">{props.data.transactionHash}</a></p>

                }
            </Modal.Body>
        </Modal>

    );
};


export default ModalCommon;
