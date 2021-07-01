import React, {useState, useEffect} from 'react';
import {Form, Button, Modal} from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import Loader from '../../../components/loader';
import CommonKeystore from '../../../actions/forms/login/CommonKeystore';


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
        // const WrapResponse = WrapQuery.wrap(userAddress, "test", userTypeToken, FromId, CoinAmount + CoinDenom, config.feesAmount, config.feesToken, config.gas, config.mode);
        // WrapResponse.then(function (item) {
        //     const data = JSON.parse(JSON.stringify(item));
        //     setResponse(data)
        //     setShow(false);
        //     setLoader(false)
        // })
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

                        <Form.Group>
                            <Form.Label>{t('COIN_DENOM')}* </Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="CoinDenom"
                                required={true}
                                placeholder="Coin Denom"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{t('COIN_AMOUNT')}*</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="CoinAmount"
                                required={true}
                                placeholder="Coin Amount"
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
                            TransactionName={'wrap'}
                            handleClose={handleClose}
                        /> :
                        null
                }
            </div>
        </div>
    );
};

export default Wrap;
