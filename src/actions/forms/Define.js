import React, {useEffect, useState} from 'react';
import {Form, Button, Modal} from 'react-bootstrap';
import InputField from '../../components/inputField';
import {useTranslation} from 'react-i18next';
import CommonKeystore from '../../actions/forms/login/CommonKeystore';
import CommonKeystorePwd from '../../actions/forms/login/CommonKeystorePwd';
import Loader from '../../components/loader';
import GetProperty from '../../utilities/Helpers/getProperty';


const Define = (props) => {
    const PropertyHelper = new GetProperty();
    const [loader, setLoader] = useState(false);
    const [show, setShow] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [externalComponent, setExternalComponent] = useState('');
    const [typeOption, setTypeOption] = useState('identity');
    const [mutableStyle, setMutableStyle] = useState('Blue');
    const [mutableProperties, setMutableProperties] = useState([]);
    const [immutableProperties, setImmutableProperties] = useState([]);
    const [inputValues, setInputValues] = useState([]);
    const [metaCheckboxList, setMetaCheckboxList] = useState([]);
    const [uriField, setUriField] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Mutable');
    const [totalDefineObject, setTotalDefineObject] = useState({});
    const [immutableMetaCheckboxList, setImmutableMetaCheckboxList] = useState([]);
    const {t} = useTranslation();
    const [fromID, setFromID] = useState('');
    const [testIdentityId, settestIdentityId] = useState('');

    useEffect(() => {
        let fromIDValue = localStorage.getItem('identityId');
        let testIdentityId = localStorage.getItem('identityId');
        setFromID(fromIDValue);
        settestIdentityId(testIdentityId);

    }, []);

    const handleChange = evt => {
        const newValue = evt.target.value;
        setInputValues({...inputValues, [evt.target.name]: newValue});
    };
    const handleChangeMutable = (evt, idx) => {
        const newValue = evt.target.value;
        const selectValue = document.getElementById('MutableDataType' + idx).value;
        const checkError = PropertyHelper.DataTypeValidation(selectValue, newValue);
        PropertyHelper.showHideDataTypeError(checkError, `MutableDefine${idx}`);
        setInputValues({...inputValues, [evt.target.name]: newValue});
    };

    const handleChangeImmutable = (evt, idx) => {
        const newValue = evt.target.value;
        const selectValue = document.getElementById('ImmutableDataType' + idx).value;
        const checkError = PropertyHelper.DataTypeValidation(selectValue, newValue);
        PropertyHelper.showHideDataTypeError(checkError, `ImmutableDefine${idx}`);
        setInputValues({...inputValues, [evt.target.name]: newValue});
    };

    const handleClose = () => {
        setShow(false);
        props.setExternalComponent('');
    };
    const handleChangeType = evt => {
        setTypeOption(evt.target.value);
    };
    const handleChangeStyle = evt => {
        setMutableStyle(evt.target.value);
    };

    const handleSelectChange = evt => {
        const newValue = evt.target.value;
        setInputValues({...inputValues, [evt.target.name]: newValue});

    };

    const addMutableMeta = (evt, val) => {
        const checkedValue = evt.target.checked;
        let checkboxname = `MutableDataName${val}`;
        if (checkedValue) {
            setMetaCheckboxList((metaCheckboxList) => [...metaCheckboxList, checkboxname]);
        } else {

            if (metaCheckboxList.length && metaCheckboxList.includes(checkboxname)) {
                setMetaCheckboxList(metaCheckboxList.filter(item => item !== checkboxname));
            }
        }
    };
    const addImmutableMeta = (evt, val) => {
        const checkedValue = evt.target.checked;
        let checkboxname = `ImmutableDataName${val}`;
        if (checkedValue) {
            setImmutableMetaCheckboxList((immutableMetaCheckboxList) => [...immutableMetaCheckboxList, checkboxname]);
        } else {
            if (immutableMetaCheckboxList.length && immutableMetaCheckboxList.includes(checkboxname)) {
                setImmutableMetaCheckboxList(immutableMetaCheckboxList.filter(item => item !== checkboxname));
            }
        }
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();
        setLoader(true);


        let assetSpecificMutables = '';
        if (typeOption === 'asset') {
            assetSpecificMutables = 'burn:H|,lock:H|';
        }
        let orderSpecificMutables = '';
        if (typeOption === 'order') {
            orderSpecificMutables = 'exchangeRate:D|,expiry:H|,makerOwnableSplit:D|,takerID:I|';
        }
        const FromId = evt.target.FromId.value;
        let staticImmutableMeta = '';
        let uriMutable = '';
        let uriImmutable = '';
        const ImmutableDescription = evt.target.ImmutableDescription.value;
        const ImmutableIdentifier = evt.target.ImmutableIdentifier.value;
        const ImmutableClassifier = evt.target.ImmutableClassifier.value;
        let staticImmutables = `style:S|${mutableStyle},type:S|${typeOption}`;
        staticImmutableMeta = `classifier:S|${ImmutableClassifier},identifier:S|${ImmutableIdentifier},description:S|${ImmutableDescription}`;
        if (uriField) {
            const ImmutableUrl = evt.target.URI.value;
            let ImmutableUrlEncode = '';
            if (ImmutableUrl !== '') {
                ImmutableUrlEncode = PropertyHelper.getUrlEncode(ImmutableUrl);
            }
            if (selectedOption === 'Immutable') {
                uriImmutable = `URI:S|${ImmutableUrlEncode}`;
            } else {
                uriMutable = `URI:S|${ImmutableUrlEncode}`;
            }
        }
        let mutablePropertyValue = '';
        let mutableMetaPropertyValue = '';
        let immutablePropertyValue = '';
        let immutableMetaPropertyValue = '';

        mutablePropertyValue = PropertyHelper.MutablePropertyValues(mutableProperties, inputValues, metaCheckboxList);

        mutableMetaPropertyValue = PropertyHelper.MutableMetaPropertyValues(mutableProperties, inputValues, metaCheckboxList);

        immutablePropertyValue = PropertyHelper.ImmutablePropertyValues(immutableProperties, inputValues, immutableMetaCheckboxList);

        immutableMetaPropertyValue = PropertyHelper.ImmutableMetaPropertyValues(immutableProperties, inputValues, immutableMetaCheckboxList);
        if (typeOption === 'asset') {
            if (mutableMetaPropertyValue) {
                mutableMetaPropertyValue = mutableMetaPropertyValue + ',' + assetSpecificMutables;
            } else {
                mutableMetaPropertyValue = assetSpecificMutables;
            }
        }
        if (typeOption === 'order') {
            if (mutableMetaPropertyValue) {
                mutableMetaPropertyValue = mutableMetaPropertyValue + ',' + orderSpecificMutables;
            } else {
                mutableMetaPropertyValue = orderSpecificMutables;
            }
        }

        if (uriMutable) {
            if (mutableMetaPropertyValue) {
                mutableMetaPropertyValue = mutableMetaPropertyValue + ',' + uriMutable;
            } else {
                mutableMetaPropertyValue = uriMutable;
            }
        }

        if (uriImmutable) {
            if (immutableMetaPropertyValue) {
                immutableMetaPropertyValue = immutableMetaPropertyValue + ',' + uriImmutable;
            } else {
                immutableMetaPropertyValue = uriImmutable;
            }
        }

        if (immutablePropertyValue) {
            immutablePropertyValue = immutablePropertyValue + ',' + staticImmutables;
        } else {
            immutablePropertyValue = staticImmutables;
        }
        if (immutableMetaPropertyValue) {
            immutableMetaPropertyValue = immutableMetaPropertyValue + ',' + staticImmutableMeta;
        } else {
            immutableMetaPropertyValue = staticImmutableMeta;
        }

        if (mutablePropertyValue !== '') {
            if (mutableMetaPropertyValue !== '') {

                let totalData = {
                    fromID: FromId,
                    mutablePropertyValue: mutablePropertyValue,
                    immutablePropertyValue: immutablePropertyValue,
                    mutableMetaPropertyValue: mutableMetaPropertyValue,
                    immutableMetaPropertyValue: immutableMetaPropertyValue,
                };
                setTotalDefineObject(totalData);
                setExternalComponent('Keystore');
                setShow(false);
                setLoader(false);
                // const defineIdentityResult = props.ActionName.define(userAddress, "test", userTypeToken, FromId, mutablePropertyValue, immutablePropertyValue, mutableMetaPropertyValue, immutableMetaPropertyValue, config.feesAmount, config.feesToken, config.gas, config.mode)
                // defineIdentityResult.then(function (item) {
                //     const data = JSON.parse(JSON.stringify(item));
                //     setResponse(data)
                //     setShow(false)
                //     setLoader(false);
                // })
            } else {
                setErrorMessage(t('ADD_MUTABLE_META_PROPERTY'));
                setLoader(false);
            }
        } else {
            setErrorMessage(t('ADD_MUTABLE_PROPERTY'));
            setLoader(false);
        }

    };

    const handleMutableProperties = () => {
        setMutableProperties(mutableProperties => mutableProperties.concat([{name: ''}]));
    };

    const handleImmutableProperties = () => {
        setImmutableProperties(immutableProperties => immutableProperties.concat([{name: ''}]));
    };

    const handleRemoveMutableProperties = (i) => {
        if (mutableProperties[i].name == '') {
            let items = [...mutableProperties];
            let item = {...mutableProperties[i]};
            item.name = 'empty';
            items[i] = item;
            setMutableProperties(items);
        }
        const dataType = `MutableDataType${i + 1}`;
        const dataName = `MutableDataName${i + 1}`;
        const dataValue = `MutableDataValue${i + 1}`;
        delete inputValues[dataName];
        delete inputValues[dataValue];
        if (inputValues[dataType] !== undefined) {
            delete inputValues[dataType];
        }
    };

    const handleURI = () => {
        setUriField(!uriField);
    };

    const handleRemoveImmutableProperties = (i) => {
        if (immutableProperties[i].name == '') {
            let items = [...immutableProperties];
            let item = {...immutableProperties[i]};
            item.name = 'empty';
            items[i] = item;
            setImmutableProperties(items);
        }
        const dataType = `ImmutableDataType${i + 1}`;
        const dataName = `ImmutableDataName${i + 1}`;
        const dataValue = `ImmutableDataValue${i + 1}`;
        delete inputValues[dataName];
        delete inputValues[dataValue];
        if (inputValues[dataType] !== undefined) {
            delete inputValues[dataType];
        }
    };
    const onValueChange = (event) => {
        setSelectedOption(event.target.value);
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
                        <Form.Group>
                            <Form.Label>Immutable style:S|*</Form.Label>
                            <Form.Control as="select"
                                onChange={handleChangeStyle}
                                name="ImmutableStyle"
                                required={true}>
                                <option value="Blue"> Blue</option>
                                <option value="Red">Red</option>
                                <option value="Green"> Green</option>
                                <option value="Black">Black</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Immutable type:S|* </Form.Label>
                            <Form.Control as="select" name="type"
                                required={true}
                                onChange={handleChangeType}>
                                <option
                                    value="identitiy">{t('IDENTITY')}</option>
                                <option value="asset">{t('ASSET')}</option>
                                <option value="order">{t('ORDER')}</option>
                            </Form.Control>
                        </Form.Group>
                        {uriField
                            ?
                            <>
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
                                <Form.Group>

                                    <Form.Check
                                        type="radio"
                                        label="Mutable"
                                        name="formHorizontalRadios"
                                        id="formHorizontalRadios1"
                                        value="Mutable"
                                        onChange={onValueChange}
                                        defaultChecked={true}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Immutable"
                                        name="formHorizontalRadios"
                                        id="formHorizontalRadios2"
                                        value="Immutable"
                                        onChange={onValueChange}
                                        defaultChecked={false}
                                    />

                                </Form.Group>
                            </>
                            : ''
                        }

                        <Form.Group>
                            <Form.Check custom type="checkbox" label="URI"
                                name="checkboxURI"
                                id="checkboxURI"
                                onChange={handleURI}
                            />
                        </Form.Group>
                        <InputField
                            type="text"
                            className=""
                            name="ImmutableClassifier"
                            required={false}
                            placeholder="Classifier"
                            label="Immutable classifier:S|"
                            disabled={false}
                        />
                        <InputField
                            type="text"
                            className=""
                            name="ImmutableIdentifier"
                            required={false}
                            placeholder="identifier"
                            label="Immutable identifier:S|"
                            disabled={false}
                        />
                        <InputField
                            type="text"
                            className=""
                            name="ImmutableDescription"
                            required={false}
                            placeholder="description"
                            label="Immutable description:S|"
                            disabled={false}
                        />
                        {typeOption === 'asset'
                            ?
                            <>
                                <InputField
                                    type="text"
                                    className=""
                                    name="MutableBurn"
                                    required={true}
                                    value={-1}
                                    placeholder="Trait Value"
                                    label="Mutable burn:H|"
                                    disabled={true}
                                />
                                <InputField
                                    type="text"
                                    className=""
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

                        {mutableProperties.map((shareholder, idx) => {
                            if (shareholder.name !== 'empty') {
                                return (
                                    <div key={idx}>
                                        <Form.Group>
                                            <Form.Label>{t('DATA_TYPE')}*</Form.Label>
                                            <Form.Control as="select"
                                                name={`MutableDataType${idx + 1}`}
                                                id={`MutableDataType${idx + 1}`}
                                                onChange={handleSelectChange}
                                                required={true}>
                                                <option
                                                    value="S|">{t('STRING')}</option>
                                                <option
                                                    value="D|">{t('DECIMAL')}</option>
                                                <option
                                                    value="H|">{t('HEIGHT')}</option>
                                                <option
                                                    value="I|">{t('ID_TYPE')}</option>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>{t('DATA_NAME')}*</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className=""
                                                name={`MutableDataName${idx + 1}`}
                                                required={true}
                                                placeholder="Data Name"
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Label>{t('DATA_VALUE')}</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className=""
                                                name={`MutableDataValue${idx + 1}`}
                                                required={false}
                                                placeholder="Data Value"
                                                onChange={(evt) => {
                                                    handleChangeMutable(evt, idx + 1);
                                                }}
                                            />
                                        </Form.Group>

                                        <Form.Text
                                            id={`MutableDefine${idx + 1}`}
                                            className="text-muted none">
                                            {t('DATA_TYPE_ERROR')}
                                        </Form.Text>
                                        <Form.Group>
                                            <Form.Check custom type="checkbox"
                                                label="Mutable meta"
                                                name={`add_mutable_meta${idx + 1}`}
                                                id={`add_mutable_meta${idx + 1}`}
                                                onChange={(evt) => {
                                                    addMutableMeta(evt, idx + 1);
                                                }}

                                            />
                                        </Form.Group>
                                        <Button variant="warning" type="button"
                                            size="sm" id={`buttin${idx}`}
                                            onClick={() => handleRemoveMutableProperties(idx)}
                                            className="small button-define">remove
                                        </Button>
                                    </div>
                                );
                            }
                        },
                        )}
                        <Button type="button" variant="secondary" size="sm"
                            onClick={handleMutableProperties}
                            className="small button-define">Add
                            Mutable</Button>

                        {immutableProperties.map((shareholder, idx) => {
                            if (shareholder.name !== 'empty') {
                                return (
                                    <div key={idx}>
                                        <Form.Group>
                                            <Form.Label>{t('DATA_TYPE')}*</Form.Label>
                                            <Form.Control as="select"
                                                name={`ImmutableDataType${idx + 1}`}
                                                id={`ImmutableDataType${idx + 1}`}
                                                onChange={handleChange}>
                                                <option
                                                    value="S|">{t('STRING')}</option>
                                                <option
                                                    value="D|">{t('DECIMAL')}</option>
                                                <option
                                                    value="H|">{t('HEIGHT')}</option>
                                                <option
                                                    value="I|">{t('ID_TYPE')}</option>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>{t('DATA_NAME')}*</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className=""
                                                name={`ImmutableDataName${idx + 1}`}
                                                required={true}
                                                placeholder="Data Name"
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>{t('DATA_VALUE')}</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className=""
                                                name={`ImmutableDataValue${idx + 1}`}
                                                required={false}
                                                placeholder="Data Value"
                                                onChange={(evt) => {
                                                    handleChangeImmutable(evt, idx + 1);
                                                }}
                                            />
                                        </Form.Group>
                                        <Form.Text
                                            id={`ImmutableDefine${idx + 1}`}
                                            className="text-muted none">
                                            {t('DATA_TYPE_ERROR')}
                                        </Form.Text>
                                        <Form.Group>
                                            <Form.Check custom type="checkbox"
                                                label="Immutable meta"
                                                name={`add_immutable_meta${idx + 1}`}
                                                id={`add_immutable_meta${idx + 1}`}
                                                onChange={(evt) => {
                                                    addImmutableMeta(evt, idx + 1);
                                                }}
                                            />
                                        </Form.Group>
                                        <Button variant="warning" type="button"
                                            size="sm"
                                            onClick={() => handleRemoveImmutableProperties(idx)}
                                            className="small button-define">remove
                                        </Button>

                                    </div>
                                );
                            }
                        })
                        }
                        <Button type="button" variant="secondary" size="sm"
                            onClick={handleImmutableProperties}
                            className="small button-define">Add
                            Immutable</Button>

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
                        <CommonKeystore
                            setExternalComponent={setExternalComponent}
                            totalDefineObject={totalDefineObject}
                            TransactionName={props.FormName}
                            ActionName={props.ActionName}
                            handleClose={handleClose}
                        /> :
                        null
                }
                {
                    externalComponent === 'Keystorepwd' ?
                        <CommonKeystorePwd
                            setExternalComponent={setExternalComponent}/> :
                        null
                }
            </div>
        </div>
    );
};

export default Define;
