import React, {useState} from 'react';
import {Modal, Form, Button} from 'react-bootstrap';
import {
    createStore,
} from 'persistencejs/build/utilities/keys';
import DownloadLink from 'react-download-link';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import Loader from '../../../components/loader';
import Icon from '../../../icons';
import ImportKeys from './ImportKeys';
import transactions from "../../../utilities/Helpers/transactions";

const KeysCreate = (props) => {
    const [loader, setLoader] = useState(false);
    // const userAddress = localStorage.getItem('address');
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
        const error = await transactions.MnemonicWallet();
        console.log(error);
        if (error.error != null) {
            return (<div>ERROR!!</div>);
        }
        const create = createStore(error[0].mnemonic, password);
        if (create.error != null) {
            return (<div>ERROR!!</div>);
        }else {
            const jsonContent = JSON.stringify(create.Response);
            // localStorage.setItem('address', error.address);
            // localStorage.setItem('mnemonic', error.mnemonic);
            setJsonName(jsonContent);
            setAddress(error[1]);
            setMnemonic(error[0].mnemonic);
            setShowEncrypt(true);
            setshowDownloadModal(false);
            setShowDownload(true);
            handleFaucet(error[1]);
        }
    };
    
    const handleFaucet = (loginAddress) => {
        setLoader(true);
        axios.post(process.env.REACT_APP_FAUCET_SERVER + '/faucetRequest', {address: loginAddress})
            .then(response => {
                console.log(response, "facuet response", loginAddress);
                setLoader(false);
            },
            )
            .catch(err => {
                console.log(err);
                setLoader(false);
            });

        // setShowDownload(false);
        // setshowDownloadModal(false);
        // setShowEncrypt(false);
        // history.push('/');
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
        if(item === "mainPage"){
            setShow(false);
            props.setShow(true);
            props.setExternalComponent("");
        }else if(item === "create"){
            setShowEncrypt(false);
            setShow(true);
        }
    };

    return (
        <div>
            <Modal show={show} onHide={handleClose} className="signup-section"
                centered>
                <Modal.Header closeButton>
                    <div className="back-button" onClick={()=>backHandler("mainPage")}>
                        <Icon viewClass="arrow-icon" icon="arrow"/>
                    </div>
                    {t('Create Keys')}
                </Modal.Header>
                <Modal.Body className="text-center">
                    <div>
                        <Button
                            variant="primary"
                            className="button-signup-mnemonic button-signup"
                            onClick={() => handleEncrypt('SignUp with PrivateKey')}
                        >
                            Create Keys
                        </Button>
                        <Button
                            variant="primary"
                            className="button-signup-mnemonic button-signup"
                            onClick={() => handleRoute('import')}
                        >
                            Import Keys
                        </Button>
                        {/*<Button*/}
                        {/*    variant="primary"*/}
                        {/*    className="button-signup button-signup-ledger disabled"*/}
                        {/*>*/}
                        {/*    {t('LEDGER_STORE')}*/}
                        {/*</Button>*/}
                    </div>
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
                    <div className="back-button" onClick={()=>backHandler("create")}>
                        <Icon viewClass="arrow-icon" icon="arrow"/>
                    </div>
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
                            {/*<Button*/}
                            {/*    variant="primary"*/}
                            {/*    onClick={handleFaucet}*/}
                            {/*>*/}
                            {/*    {t('SUBMIT')}*/}
                            {/*</Button>*/}
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
                    <ImportKeys setExternalComponent={setExternalComponent}/> :
                    null
            }
        </div>
    );
};
export default KeysCreate;