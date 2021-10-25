import React, {useEffect, useState} from 'react';
import {Form, Button, Modal} from 'react-bootstrap';
import InputField from '../../../components/inputField';
import {useTranslation} from 'react-i18next';
import Loader from '../../../components/loader';
import TransactionOptions from "../login/TransactionOptions";

const DefineOrder = (props) => {
    const [loader, setLoader] = useState(false);
    const [show, setShow] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [externalComponent, setExternalComponent] = useState('');
    const [typeOption, setTypeOption] = useState('order');
    const [totalDefineObject, setTotalDefineObject] = useState({});
    const {t} = useTranslation();
    const [fromID, setFromID] = useState('');
    const [testIdentityId, settestIdentityId] = useState('');

    useEffect(() => {
        let fromIDValue = localStorage.getItem('identityId');
        let testIdentityId = localStorage.getItem('identityId');
        setFromID(fromIDValue);
        settestIdentityId(testIdentityId);

    }, []);

    const handleClose = () => {
        setShow(false);
        props.setExternalComponent('');
    };
    const handleChangeType = evt => {
        setTypeOption(evt.target.value);
    };


    const handleSubmit = (evt) => {
        evt.preventDefault();
        setLoader(true);

        const FromId = evt.target.FromId.value;

        let staticMutables = `propertyName:S|propertyValue`;

        let staticImmutableMeta = `category:S|,name:S|,description:S|`;
        let staticImMutables = `style:S|,type:S|`;

        let mutablePropertyValue = '';
        let mutableMetaPropertyValue = '';
        let immutablePropertyValue = '';
        let immutableMetaPropertyValue = '';

        mutablePropertyValue = staticMutables;

        mutableMetaPropertyValue = 'exchangeRate:D|,expiry:H|,makerOwnableSplit:D|,takerID:I|';

        immutablePropertyValue = staticImMutables;

        immutableMetaPropertyValue = staticImmutableMeta;

        if (mutablePropertyValue !== '') {
            if (mutableMetaPropertyValue !== '') {
                let totalData = {
                    fromID: FromId,
                    mutablePropertyValue: mutablePropertyValue,
                    immutablePropertyValue: immutablePropertyValue,
                    mutableMetaPropertyValue: mutableMetaPropertyValue,
                    immutableMetaPropertyValue: immutableMetaPropertyValue,
                };
                console.log(totalData);
                setTotalDefineObject(totalData);
                setExternalComponent('Keystore');
                setShow(false);
                setLoader(false);
            } else {
                setErrorMessage(t('ADD_MUTABLE_META_PROPERTY'));
                setLoader(false);
            }
        } else {
            setErrorMessage(t('ADD_MUTABLE_PROPERTY'));
            setLoader(false);
        }

    };


    return (
        <div>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    {props.FormName}
                </Modal.Header>
                {loader ?
                    <Loader/>
                    : ''
                }
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>{t('FROM_ID')}*</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="FromId"
                                required={true}
                                defaultValue={fromID !== null ? fromID : testIdentityId}
                                placeholder={t('FROM_ID')}
                            />
                        </Form.Group>

                        <Form.Group className="hidden">
                            <Form.Label>Immutable type:S|* </Form.Label>
                            <Form.Control as="select" name="type"
                                required={true}
                                onChange={handleChangeType}>
                                <option
                                    value="identity">{t('IDENTITY')}</option>
                                <option value="asset">{t('ASSET')}</option>
                                <option value="order">{t('ORDER')}</option>
                            </Form.Control>
                        </Form.Group>


                        <Form.Group >
                            <Form.Label>Category</Form.Label>
                            <Form.Control as="select" name="category"
                                required={false}>
                                <option
                                    value="arts">{t('ARTS')}</option>
                                <option value="virtual">{t('VIRTUAL_CARDS')}</option>
                                <option value="3d">{t('3D')}</option>
                                <option value="music">{t('MUSIC')}</option>
                                <option value="collectibles">{t('COLLECTIBLES')}</option>
                            </Form.Control>
                        </Form.Group>
                        <InputField
                            type="text"
                            className=""
                            name="name"
                            required={false}
                            placeholder="Name"
                            label="Name"
                            disabled={false}
                        />
                        <InputField
                            type="text"
                            className=""
                            name="description"
                            required={false}
                            placeholder="Description"
                            label="Description"
                            disabled={false}
                        />
                        {typeOption === 'order'
                            ?
                            <>
                                <InputField
                                    type="text"
                                    className=""
                                    name="MutableexchangeRate"
                                    required={true}
                                    placeholder="exchangeRate"
                                    label="Mutable exchangeRate:D|"
                                    value={-1}
                                    disabled={true}
                                />
                                <InputField
                                    type="text"
                                    className=""
                                    name="Mutableexpiry"
                                    required={true}
                                    placeholder="expiry"
                                    label="Mutable expiry:H|"
                                    value={-1}
                                    disabled={true}
                                />
                                <InputField
                                    type="text"
                                    className=""
                                    name="MutablemakerOwnableSplit"
                                    required={true}
                                    placeholder="makerOwnableSplit"
                                    label="Mutable makerOwnableSplit:D|"
                                    value={-1}
                                    disabled={true}
                                />
                                <InputField
                                    type="text"
                                    className="hidden"
                                    name="MutabletakerID"
                                    required={true}
                                    placeholder="takerID"
                                    label="takerID:I|asdf"
                                    value={-1}
                                    disabled={true}
                                />
                            </>
                            : ''
                        }


                        {errorMessage !== '' ?
                            <p className="error-response">{errorMessage}</p>
                            : ''
                        }
                        <div className="submitButtonSection">
                            <Button variant="primary" type="submit"
                                id="defineSubmitButton">
                                {t('SUBMIT')}
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            <div>
                {
                    externalComponent === 'Keystore' ?
                        <TransactionOptions
                            setExternalComponent={setExternalComponent}
                            totalDefineObject={totalDefineObject}
                            TransactionName={props.FormName}
                            ActionName={props.ActionName}
                            setShow={setShow}
                            handleClose={handleClose}
                        /> :
                        null
                }

            </div>
        </div>
    );
};

export default DefineOrder;
