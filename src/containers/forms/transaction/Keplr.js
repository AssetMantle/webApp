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
            queryResponse.then(async (result) => {
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
                        const identityID = await getIdentityId(hashGenerate);
                        let totalData = {
                            fromID: identityID,
                            CoinAmountDenom: '5' + 'stake',
                        };

                        let queryResponse = queries.transactionDefination(address , "", "keplr", 'wrap', totalData);
                        queryResponse.then(async function (item) {
                            console.log(item, "item wrap response");
                        }).catch(err => {
                            console.log(err, "err");
                        });
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
