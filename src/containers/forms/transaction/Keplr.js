import React, {useState, useEffect} from 'react';
import Icon from "../../../icons";
import {Modal} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import KeplerWallet from "../../../utilities/Helpers/kelplr";
import queries from "../../../utilities/Helpers/query";
import Loader from "../../../components/loader";
import {queryIdentities} from "persistencejs/build/transaction/identity/query";
import GetID from "../../../utilities/Helpers/getID";
import GetMeta from "../../../utilities/Helpers/getMeta";
import ModalCommon from "../../../components/modal";
const identitiesQuery = new queryIdentities(process.env.REACT_APP_ASSET_MANTLE_API);
const KeplrTransaction = (props) => {
    const history = useHistory();
    const [show, setShow] = useState(true);
    const [loader, setLoader] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
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
    const getIdentityId = (userIdHash) => {
        const identities = identitiesQuery.queryIdentityWithID('all');
        if (identities) {
            identities.then(function(item) {
                const data = JSON.parse(item);
                const dataList = data.result.value.identities.value.list;
                dataList.map((identity) => {
                    if (identity.value.immutables.value.properties.value.propertyList !== null) {
                        const immutablePropertyList = identity.value.immutables.value.properties.value.propertyList[0];
                        if (immutablePropertyList.value.fact.value.hash === userIdHash) {
                            console.log("new id",GetIDHelper.GetIdentityID(identity) );
                            setTestID(GetIDHelper.GetIdentityID(identity));
                        }
                    }
                });

            });
        }
    };
    useEffect(() => {
        setLoader(true);
        setErrorMessage("");
        const kepler = KeplerWallet();
        kepler.then(function () {
            let address;
            if(props.TransactionName === "nubid"){
                address = localStorage.getItem("keplerAddress");
            }else {
                address = localStorage.getItem('userAddress');
            }

            let queryResponse = queries.transactionDefination(address , "", "keplr", props.TransactionName, props.totalDefineObject);
            queryResponse.then((result) => {
                console.log("response finale", result);
                if(result.code){
                    setLoader(false);
                    if(props.TransactionName === "nubid"){
                        setErrorMessage(result.rawLog);
                    }else
                    {
                        setErrorMessage(result.rawLog);

                    }
                }else {
                    if(props.TransactionName === "nubid"){
                        setNubID(props.totalDefineObject.nubId);
                        const hashGenerate = GetMetaHelper.Hash(props.totalDefineObject.nubId);
                        getIdentityId(hashGenerate);
                    }
                    setShow(false);
                    setLoader(false);
                    setResponse(result);
                }
            }).catch((error) => {
                setLoader(false);
                setErrorMessage(error.message);
            });
        }).catch(err => {
            setLoader(false);
            setErrorMessage(err.message);
        });

    }, []);

    const handleClose = () => {
        setShow(false);
        props.setExternalComponent("");
        history.push('/');
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

export default KeplrTransaction;
