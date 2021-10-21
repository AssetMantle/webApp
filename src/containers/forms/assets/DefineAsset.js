import React, {useEffect, useState} from 'react';
import {Form, Button, Modal} from 'react-bootstrap';
import InputField from '../../../components/inputField';
import {useTranslation} from 'react-i18next';
import Loader from '../../../components/loader';
import TransactionOptions from "../login/TransactionOptions";

const DefineAsset = (props) => {
    const [loader, setLoader] = useState(false);
    const [show, setShow] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [externalComponent, setExternalComponent] = useState('');
    const [typeOption, setTypeOption] = useState('asset');
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
        let uriMutable = '';

        const propertyName = evt.target.propertyName.value;
        const propertyValue = evt.target.propertyValue.value;
        let staticMutables = `${propertyName}:S|${propertyValue},type:S|`;

        let staticImmutableMeta = `name:S|,description:S|,category:S|`;
        let staticImMutables = `style:S|`;

        uriMutable = `URI:S|`;

        let mutablePropertyValue = '';
        let mutableMetaPropertyValue = '';
        let immutablePropertyValue = '';
        let immutableMetaPropertyValue = '';

        mutablePropertyValue = 'burn:H|,lock:H|';

        mutableMetaPropertyValue = staticMutables;

        immutablePropertyValue = staticImMutables + ',' + uriMutable;

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

                        <Form.Group>
                            <Form.Label>{t('URI')}</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="URI"
                                required={false}
                                placeholder={t('URI')}
                            />
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
                        {typeOption === 'asset'
                            ?
                            <>
                                <InputField
                                    type="text"
                                    className="hidden"
                                    name="MutableBurn"
                                    required={true}
                                    value={-1}
                                    placeholder="Trait Value"
                                    label="Mutable burn:H|"
                                    disabled={true}
                                />
                                <InputField
                                    type="text"
                                    className="hidden"
                                    name="MutableLock"
                                    required={true}
                                    value={-1}
                                    placeholder="Trait Value"
                                    label="Mutable lock:H|"
                                    disabled={true}
                                />
                            </>
                            : ''
                        }

                        <Form.Group className="hidden">
                            <Form.Label>Attributes</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="propertyName"
                                required={false}
                                value="propertyName"
                                placeholder="Property"
                            />
                            <Form.Control
                                type="text"
                                className=""
                                name="propertyValue"
                                value="propertyValue"
                                required={false}
                                placeholder="Value"

                            />
                        </Form.Group>

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

export default DefineAsset;
