import React, {useState} from 'react';
import {Form, Button, Modal} from 'react-bootstrap';
import InputField from '../../../components/inputField';
import {useTranslation} from 'react-i18next';
import Loader from '../../../components/loader';
import CommonKeystore from '../login/CommonKeystore';


const Provision = (props) => {

    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [loader, setLoader] = useState(false);
    const fromID = localStorage.getItem('identityId');
    const [totalDefineObject, setTotalDefineObject] = useState({});
    const [externalComponent, setExternalComponent] = useState('');
    const handleSubmit = (event) => {
        setLoader(true);
        event.preventDefault();
        const toAddress = event.target.toAddress.value;
        let totalData = {
            identityId: fromID,
            to: toAddress,
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
                    {t('PROVISION')}
                </Modal.Header>
                <div>
                    {loader ?
                        <Loader/>
                        : ''
                    }
                </div>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <InputField
                            type="text"
                            className=""
                            name="toAddress"
                            required={true}
                            placeholder="Input Address"
                            label="New Address to Provision"
                            disabled={false}
                        />
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
                        TransactionName={'provision'}
                        handleClose={handleClose}
                        setShow={setShow}
                    /> :
                    null
            }
        </div>
    );
};

export default Provision;
