import React, {useState} from 'react';
import {Modal} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import * as markePlace from "../../store/actions/marketPlace";
import * as assets from "../../store/actions/assets";
import * as faucet from "../../store/actions/faucet";
import * as wrappedCoins from "../../store/actions/wrappedCoins";

const ModalCommon = (props) => {
    const {t} = useTranslation();
    const history = useHistory();
    const userAddress = localStorage.getItem('userAddress');
    const identityID = localStorage.getItem('identityId');
    const [showIdentity, setShowIdentity] = useState(true);
    const dispatch = useDispatch();
    const handleClose = async () => {
        setShowIdentity(false);
        props.handleClose();
        if (props.transactionName === "assetMint" ||
            props.transactionName === "Define Asset" ||
            props.transactionName ==="send splits" ||
            props.transactionName ==="burn asset" ||
            props.transactionName ==="mutate asset"){
            await Promise.all([
                dispatch(assets.fetchAssets(identityID)),
            ]);
            history.push("/assets");
        }else if(props.transactionName === "unwrap" ||
            props.transactionName === "wrap" ||
            props.transactionName === "provision" ||
            props.transactionName === "un provision"){
            await Promise.all([
                dispatch(faucet.fetchFaucet(userAddress)),
                dispatch(wrappedCoins.fetchWrappedCoins(identityID))
            ]);
            history.push("/profile");
        }
        else if (props.transactionName === "Define Order"){
            history.push("/orders");
            window.location.reload();
        }else if (props.transactionName === "make order"){
            await Promise.all([
                dispatch(assets.fetchAssets(identityID)),
                dispatch(markePlace.fetchMarketPlace())
            ]);
            history.push("/marketplace");
        }else if (props.transactionName === "take order"){
            await Promise.all([
                dispatch(assets.fetchAssets(identityID)),
                dispatch(markePlace.fetchMarketPlace())
            ]);
            history.push("/assets");
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
                        <p className="tx-hash">TxHash: <a href={process.env.REACT_APP_EXPLORER_API + '/transaction?txHash=' + props.data.transactionHash}target="_blank" rel="noreferrer">{props.data.transactionHash}</a></p>
                    :
                    props.data.code ?
                        <p>Error: {props.data.rawLog}</p>
                        :
                        <p className="tx-hash">TxHash: <a href={process.env.REACT_APP_EXPLORER_API + '/transaction?txHash=' + props.data.transactionHash} target="_blank" rel="noreferrer">{props.data.transactionHash}</a></p>

                }
            </Modal.Body>
        </Modal>

    );
};


export default ModalCommon;
