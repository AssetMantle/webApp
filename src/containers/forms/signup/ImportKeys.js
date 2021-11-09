import React, {useState} from 'react';
import {Button, Form, Modal, Tab, Tabs} from 'react-bootstrap';
import {useHistory} from 'react-router-dom';
import transactions from '../../../utilities/Helpers/transactions';
import {createStore, createWallet,} from 'persistencejs/build/utilities/keys';
import {useTranslation} from 'react-i18next';
import DownloadLink from 'react-download-link';
import Icon from '../../../icons';
import MnemonicIcon from '../../../assets/images/MnemonicIcon.svg';

const ImportKeys = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const [show, setShow] = useState(true);
    const [showKeystore, setShowKeystore] = useState(false);
    const [showKeystoreResponse, setShowKeystoreResponse] = useState(false);
    const [initialTabs, setInitialTabs] = useState(true);
    const [generateKeystore, setGenerateKeystore] = useState(false);
    const [response, setResponse] = useState({});
    const [showResponse, seShowResponse] = useState(false);
    const [jsonName, setJsonName] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const handleClose = () => {
        setShow(false);
        history.push('/');
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        let userMnemonic;
        const password = e.target.password.value;
        let promise = transactions.PrivateKeyReader(e.target.uploadFile.files[0], password);
        await promise.then(function (result) {
            userMnemonic = result;
        }).catch(err => {
            setErrorMessage(err);
        });
        if (userMnemonic !== undefined) {
            const wallet = await transactions.MnemonicWalletWithPassphrase(userMnemonic, '');
            const address = wallet[1];
            const data = {
                mnemonic: userMnemonic,
                address: address,
            };
            setResponse(data);
            setInitialTabs(false);
            setGenerateKeystore(true);
        }
    };

    const handleSubmitMnemonic = async event => {
        event.preventDefault();
        const id = document.getElementById('mnemonic').value;
        let mnemonic = transactions.mnemonicTrim(id).toString();
        let memoCheck = transactions.mnemonicValidation(mnemonic);
        if (!memoCheck) {
            setErrorMessage("Error in mnemonic");
        } else {
            const error = createWallet(mnemonic, '');
            if (error.error != null) {
                setErrorMessage(error.error);
            } else {
                const walletResponse = transactions.MnemonicWalletWithPassphrase(mnemonic, '');
                await walletResponse.then(function (result) {
                    const address = result[1];
                    const data = {
                        mnemonic: mnemonic,
                        address: address,
                    };
                    setResponse(data);
                    setInitialTabs(false);
                    setGenerateKeystore(true);
                }).catch(err => {
                    setErrorMessage(err);
                });
            }
        }

    };

    const KeyStoreGenerateHandler = () => {
        setGenerateKeystore(false);
        setShowKeystore(true);
    };

    const KeyStoreGenerateButton = () => {
        setGenerateKeystore(false);
        seShowResponse(true);
    };

    const handleSubmitKeystore = async event => {
        event.preventDefault();
        const password = event.target.password.value;
        const create = createStore(response.mnemonic, password);
        if (create.error != null) {
            return (<div>ERROR!!</div>);
        }
        const jsonContent = JSON.stringify(create.Response);
        setJsonName(jsonContent);
        setShowKeystore(false);
        setShowKeystoreResponse(true);
    };

    const backHandler = (item) => {
        if (item === "KeyStoreGenerateHandler") {
            setInitialTabs(true);
            setGenerateKeystore(false);
        } else if (item === "handleSubmitKeystore") {
            setGenerateKeystore(true);
            setShowKeystore(false);
        } else if (item === "handleResult") {
            setGenerateKeystore(true);
            seShowResponse(false);
        }
    };
    const handleTabSelect = () => {
        setErrorMessage("");
    };
    return (
        <div className="accountInfo">
            <Modal show={show} onHide={handleClose}
                className="signup-section login-section key-select" centered>
                {initialTabs ?
                    <>
                        <Modal.Header closeButton>
                            Import Keys
                        </Modal.Header>
                        <Modal.Body className="import-tabs">
                            <Tabs defaultActiveKey="mnemonic"
                                id="uncontrolled-tab-example"
                                className="mb-3" onSelect={handleTabSelect}>
                                <Tab eventKey="mnemonic" title="Use Mnemonic">
                                    <Form onSubmit={handleSubmitMnemonic}>
                                        <Form.Control as="textarea" rows={5}
                                            name="mnemonic"
                                            placeholder="Enter Mnemonic"
                                            id="mnemonic"
                                            required={true}/>
                                        {errorMessage !== '' ?
                                            <div className="login-error"><p
                                                className="error-response">{errorMessage}</p>
                                            </div>
                                            : ''
                                        }
                                        <div className="submitButtonSection">
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                className="button-double-border"
                                            >
                                                {t('SUBMIT')}
                                            </Button>
                                        </div>
                                    </Form>
                                </Tab>
                                <Tab eventKey="keystore"
                                    title="Use Keystore file">
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group>
                                            <Form.File
                                                id="exampleFormControlFile1"
                                                name="uploadFile" accept=".json"
                                                label="upload private key file"
                                                required={true}/>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>{t('DECRYPT_KEY_STORE')}</Form.Label>
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
                                            <p className="error-response"> {errorMessage}</p> : ''}
                                        <div className="submitButtonSection">
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                className="button-double-border"
                                            >
                                                {t('SUBMIT')}
                                            </Button>
                                        </div>
                                    </Form>
                                </Tab>

                            </Tabs>
                        </Modal.Body>
                    </>
                    : ''}

                {generateKeystore ?
                    <>
                        <Modal.Header closeButton>
                            <div className="back-button" onClick={() => backHandler('KeyStoreGenerateHandler')}>
                                <Icon viewClass="arrow-icon"
                                    icon="arrow"/>
                            </div>
                            Import Keys
                        </Modal.Header>
                        <Modal.Body className="import-tabs">
                            <div className="submitButtonSection">
                                <div className="mrt-10 mb-3">
                                    <div className="button-view"
                                        onClick={KeyStoreGenerateHandler}
                                    >
                                        <div className="icon-section">
                                            <div className="icon"><img
                                                src={MnemonicIcon}
                                                alt="MnemonicIcon"/></div>
                                            Generate Keystore file
                                        </div>
                                        <Icon viewClass="arrow-icon"
                                            icon="arrow"/>
                                    </div>
                                </div>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="button-double-border"
                                    onClick={KeyStoreGenerateButton}
                                >
                                    Next
                                </Button>
                            </div>
                        </Modal.Body>
                    </>
                    : ''
                }

                {showKeystore ?
                    <>
                        <Modal.Header closeButton>
                            <div className="back-button" onClick={() => backHandler('handleSubmitKeystore')}>
                                <Icon viewClass="arrow-icon" icon="arrow"/>
                            </div>
                            Import Keys
                        </Modal.Header>
                        <Modal.Body className="import-tabs">
                            <Form onSubmit={handleSubmitKeystore}>
                                <Form.Group>
                                    <Form.Label>{t('DECRYPT_KEY_STORE')}</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="password"
                                        autoComplete="off"
                                        required={true}
                                    />
                                </Form.Group>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="button-double-border"
                                >
                                    Submit
                                </Button>
                            </Form>
                        </Modal.Body>
                    </>
                    : ''
                }
                {showResponse ?
                    <>
                        <Modal.Header closeButton>
                            <div className="back-button" onClick={() => backHandler('handleResult')}>
                                <Icon viewClass="arrow-icon" icon="arrow"/>
                            </div>
                            Import Keys
                        </Modal.Header>
                        <Modal.Body className="import-tabs">
                            <div>

                                <p className="mnemonic-note">({t('SAVE_MNEMONIC')}) </p>
                                <p className="mnemonic-text">{response.mnemonic}</p>
                                <p>{response.address}</p>
                                <Button
                                    variant="primary"
                                    onClick={handleClose}
                                >
                                    {t('Done')}
                                </Button>
                            </div>
                        </Modal.Body>
                    </>
                    :
                    ''
                }

                {showKeystoreResponse ?
                    <>
                        <Modal.Header closeButton>
                            Import Keys
                        </Modal.Header>
                        <Modal.Body className="import-tabs">
                            <div>

                                <p className="mnemonic-note">({t('SAVE_MNEMONIC')}) </p>
                                <p className="mnemonic-text">{response.mnemonic}</p>
                                <p>{response.address}</p>
                                <p className="key-download">
                                    <DownloadLink
                                        label="Download Key File for future use"
                                        filename="key.json"
                                        exportFile={() => `${jsonName}`}
                                    />
                                </p>
                                <Button
                                    onClick={handleClose}
                                    variant="primary"
                                >
                                    {t('Done')}
                                </Button>
                            </div>
                        </Modal.Body>
                    </>
                    :
                    ''
                }
            </Modal>
        </div>
    );
};
export default ImportKeys;
