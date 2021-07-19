import React, {useState, useEffect} from 'react';
import {Form, Button, Modal} from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import Loader from '../../../components/loader';
import CommonKeystore from '../../../actions/forms/login/CommonKeystore';

const UnWrap = (props) => {
    const [show, setShow] = useState(true);
    const [loader, setLoader] = useState(false);
    const {t} = useTranslation();
    const [fromID, setFromID] = useState('');
    const [testIdentityId, settestIdentityId] = useState('');
    const [totalDefineObject, setTotalDefineObject] = useState({});
    const [externalComponent, setExternalComponent] = useState('');

    useEffect(() => {
        let fromIDValue = localStorage.getItem('identityId');
        let testIdentityId = localStorage.getItem('identityId');
        settestIdentityId(testIdentityId);
        setFromID(fromIDValue);
    }, []);

    const handleSubmit = (event) => {
        setLoader(true);
        event.preventDefault();
        const FromId = event.target.FromId.value;
        const OwnableId = event.target.OwnableId.value;
        const Split = event.target.Split.value;
        let totalData = {
            fromID: FromId,
            Split: Split,
            OwnableId: OwnableId,
        };
        setTotalDefineObject(totalData);
        setExternalComponent('Keystore');
        setShow(false);
        setLoader(false);
    };
    const handleClose = () => {
        setShow(false);
        props.setExternalComponent('');
    };
    return (
        <div>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    {props.FormName}
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
                            <Form.Label>{t('FROM_ID')}* </Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="FromId"
                                defaultValue={fromID !== null ? fromID : testIdentityId}
                                required={true}
                                placeholder="FromId"
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>{t('OWNABLE_ID')}* </Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="OwnableId"
                                required={true}
                                placeholder="Ownable Id"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{t('SPLIT')}* </Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="Split"
                                required={true}
                                placeholder="Split"
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
            <div>
                {
                    externalComponent === 'Keystore' ?
                        <CommonKeystore
                            setExternalComponent={setExternalComponent}
                            totalDefineObject={totalDefineObject}
                            TransactionName={'unwrap'}
                            handleClose={handleClose}
                        /> :
                        null
                }
            </div>
        </div>
    );
};

export default UnWrap;
