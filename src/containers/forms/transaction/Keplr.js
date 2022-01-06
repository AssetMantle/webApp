import React, {useEffect, useState} from 'react';
import Icon from "../../../icons";
import { Modal} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import KeplerWallet from "../../../utilities/Helpers/kelplr";
import queries from "../../../utilities/Helpers/query";
import Loader from "../../../components/loader";
import GetMeta from "../../../utilities/Helpers/getMeta";
import ModalCommon from "../../../components/modal";
import config from "../../../config";
import {useTranslation} from "react-i18next";
import axios from "axios";
import {pollTxHash} from "../../../utilities/Helpers/filter";
const url = process.env.REACT_APP_ASSET_MANTLE_API;

const KeplrTransaction = (props) => {
    const {t} = useTranslation();
    const history = useHistory();
    const [show, setShow] = useState(true);
    const [loader, setLoader] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [nubID, setNubID] = useState('');
    const [testID, setTestID] = useState('');
    const [faucetResponse, setFaucetResponse] = useState('');
    const [response, setResponse] = useState({});
    const GetMetaHelper = new GetMeta();
    const backHandler = () => {
        setShow(false);
        props.setShow(true);
        props.setExternalComponent('');
    };
    
    const handleFaucet = () => {
        let address = '';
        if (props.TransactionName === "nubid") {
            address = localStorage.getItem("keplerAddress");
        } else {
            address = localStorage.getItem('userAddress');
        }
        setLoader(true);
        axios.post(process.env.REACT_APP_FAUCET_SERVER + '/faucetRequest', {address: address})
            .then(faucetResult => {
                setTimeout(() => {
                    setFaucetResponse(faucetResult);
                    setLoader(false);
                }, 5000);
            },
            )
            .catch(err => {
                console.log(err);
                setLoader(false);
            });
    };

    useEffect(() => {
        setLoader(true);
        setErrorMessage("");
        const kepler = KeplerWallet();
        kepler.then(function () {
            let address;
            if (props.TransactionName === "nubid") {
                address = localStorage.getItem("keplerAddress");
            } else {
                address = localStorage.getItem('userAddress');
            }

            let queryResponse = queries.transactionDefinition(address, "", "keplr", props.TransactionName, props.totalDefineObject);

            queryResponse.then((result) => {

                if(result.transactionHash) {
                    let queryHashResponse = pollTxHash(url, result.transactionHash);
                    queryHashResponse.then(function (queryItem) {
                        const parsedQueryItem = JSON.parse(queryItem);
                        if (parsedQueryItem.code) {

                            setLoader(false);
                            if (props.TransactionName === "nubid") {
                                setErrorMessage(result.rawLog);
                            } else {
                                setErrorMessage(result.rawLog);

                            }
                        } else {
                            if (props.TransactionName === "nubid") {
                                setNubID(props.totalDefineObject.nubId);
                                const identityID = config.nubClassificationID + '|' + GetMetaHelper.Hash(GetMetaHelper.Hash(props.totalDefineObject.nubId));
                                setTestID(identityID);
                                let totalData = {
                                    fromID: identityID,
                                    CoinAmountDenom: '5000000' + config.coinDenom,
                                };

                                let queryResponse = queries.transactionDefinition(address, "", "keplr", 'wrap', totalData);
                                queryResponse.then(async function (item) {
                                    console.log(item);
                                }).catch(err => {
                                    console.log(err, "err");
                                });
                            }
                            setShow(false);
                            setLoader(false);
                            setResponse(result);
                        }
                    });
                }
            }).catch((error) => {
                setLoader(false);
                console.log("account error", error);
                if(error.message === t('ACCOUNT_NOT_EXISTS_ERROR')){
                    handleFaucet();
                }else {
                    setErrorMessage(error.message);
                }
            });
        }).catch(err => {
            setLoader(false);
            setErrorMessage(err.message);
        });

    }, [faucetResponse]);

    const handleClose = () => {
        setShow(false);
        props.setExternalComponent("");
        props.handleClose();
        if (props.TransactionName === "nubid") {
            history.push('/');
        }
    };
    return (
        <div className="custom-modal seed">
            <Modal show={show} onHide={handleClose} className="mnemonic-login-section login-section key-select"
                centered>
                <Modal.Header closeButton>
                    <div className="back-button" onClick={backHandler}>
                        <Icon viewClass="arrow-icon" icon="arrow"/>
                    </div>Keplr
                </Modal.Header>
                {loader ?
                    <Loader/>
                    : ""
                }
                <Modal.Body>
                    {errorMessage !== "" ?
                        errorMessage !== t('ACCOUNT_NOT_EXISTS_ERROR') ?
                            <p className="error-response">{errorMessage}</p>
                            : ""
                        : ""
                    }

                </Modal.Body>
            </Modal>
            {!(Object.keys(response).length === 0) ?
                <ModalCommon
                    data={response}
                    handleClose={handleClose}
                    setErrorMessage={setErrorMessage}
                    testID={testID}
                    transactionName={props.TransactionName}
                    nubID={nubID}
                />
                : ""
            }
        </div>

    );
};

export default KeplrTransaction;
