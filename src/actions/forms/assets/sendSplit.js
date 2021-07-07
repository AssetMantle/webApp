import React, {useState} from 'react';
import {Form, Button, Modal} from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import Loader from '../../../components/loader';
import CommonKeystore from '../login/CommonKeystore';

const SendSplit = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [loader, setLoader] = useState(false);
    const [externalComponent, setExternalComponent] = useState('');
    const [totalDefineObject, setTotalDefineObject] = useState({});

    const handleClose = () => {
        setShow(false);
        props.setExternalComponent('');
    };

    const handleSubmit = (event) => {
        setLoader(true);
        event.preventDefault();
        let totalData = {
            fromID: props.ownerId,
            IdentityID: event.target.IdentityID.value,
            ownableId: props.ownableId,
            splitAmount: event.target.splitAmount.value,
        };
        setTotalDefineObject(totalData);
        setExternalComponent('Keystore');
        setShow(false);
    };

    return (
        <div>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    {t('SEND')}
                </Modal.Header>
                <div>
                    {loader ?
                        <Loader/>
                        : ''
                    }
                </div>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>{t('SEND_TO_ID')}* </Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="IdentityID"
                                required={true}
                                placeholder="IdentityID"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{t('SPLIT_AMOUNT')}* </Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="splitAmount"
                                required={true}
                                placeholder="splitAmount"
                            />
                        </Form.Group>
                        <div className="submitButtonSection">
                            <Button variant="primary" type="submit">
                                {t('SUBMIT')}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            {
                externalComponent === 'Keystore' ?
                    <CommonKeystore
                        setExternalComponent={setExternalComponent}
                        totalDefineObject={totalDefineObject}
                        TransactionName={'send splits'}
                        handleClose={handleClose}
                    /> :
                    null
            }
        </div>
    );
};

export default SendSplit;
