import React, {useEffect, useState} from 'react';
import {Button, Form, Modal} from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import Loader from '../../../components/loader';
import TransactionOptions from "../login/TransactionOptions";
import config from "../../../config";

const Wrap = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [loader, setLoader] = useState(false);
    const [externalComponent, setExternalComponent] = useState('');
    const [totalDefineObject, setTotalDefineObject] = useState({});
    const [fromID, setFromID] = useState('');
    const [testIdentityId, settestIdentityId] = useState('');
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
        const CoinDenom = event.target.CoinDenom.value;

        const CoinAmount = event.target.CoinAmount.value;
        let totalData = {
            fromID: FromId,
            CoinAmountDenom: CoinAmount + CoinDenom,
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
                                defaultValue={fromID !== null ? fromID : testIdentityId}
                                name="FromId"
                                required={true}
                                placeholder="FromId"
                            />
                        </Form.Group>

                        <Form.Group className="hidden">
                            <Form.Label>{t('COIN_DENOM')}* </Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="CoinDenom"
                                required={true}
                                defaultValue={config.coinDenom}
                                placeholder="Coin Denom"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{t('AMOUNT')}*</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="CoinAmount"
                                required={true}
                                placeholder="Amount"
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
                        <TransactionOptions
                            setExternalComponent={setExternalComponent}
                            totalDefineObject={totalDefineObject}
                            TransactionName={'wrap'}
                            handleClose={handleClose}
                            setShow={setShow}
                        /> :
                        null
                }
            </div>
        </div>
    );
};

export default Wrap;
