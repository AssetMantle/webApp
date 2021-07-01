import React, {useState} from 'react';
import {Form, Button, Modal} from 'react-bootstrap';
import GetID from '../../../utilities/Helpers/getID';
import {useTranslation} from 'react-i18next';
import Loader from '../../../components/loader';
import CommonKeystore from '../login/CommonKeystore';

const CancelOrder = (props) => {
    const GetIDHelper = new GetID();
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [loader, setLoader] = useState(false);
    const [externalComponent, setExternalComponent] = useState('');
    const [totalDefineObject, setTotalDefineObject] = useState({});
    const handleSubmit = (event) => {
        setLoader(true);
        event.preventDefault();
        let totalData = {
            fromID: props.order.value.id.value.makerID.value.idString,
            orderID: GetIDHelper.GetOrderID(props.order),
        };
        setTotalDefineObject(totalData);
        setExternalComponent('Keystore');
        setShow(false);

        setLoader(false);
        // const userTypeToken = localStorage.getItem('mnemonic');
        // const userAddress = localStorage.getItem('address');
        // const cancelOrderResponse = ordersCancel.cancel(userAddress, "test", userTypeToken, props.order.value.id.value.makerID.value.idString, GetIDHelper.GetOrderID(props.order), config.feesAmount, config.feesToken, config.gas, config.mode);
        // cancelOrderResponse.then(function (item) {
        //     const data = JSON.parse(JSON.stringify(item));
        //     setResponse(data);
        //     setShow(false);
        //     setLoader(false);
        // });
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
                    <CommonKeystore
                        setExternalComponent={setExternalComponent}
                        totalDefineObject={totalDefineObject}
                        TransactionName={'cancel order'}
                        handleClose={handleClose}
                    /> :
                    null
            }
        </div>
    );
};

export default CancelOrder;
