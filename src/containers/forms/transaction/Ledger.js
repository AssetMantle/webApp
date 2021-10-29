import React, {useState, useEffect} from 'react';
import Icon from "../../../icons";
import {fetchAddress} from "../../../utilities/Helpers/ledger";
import {Modal} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import Loader from "../../../components/loader";
import GetID from "../../../utilities/Helpers/getID";
import GetMeta from "../../../utilities/Helpers/getMeta";
import {queryIdentities} from "persistencejs/build/transaction/identity/query";
import queries from "../../../utilities/Helpers/query";
import ModalCommon from "../../../components/modal";
import config from "../../../config";
const identitiesQuery = new queryIdentities(process.env.REACT_APP_ASSET_MANTLE_API);
const LedgerTransaction = (props) => {
    const history = useHistory();
    const [show, setShow] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [loader, setLoader] = useState(false);
    const [nubID, setNubID] = useState('');
    const [testID, setTestID] = useState('');
    const [response, setResponse] = useState({});
    const GetIDHelper = new GetID();
    const GetMetaHelper = new GetMeta();
    const backHandler = () => {
        setShow(false);
        props.setShow(true);
        props.setExternalComponent('');
    };
    const getIdentityId = async (userIdHash) => {
        let identityID = '';
        const identities = await identitiesQuery.queryIdentityWithID('all');
        if (identities) {
            const data = JSON.parse(identities);
            const dataList = data.result.value.identities.value.list;
            for (let identity in dataList) {
                if (dataList[identity].value.immutables.value.properties.value.propertyList !== null) {
                    const immutablePropertyList = dataList[identity].value.immutables.value.properties.value.propertyList[0];
                    if (immutablePropertyList.value.fact.value.hash === userIdHash) {
                        console.log("new id",GetIDHelper.GetIdentityID(dataList[identity]) );
                        identityID = GetIDHelper.GetIdentityID(dataList[identity]);
                        console.log(identityID, "new issssss");
                        setTestID(GetIDHelper.GetIdentityID(dataList[identity]));
                    }
                }
            }
        }
        return identityID;
    };

    useEffect(() => {
        const ledgerHandler = async () =>{
            let loginAddress;
            try {
                if (props.TransactionName === "nubid") {
                    let ledgerResponse = await fetchAddress("mantle", 0, 0);
                    loginAddress = ledgerResponse;
                } else {
                    loginAddress = localStorage.getItem('userAddress');
                }
                setLoader(true);
                let queryResponse = queries.transactionDefinition(loginAddress, "", "ledger", props.TransactionName, props.totalDefineObject);
                queryResponse.then(async (result) => {
                    if (result.code) {
                        localStorage.setItem('loginMode', 'ledger');
                        setLoader(false);
                        if (props.TransactionName === "nubid") {
                            setErrorMessage(result.rawLog);
                        } else {
                            setErrorMessage(result.rawLog);

                        }
                    } else {
                        if (props.TransactionName === "nubid") {
                            setNubID(props.totalDefineObject.nubId);
                            const hashGenerate = GetMetaHelper.Hash(props.totalDefineObject.nubId);
                            const identityID = await getIdentityId(hashGenerate);
                            let totalData = {
                                fromID: identityID,
                                CoinAmountDenom: '5000000' + config.coinDenom,
                            };

                            let queryResponse = queries.transactionDefinition(loginAddress, "", "ledger", 'wrap', totalData);
                            queryResponse.then(async function (item) {
                                console.log(item, "item wrap response");
                            }).catch(err => {
                                console.log(err, "err");
                            });
                        }
                        localStorage.setItem('loginMode', 'ledger');
                        setShow(false);
                        setLoader(false);
                        setResponse(result);
                    }
                }).catch((error) => {
                    setLoader(false);
                    setErrorMessage(error.message);
                    console.log(error, 'error');
                });
            } catch(error) {
                setLoader(false);
                setErrorMessage(error.message);
                console.log(error, 'error');
            }
        };
        ledgerHandler();
    }, []);

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
            <Modal show={show} onHide={handleClose} className="mnemonic-login-section login-section key-select" centered>
                <Modal.Header closeButton>
                    <div className="back-button" onClick={backHandler}>
                        <Icon viewClass="arrow-icon" icon="arrow"/>
                    </div>
                    <p className="title">{props.network}</p>
                </Modal.Header>
                {loader ?
                    <Loader />
                    : ""
                }
                <Modal.Body>
                    {errorMessage !== "" ?
                        <p className="error-response">{errorMessage}</p>
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

export default LedgerTransaction;
