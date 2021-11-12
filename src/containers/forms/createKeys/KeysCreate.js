import React, {useState} from 'react';
import {Button, Form, Modal} from 'react-bootstrap';
import {createStore,} from 'persistencejs/build/utilities/keys';
import DownloadLink from 'react-download-link';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import Loader from '../../../components/loader';
import Icon from '../../../icons';
import ImportKeys from '../signup/ImportKeys';
import transactions from "../../../utilities/Helpers/transactions";
import SignUp from "./SignUp";
import ModalCommon from "../../../components/modal";
import helper from "../../../utilities/helper";
const KeysCreate = (props) => {
    const [loader, setLoader] = useState(false);
    const {t} = useTranslation();
    const history = useHistory();
    const [show, setShow] = useState(true);
    const [jsonName, setJsonName] = useState({});
    const [showEncrypt, setShowEncrypt] = useState(false);
    const [mnemonic, setMnemonic] = useState('');
    const [formName, setFormName] = useState('');
    const [address, setAddress] = useState('');
    const [showDownload, setShowDownload] = useState(false);
    const [showDownloadModal, setshowDownloadModal] = useState(true);
    const [externalComponent, setExternalComponent] = useState("");
    const [signUpError, setSignUpError] = useState("");

    const [testID, setTestID] = useState('');
    const [nubID, setNubID] = useState('');
    const [response, setResponse] = useState({});
    
    const handleClose = () => {
        setShow(false);
        history.push('/');
    };

    const handleCloseEncrypt = () => {
        setShowEncrypt(false);
        history.push('/');
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        if(password.length > 3) {
            const error = await transactions.MnemonicWallet();
            if (error.error != null) {
                return (<div>ERROR!!</div>);
            }
            const create = createStore(error[0].mnemonic, password);
            if (create.error != null) {
                return (<div>ERROR!!</div>);
            } else {
                const jsonContent = JSON.stringify(create.Response);
                setJsonName(jsonContent);
                setAddress(error[1]);
                setMnemonic(error[0].mnemonic);
                setShowEncrypt(true);
                setshowDownloadModal(false);
                setShowDownload(true);
                handleFaucet(error[1]);
            }
        }else {
            setSignUpError("Password length must be greater than 3");
        }
    };

    const handleFaucet = (loginAddress) => {
        setLoader(true);
        axios.post(process.env.REACT_APP_FAUCET_SERVER + '/faucetRequest', {address: loginAddress})
            .then(response => {
                setTimeout(() => {
                    setLoader(false);
                }, 4000);
            },
            )
            .catch(err => {
                setLoader(false);
            });
    };
    const handleEncrypt = (name) => {
        setShow(false);
        setFormName(name);
        setShowEncrypt(true);
    };

    const handleRoute = (name) => {
        setShow(false);
        setExternalComponent(name);
    };
    const backHandler = (item) => {
        if (item === "mainPage") {
            setShow(false);
            props.setShow(true);
            props.setExternalComponent("");
        } else if (item === "create") {
            setShowEncrypt(false);
            setShow(true);
        }
    };

    return (
        <div>
            <Modal show={show} onHide={handleClose} className="signup-section"
                centered>
                <Modal.Header closeButton>
                    <div className="back-button" onClick={() => backHandler("mainPage")}>
                        <Icon viewClass="arrow-icon" icon="arrow"/>
                    </div>
                    {t('CREATE_KEYS')}
                </Modal.Header>
                <Modal.Body className="text-center">
                    <div>
                        <Button
                            variant="primary"
                            className="button-signup-mnemonic button-signup"
                            onClick={() => handleEncrypt('Create Keys')}
                        >
                            {t('CREATE_KEYS')}
                        </Button>
                        <Button
                            variant="primary"
                            className="button-signup-mnemonic button-signup"
                            onClick={() => handleRoute('import')}
                        >
                            {t('IMPORT_KEYS')}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal
                show={showEncrypt}
                onHide={handleCloseEncrypt}
                centered
                className="signup-section"
            >
                <Modal.Header closeButton>
                    <div className="back-button" onClick={() => backHandler("create")}>
                        <Icon viewClass="arrow-icon" icon="arrow"/>
                    </div>
                    {formName}
                </Modal.Header>
                <Modal.Body className="private-key">
                    {showDownloadModal ?
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="m-0">
                                <Form.Label>{t('ENCRYPT_KEY_STORE')}</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="password"
                                    onKeyPress={helper.handleChangePassword}
                                    required={true}
                                />
                            </Form.Group>
                            <div className="error-section"><p className="error-response">
                                {signUpError !== "" ?
                                    signUpError
                                    : ""
                                }
                            </p>
                            </div>
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
                        <div className="text-center">
                            <p className="mnemonic-note">({t('SAVE_MNEMONIC')}) </p>
                            <p className="mnemonic-text">{mnemonic}</p>
                            <p className="new-address">{address}</p>
                            <p className="key-download">
                                <DownloadLink
                                    label="Download Key File for future use"
                                    filename={`${props.totalDefineObject.nubId}.json`}
                                    exportFile={() => `${jsonName}`}
                                />
                                <Icon viewClass="arrow-icon download-icon" icon="download-arrow"/>
                            </p>
                            <SignUp setSignUpError={setSignUpError}
                                setShowEncrypt={setShowEncrypt}
                                mnemonic={mnemonic}
                                totalDefineObject={props.totalDefineObject}
                                setTestID={setTestID}
                                setNubID={setNubID}
                                setLoader={setLoader}
                                setResponse={setResponse}
                                TransactionName={props.TransactionName}
                            />
                        </div>
                        :
                        ''
                    }

                    {loader ?
                        <Loader/>
                        : ''
                    }
                </Modal.Body>
            </Modal>
            {
                externalComponent === 'import' ?
                    <ImportKeys
                        setExternalComponent={setExternalComponent}
                        totalDefineObject={props.totalDefineObject}
                        setShow={setShow}
                    /> :
                    null
            }
            {!(Object.keys(response).length === 0) ?
                <ModalCommon
                    data={response}
                    handleClose={handleCloseEncrypt}
                    testID={testID}
                    transactionName={props.TransactionName}
                    nubID={nubID}
                />
                : ""
            }
        </div>
    );
};
export default KeysCreate;
