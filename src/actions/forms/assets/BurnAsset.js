import React, {useState} from 'react';
import {Form, Button, Modal} from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import Loader from '../../../components/loader';

import CommonKeystore from '../login/CommonKeystore';

const BurnAsset = (props) => {
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
            assetId: props.ownableId,
        };
        setTotalDefineObject(totalData);
        setExternalComponent('Keystore');
        setShow(false);
        setLoader(false);
    };

    return (
        <div>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    {t('BURN_ASSET')}
                </Modal.Header>
                <div>
                    {loader ?
                        <Loader/>
                        : ''
                    }
                </div>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}
                        className="burn-confirmation-buttons">
                        <p>{t('ARE_YOU_SURE')}</p>
                        <Button variant="primary" type="submit">
                            {t('YES')}
                        </Button>
                        <Button variant="secondary" onClick={handleClose}>
                            {t('NO')}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            {
                externalComponent === 'Keystore' ?
                    <CommonKeystore
                        setExternalComponent={setExternalComponent}
                        totalDefineObject={totalDefineObject}
                        TransactionName={'burn asset'}
                        handleClose={handleClose}
                    /> :
                    null
            }
        </div>
    );
};

export default BurnAsset;
