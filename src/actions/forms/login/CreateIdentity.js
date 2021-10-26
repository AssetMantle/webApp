import React, {useState} from "react";
import {Modal, Form, Button} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import {useTranslation} from 'react-i18next';
import transactions from '../../../utilities/Helpers/transactions';
import config from '../../../config';
import Msgs from '../../../utilities/Helpers/Msgs';
import {pollTxHash} from '../../../utilities/Helpers/filter';
import GetID from '../../../utilities/Helpers/getID';
import GetMeta from '../../../utilities/Helpers/getMeta';
import {queryIdentities} from 'persistencejs/build/transaction/identity/query';
import {nubIdentity} from 'persistencejs/build/transaction/identity/nub';
import Loader from '../../../components/loader';
import Icon from '../../../icons';
const identitiesQuery = new queryIdentities(process.env.REACT_APP_ASSET_MANTLE_API);
const identitiesNub = new nubIdentity(process.env.REACT_APP_ASSET_MANTLE_API);
const CreateIdentity = (props) => {
    const history = useHistory();
    const [show, setShow] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [showForm, setShowForm] = useState(true);
    const [response, setResponse] = useState({});
    const [showtxnHash, setshowtxnHash] = useState(false);
    const [testID, setTestID] = useState('');
    const [loader, setLoader] = useState(false);
    const {t} = useTranslation();
    const GetIDHelper = new GetID();
    const GetMetaHelper = new GetMeta();

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
                            setTestID(GetIDHelper.GetIdentityID(identity));
                        }
                    }
                });

            });
        }
    };


    const handleSubmit = async (e) => {
        setLoader(true);
        e.preventDefault();
        let userMnemonic;
        const userid = document.getElementById('userName').value;
        const password = e.target.password.value;
        let promise = transactions.PrivateKeyReader(e.target.uploadFile.files[0], password);
        await promise.then(function (result) {
            userMnemonic = result;
        }).catch(err => {
            setErrorMessage(err);
            setLoader(false);
        });
        if (userMnemonic !== undefined) {
            const wallet = await transactions.MnemonicWalletWithPassphrase(userMnemonic, "");
            const address = wallet[1];
            const hashGenerate = GetMetaHelper.Hash(userid);
            const msgs = await identitiesNub.createIdentityNubMsg(address, config.chainID, userid, config.feesAmount, config.feesToken, config.gas, config.mode);
            console.log(msgs, "msgs");
            const nubResponse = transactions.TransactionWithMnemonic([msgs.value.msg[0]], Msgs.Fee(0, 200000), '', userMnemonic);
            nubResponse.then(function(data) {
                const pollResponse = pollTxHash(process.env.REACT_APP_ASSET_MANTLE_API, data.transactionHash);
                pollResponse.then(function(pollData) {
                    const pollObject = JSON.parse(pollData);
                    if (pollObject.code) {
                        setLoader(false);
                        setErrorMessage("Username already exists");
                    } else {
                        setLoader(false);
                        setShowForm(false);
                        console.log(pollObject);
                        localStorage.clear();
                        getIdentityId(hashGenerate);
                        setshowtxnHash(true);
                    }
                });
                setResponse(data);
            }).catch(err => {
                setLoader(false);
                setErrorMessage(err.message);
                console.log(err.message);
            });
        }
    };
    const handleClose = () => {
        setShow(false);
        history.push('/');
    };
    const backHandler = (item) => {
        if (item === "CreateIdentity") {
            setShow(false);
            props.setShow(true);
            props.setExternalComponent("");
        }
    };
    return (
        <div>
            <Modal show={show} onHide={handleClose}  className="mnemonic-login-section login-section key-select" centered>
                <Modal.Header closeButton>
                    <div className="back-button" onClick={() => backHandler('CreateIdentity')}>
                        <Icon viewClass="arrow-icon" icon="arrow"/>
                    </div>
                    Create Identity
                </Modal.Header>
                <Modal.Body>
                    {loader ?
                        <Loader/>
                        : ''
                    }
                    {showForm ?
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>{t('ENTER_USER_NAME')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="text"
                                    id="userName"
                                    placeholder="UserName"
                                    autoComplete="off"
                                    required={true}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.File id="exampleFormControlFile1" name="uploadFile" accept=".json" label="upload private key file" required={true} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>{t("DECRYPT_KEY_STORE")}</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="password"
                                    autoComplete="off"
                                    required={true}
                                />
                            </Form.Group>
                            {errorMessage ?
                                <p className="error-response"> {errorMessage}</p> : ""}
                            <div className="submitButtonSection"    >
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="button-double-border"
                                >
                                    {t("SUBMIT")}
                                </Button>
                            </div>
                        </Form>
                        : ""}
                    {showtxnHash ?
                        response.code ?
                            <p>Error: {response.raw_log}</p>
                            :
                            <p className="tx-hash">TxHash: <a
                                href={process.env.REACT_APP_ASSET_MANTLE_API + '/txs/' + response.transactionHash}
                                target="_blank"
                                rel="noreferrer">{response.transactionHash}</a>
                            </p>
                        : ''}
                    {testID !== ""?
                        <p><b>IdentityID:</b> {testID}</p>
                        : ""
                    }
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default CreateIdentity;
