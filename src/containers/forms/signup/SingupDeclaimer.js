import React, {useState} from 'react';
import {Button, Form, Modal} from 'react-bootstrap';
import InputField from '../../../components/inputField';
import {useTranslation} from 'react-i18next';
import Loader from '../../../components/loader';
import {useHistory} from "react-router-dom";
import TransactionOptions from "../login/TransactionOptions";
import TransactionBar from "../../../components/TransactionBar";

const CreateIdentity = () => {
    const [externalComponent, setExternalComponent] = useState('');
    const [loader, setLoader] = useState(false);
    const [show, setShow] = useState(true);
    const {t} = useTranslation();
    const history = useHistory();

    const handleClose = () => {
        setShow(false);
        history.push('/');
    };
    return (
        <div>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
            >
                <div>
                    {loader ?
                        <Loader/>
                        : ''
                    }
                </div>
                <Modal.Header closeButton>
                    {t('SIGN_UP')}
                </Modal.Header>
                <Modal.Body>

                    <TransactionBar/>
                </Modal.Body>
            </Modal>
            <div>
                {
                    externalComponent === 'Keystore' ?
                        <TransactionOptions
                            setExternalComponent={setExternalComponent}
                            totalDefineObject={totalDefineObject}
                            TransactionName={'nubid'}
                            setShow={setShow}
                            setLoader={setLoader}
                            userName={userName}
                            handleClose={handleClose}
                        /> :
                        null
                }
            </div>
        </div>
    );
};

export default CreateIdentity;

