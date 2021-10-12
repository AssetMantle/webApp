import React, {useState, useEffect} from 'react';
import {Form, Button, Modal} from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import Loader from '../../../components/loader';
import TransactionOptions from "../login/TransactionOptions";


const UnProvision = (props) => {
    const [show, setShow] = useState(true);
    const [loader, setLoader] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [provisionAddressList, setProvisionAddressList] = useState([]);
    const [totalDefineObject, setTotalDefineObject] = useState({});
    const [externalComponent, setExternalComponent] = useState('');
    const {t} = useTranslation();
    const fromID = localStorage.getItem('identityId');
    useEffect(() => {
        const provisionedAddressList = props.userList.value.provisionedAddressList;
        if (provisionedAddressList !== null) {
            provisionedAddressList.map((address) => {
                setProvisionAddressList((provisionAddressList) => [
                    ...provisionAddressList,
                    address,
                ]);
            });
        }
    }, []);
    const handleClose = () => {
        setShow(false);
        props.setExternalComponent('');
    };
    const handleSubmit = (event) => {
        setLoader(true);
        event.preventDefault();
        const selectValue = event.target.selectAddress.value;

        let totalData = {
            identityId: fromID,
            to: selectValue,
        };
        setTotalDefineObject(totalData);
        setExternalComponent('Keystore');
        setShow(false);
        setLoader(false);
    };
    const handleSelectChange = (evt) => {
        setSelectedAddress(evt.target.value);
    };
    return (
        <div>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    {t('UN_PROVISION')}
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
                            <Form.Label>{t('ADDRESS_TO_UN_PROVISION')}*</Form.Label>
                            <Form.Control
                                as="select"
                                name="selectAddress"
                                value={selectedAddress}
                                onChange={handleSelectChange}
                            >
                                {provisionAddressList.map((address, index) => {
                                    return (
                                        <option key={index} value={address}>
                                            {address}
                                        </option>
                                    );
                                })}
                            </Form.Control>
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
                    <TransactionOptions
                        setExternalComponent={setExternalComponent}
                        totalDefineObject={totalDefineObject}
                        TransactionName={'un provision'}
                        handleClose={handleClose}
                        setShow={setShow}
                    /> :
                    null
            }
        </div>
    );
};

export default UnProvision;
