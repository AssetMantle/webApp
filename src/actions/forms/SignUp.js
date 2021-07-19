import React, {useState} from 'react';
import {Modal, Form, Button} from 'react-bootstrap';
import {
    createRandomWallet,
    createStore,
} from 'persistencejs/build/utilities/keys';
import {queryIdentities} from 'persistencejs/build/transaction/identity/query';
import {nubIdentity} from 'persistencejs/build/transaction/identity/nub';
import DownloadLink from 'react-download-link';
import config from '../../config';
import GetID from '../../utilities/Helpers/getID';
import {useTranslation} from 'react-i18next';
import GetMeta from '../../utilities/Helpers/getMeta';
import axios from 'axios';
import {pollTxHash} from '../../utilities/Helpers/filter';
import {useHistory} from 'react-router-dom';
import Loader from '../../components/loader';
import Icon from '../../icons';
import Msgs from '../../utilities/Helpers/Msgs';
import transactions from '../../utilities/Helpers/transactions';

const identitiesQuery = new queryIdentities(process.env.REACT_APP_ASSET_MANTLE_API);
const identitiesNub = new nubIdentity(process.env.REACT_APP_ASSET_MANTLE_API);
const SignUp = () => {
    const [response, setResponse] = useState({});
    const [loader, setLoader] = useState(false);
    const userAddress = localStorage.getItem('address');
    const {t} = useTranslation();
    const history = useHistory();
    const GetIDHelper = new GetID();
    const GetMetaHelper = new GetMeta();
    const [show, setShow] = useState(true);
    const [jsonName, setJsonName] = useState({});
    const [showEncrypt, setShowEncrypt] = useState(false);
    const [mnemonic, setMnemonic] = useState('');
    const [formName, setFormName] = useState('');
    const [testID, setTestID] = useState('');
    const [address, setAddress] = useState('');
    const [showDownload, setShowDownload] = useState(false);
    const [showFaucet, setShowFaucet] = useState(false);
    const [showDownloadModal, setshowDownloadModal] = useState(true);
    const [showtxnHash, setshowtxnHash] = useState(false);
    const [userExist, setuserExist] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const handleClose = () => {
        setShow(false);
        history.push('/');
    };
    const handleFaucet = () => {
        setLoader(true);
        axios.post(process.env.REACT_APP_FAUCET_SERVER + '/faucetRequest', {address: userAddress})
            .then(response => {
                console.log(response);
                setLoader(false);
            },
            )
            .catch(err => {
                console.log(err);
                setLoader(false);
            });

        setShowDownload(false);
        setshowDownloadModal(false);
        setShowFaucet(true);
        setshowtxnHash(false);
    };
    const handleCloseEncrypt = () => {
        setShowEncrypt(false);
        history.push('/');
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
                            const identityId = GetIDHelper.GetIdentityID(identity);
                            setTestID(identityId);
                        }
                    }
                });

            });
        }
    };
    const handleSubmitIdentity = async e => {
        setLoader(true);
        e.preventDefault();
        const userid = document.getElementById('userName').value;
        const hashGenerate = GetMetaHelper.Hash(userid);
        const msgs = await identitiesNub.createIdentityNubMsg(address, config.chainID, userid, config.feesAmount, config.feesToken, config.gas, config.mode);
        const nubResponse = transactions.TransactionWithMnemonic([msgs.value.msg[0]], Msgs.Fee(0, 200000), '', mnemonic);
        nubResponse.then(function(data) {
            const pollResponse = pollTxHash(process.env.REACT_APP_ASSET_MANTLE_API, data.transactionHash);
            pollResponse.then(function(pollData) {
                const pollObject = JSON.parse(pollData);
                if (pollObject.code) {
                    setLoader(false);
                    setuserExist(true);
                } else {
                    console.log(pollObject);
                    getIdentityId(hashGenerate);
                    setLoader(false);
                    setShowFaucet(false);
                    setshowtxnHash(true);
                }
            });
            setResponse(data);
            setshowDownloadModal(false);
            setShowDownload(false);
        }).catch(err => {
            setErrorMessage(err.message);
            console.log(err.message);
            setLoader(false);
        });
    };
    const handleSubmit = async e => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        const error = await createRandomWallet('');
        console.log(error);
        if (error.error != null) {
            return (<div>ERROR!!</div>);
        }

        const create = createStore(error.mnemonic, password);
        if (create.error != null) {
            return (<div>ERROR!!</div>);
        }
        const jsonContent = JSON.stringify(create.Response);
        localStorage.setItem('address', error.address);
        localStorage.setItem('mnemonic', error.mnemonic);
        setJsonName(jsonContent);
        setAddress(error.address);
        setMnemonic(error.mnemonic);
        setShowEncrypt(true);
        setshowDownloadModal(false);
        setShowDownload(true);
        setshowtxnHash(false);
    };

    const handleEncrypt = (name) => {
        setShow(false);
        setFormName(name);
        setShowEncrypt(true);
    };

    return (
        <div>
            <Modal show={show} onHide={handleClose} className="signup-section"
                centered>
                <Modal.Header closeButton>
                    {t('SIGNING_UP')}
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <p>({t('SIGNUP_NOTE')})</p>
                        <div>
                            <Button
                                variant="primary"
                                className="button-signup-mnemonic button-signup"
                                onClick={() => handleEncrypt('SignUp with PrivateKey')}
                            >
                                {t('MNEMONIC')}/{t('PRIVATE_KEY')}
                            </Button>
                            <Button
                                variant="primary"
                                className="button-signup button-signup-ledger disabled"
                            >
                                {t('LEDGER_STORE')}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Form.Check custom type="checkbox"
                        label="Accept Terms & Conditions"
                        name="removeMaintainer"
                        id="removeMaintainer"
                    />
                </Modal.Footer>
            </Modal>
            <Modal
                show={showEncrypt}
                onHide={handleCloseEncrypt}
                centered
                className="signup-section"
            >
                <Modal.Header closeButton>
                    {formName}
                </Modal.Header>
                <Modal.Body className="private-key">
                    {showDownloadModal ?
                        <Form onSubmit={handleSubmit}>
                            <Form.Label>{t('ENCRYPT_KEY_STORE')}</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                id="password"
                                placeholder="password"
                                required={true}
                            />
                            <div className="submitButtonSection">
                                <Button
                                    variant="primary"
                                    type="submit"
                                >
                                    {t('NEXT')}
                                </Button>
                            </div>
                        </Form>
                        : ''
                    }
                    {showDownload ?
                        <div>

                            <p className="mnemonic-note">({t('SAVE_MNEMONIC')}) </p>
                            <p className="mnemonic-text">{mnemonic}</p>
                            <p>{address}</p>
                            <p className="key-download">
                                <DownloadLink
                                    label="Download Key File for future use"
                                    filename="key.json"
                                    exportFile={() => `${jsonName}`}
                                />
                                <Icon viewClass="arrow-icon" icon="arrow"/>
                            </p>
                            <p className="download-note">({t('DOWNLOAD_KEY')})</p>
                            <Button
                                variant="primary"
                                onClick={handleFaucet}
                            >
                                {t('FAUCET')}
                            </Button>
                        </div>
                        :
                        ''
                    }
                    {showFaucet ?
                        <Form onSubmit={handleSubmitIdentity}>
                            <div className="form-field">
                                <Form.Label>{t('ENTER_USER_NAME')}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="text"
                                    id="userName"
                                    placeholder="UserName"
                                    required={true}
                                />
                            </div>
                            <div className="submitButtonSection">
                                <Button
                                    variant="primary"

                                    type="submit"
                                >
                                    {t('SUBMIT')}
                                </Button>
                                {errorMessage !== '' ?
                                    <p className="error-response">{errorMessage}</p>
                                    : ''
                                }
                                {userExist ?
                                    <p>User already Exist</p>
                                    : ''}
                            </div>

                        </Form>
                        : ''
                    }

                    {loader ?
                        <Loader/>
                        : ''
                    }
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
export default SignUp;
