import React, {useState} from 'react';
import {Button, Form, Modal} from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import Loader from '../../../components/loader';
import TransactionOptions from "../login/TransactionOptions";

const CancelOrder = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [loader, setLoader] = useState(false);
    const [externalComponent, setExternalComponent] = useState('');
    const [totalDefineObject, setTotalDefineObject] = useState({});
    const handleSubmit = (event) => {
        setLoader(true);
        event.preventDefault();
        let totalData = {
            fromID: props.order.makerID,
            orderID: props.order.orderID,
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
                    {t('ORDER_CANCEL')}
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
                    <TransactionOptions
                        setExternalComponent={setExternalComponent}
                        totalDefineObject={totalDefineObject}
                        TransactionName={'cancel order'}
                        handleClose={handleClose}
                        setShow={setShow}
                    /> :
                    null
            }
        </div>
    );
};

export default CancelOrder;
