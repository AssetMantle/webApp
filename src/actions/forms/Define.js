import React, {useState} from "react";
import {Form, Button, Modal} from "react-bootstrap";
import Helpers from "../../utilities/Helper"
import InputField from "../../components/inputField"
import {useTranslation} from "react-i18next";
import { pollTxHash } from '../../utilities/Helper'
import config from "../../constants/config.json"
import ModalCommon from "../../components/modal";
import Loader from "../../components/loader";

const Define = (props) => {
    const url = process.env.REACT_APP_ASSET_MANTLE_API;
    const Helper = new Helpers();
    const [loader, setLoader] = useState(false)
    const [show, setShow] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [dataTypeOption, setDataTypeOption] = useState("S|");
    const [typeOption, setTypeOption] = useState("identity");
    const [mutableStyle, setMutableStyle] = useState("ERC20");
    const [response, setResponse] = useState({});
    const [mutableProperties, setMutableProperties] = useState([]);
    const [mutableMetaProperties, setMutableMetaProperties] = useState([]);
    const [immutableProperties, setImmutableProperties] = useState([]);
    const [immutableMetaProperties, setImmutableMetaProperties] = useState([]);
    const [inputValues, setInputValues] = useState([]);
    const {t} = useTranslation();

    const handleChange = evt => {
        const newValue = evt.target.value;
        setInputValues({...inputValues, [evt.target.name]: newValue});
    }
    const handleClose = () => {
        setShow(false)
        props.setExternalComponent("");
    };
    const handleChangeType = evt => {
        setTypeOption(evt.target.value);
    }
    const handleChangeStyle = evt => {
        setMutableStyle(evt.target.value);
    }

    const handleSelectChange = evt => {
        setDataTypeOption(evt.target.value);
        const newValue = evt.target.value;
        setInputValues({...inputValues, [evt.target.name]: newValue});

    }
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
        let staticImmutableMeta = "";
        const ImmutableDescription = evt.target.ImmutableDescription.value;
        const ImmutableIdentifier = evt.target.ImmutableIdentifier.value;
        const ImmutableClassifier = evt.target.ImmutableClassifier.value;
        let staticImmutables = `style:S|${mutableStyle},type:S|${typeOption}`;
        staticImmutableMeta = `classifier:S|${ImmutableClassifier},identifier:S|${ImmutableIdentifier},description:S|${ImmutableDescription}`
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');
        let mutablePropertyValue = ""
        let mutableMetaPropertyValue = ""
        let immutablePropertyValue = ""
        let immutableMetaPropertyValue = ""
        mutableProperties.map((mutableProperty, idx) => {
            const checkError = Helper.DataTypeValidation(idx, inputValues, 'Mutable');
            Helper.showHideDataTypeError(checkError, `Mutable${idx}`);
        })
        mutablePropertyValue = Helper.MutablePropertyValues(mutableProperties, inputValues);
        mutableMetaProperties.map((mutableMetaProperty, idx) => {
            const checkError = Helper.DataTypeValidation(idx, inputValues, 'MutableMeta');
            Helper.showHideDataTypeError(checkError, `MutableMeta${idx}`);
        })
        mutableMetaPropertyValue = Helper.MutableMetaPropertyValues(mutableMetaProperties, inputValues);
        immutableProperties.map((immutableMetaProperty, idx) => {
            const checkError = Helper.DataTypeValidation(idx, inputValues, 'Immutable');
            Helper.showHideDataTypeError(checkError, `Immutable${idx}`);
        })
        immutablePropertyValue = Helper.ImmutablePropertyValues(immutableProperties, inputValues);
        immutableMetaProperties.map((immutableMetaProperty, idx) => {
            const checkError = Helper.DataTypeValidation(idx, inputValues, 'ImmutableMeta');
            Helper.showHideDataTypeError(checkError, `ImmutableMeta${idx}`);
        })
        immutableMetaPropertyValue = Helper.ImmutableMetaPropertyValues(immutableMetaProperties, inputValues);
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
        if (mutablePropertyValue !== "") {
            if (mutableMetaPropertyValue !== "") {
                const defineIdentityResult = props.ActionName.define(userAddress, "test", userTypeToken, FromId, mutablePropertyValue, immutablePropertyValue, mutableMetaPropertyValue, immutableMetaPropertyValue, config.feesAmount, config.feesToken, config.gas, config.mode)
                defineIdentityResult.then(function (item) {
                    const data = JSON.parse(JSON.stringify(item));
                            setResponse(data)
                            setShow(false)
                            setLoader(false);
                })
            } else {
                setErrorMessage(t("ADD_MUTABLE_META_PROPERTY"))
                setLoader(false);
            }
        } else {
            setErrorMessage(t("ADD_MUTABLE_PROPERTY"))
            setLoader(false);
        }

    }

    const handleMutableProperties = () => {
        setMutableProperties(mutableProperties => mutableProperties.concat([{name: ''}]));
    }
    const handleMutableMetaProperties = () => {
        setMutableMetaProperties(mutableMetaProperties => mutableMetaProperties.concat([{name: ''}]));
    }

    const handleImmutableProperties = () => {
        setImmutableProperties(immutableProperties => immutableProperties.concat([{name: ''}]));
    }
    const handleImmutableMetaProperties = () => {
        setImmutableMetaProperties(immutableMetaProperties => immutableMetaProperties.concat([{name: ''}]));
    }
    const handleRemoveMutableProperties = (idx) => () => {
        setMutableProperties(mutableProperties => mutableProperties.filter((s, sidx) => idx !== sidx));
    }

    const handleRemoveMutableMetaProperties = (idx) => () => {
        setMutableMetaProperties(mutableMetaProperties => mutableMetaProperties.filter((s, sidx) => idx !== sidx));
    }
    const handleRemoveImmutableProperties = (idx) => () => {
        setImmutableProperties(immutableProperties => immutableProperties.filter((s, sidx) => idx !== sidx));
    }
    const handleRemoveImmutableMetaProperties = (idx) => () => {
        setImmutableMetaProperties(immutableMetaProperties => immutableMetaProperties.filter((s, sidx) => idx !== sidx));
    }
    return (
        <div>
            <Modal show={show} onHide={handleClose}  centered>
            <Modal.Header closeButton>
                {props.FormName}
            </Modal.Header>
                {loader ?
                    <Loader />
                    :""
                }
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>{t("FROM_ID")}</Form.Label>
                        <Form.Control
                            type="text"
                            className=""
                            name="FromId"
                            required={true}
                            placeholder="FromId"
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Immutable style:S| </Form.Label>
                        <Form.Control as="select" onChange={handleChangeStyle} name="ImmutableStyle"
                                      required={true}>
                            <option value="ERC20"> ERC20</option>
                            <option value="ERC721">ERC721</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Immutable type:S| </Form.Label>
                        <Form.Control as="select" name="type"
                                      required={true} onChange={handleChangeType}>
                            <option value="identitiy">{t("IDENTITY")}</option>
                            <option value="asset">{t("ASSET")}</option>
                            <option value="order">{t("ORDER")}</option>
                        </Form.Control>
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
                        : ""
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
                        : ""
                    }
                    {mutableProperties.map((shareholder, idx) => (
                        <div key={idx}>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>{t("DATA_TYPE")}</Form.Label>
                                <Form.Control as="select" value={dataTypeOption} name={`MutableDataType${idx + 1}`}
                                              onChange={handleSelectChange}
                                              required={true}>
                                    <option value="S|">{t("STRING")}</option>
                                    <option value="D|">{t("DECIMAL")}</option>
                                    <option value="H|">{t("HEIGHT")}</option>
                                    <option value="I|">{t("ID_TYPE")}</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>{t("DATA_NAME")}</Form.Label>
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
                                <Form.Label>{t("DATA_VALUE")}</Form.Label>
                                <Form.Control
                                    type="text"
                                    className=""
                                    name={`MutableDataValue${idx + 1}`}
                                    required={false}
                                    placeholder="Data Value"
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Text id={`Mutable${idx}`} className="text-muted none">
                                {t("DATA_TYPE_ERROR")}
                            </Form.Text>
                            <Button variant="warning" type="button" size="sm" onClick={handleRemoveMutableProperties(idx)} className="small button-define">remove
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="secondary" size="sm" onClick={handleMutableProperties} className="small button-define">Add Mutable</Button>
                    {mutableMetaProperties.map((mutableMetaProperty, idx) => (
                        <div key={idx}>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>{t("DATA_TYPE")}</Form.Label>
                                <Form.Control as="select" name={`MutableMetaDataType${idx + 1}`}
                                              onChange={handleChange}>
                                    <option value="S|">{t("STRING")}</option>
                                    <option value="D|">{t("DECIMAL")}</option>
                                    <option value="H|">{t("HEIGHT")}</option>
                                    <option value="I|">{t("ID_TYPE")}</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>{t("DATA_NAME")}</Form.Label>
                                <Form.Control
                                    type="text"
                                    className=""
                                    name={`MutableMetaDataName${idx + 1}`}
                                    required={true}
                                    placeholder="Data Name"
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>{t("DATA_VALUE")}</Form.Label>
                                <Form.Control
                                    type="text"
                                    className=""
                                    name={`MutableMetaDataValue${idx + 1}`}
                                    required={false}
                                    placeholder="Data Value"
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Text id={`MutableMeta${idx}`} className="text-muted none">
                                {t("DATA_TYPE_ERROR")}
                            </Form.Text>
                            <Button variant="warning" type="button" size="sm" onClick={handleRemoveMutableMetaProperties(idx)} className="small button-define">remove
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="secondary" size="sm" onClick={handleMutableMetaProperties} className="small button-define">Add mutable Meta
                    </Button>
                    {immutableProperties.map((immutableProperty, idx) => (
                        <div key={idx}>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>{t("DATA_TYPE")}</Form.Label>
                                <Form.Control as="select" name={`ImmutableDataType${idx + 1}`} onChange={handleChange}>
                                    <option value="S|">{t("STRING")}</option>
                                    <option value="D|">{t("DECIMAL")}</option>
                                    <option value="H|">{t("HEIGHT")}</option>
                                    <option value="I|">{t("ID_TYPE")}</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>{t("DATA_NAME")}</Form.Label>
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
                                <Form.Label>{t("DATA_VALUE")}</Form.Label>
                                <Form.Control
                                    type="text"
                                    className=""
                                    name={`ImmutableDataValue${idx + 1}`}
                                    required={false}
                                    placeholder="Data Value"
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Text id={`Immutable${idx}`} className="text-muted none">
                                {t("DATA_TYPE_ERROR")}
                            </Form.Text>
                            <Button type="button" variant="warning" size="sm" onClick={handleRemoveImmutableProperties(idx)} className="small button-define">remove
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="secondary" size="sm" onClick={handleImmutableProperties} className="small button-define">Add Immutable</Button>
                    {immutableMetaProperties.map((immutableMetaProperty, idx) => (
                        <div key={idx}>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>{t("DATA_TYPE")}</Form.Label>
                                <Form.Control as="select" name={`ImmutableMetaDataType${idx + 1}`}
                                              onChange={handleChange}>
                                    <option value="S|">{t("STRING")}</option>
                                    <option value="D|">{t("DECIMAL")}</option>
                                    <option value="H|">{t("HEIGHT")}</option>
                                    <option value="I|">{t("ID_TYPE")}</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>{t("DATA_NAME")}</Form.Label>
                                <Form.Control
                                    type="text"
                                    className=""
                                    name={`ImmutableMetaDataName${idx + 1}`}
                                    required={true}
                                    placeholder="Data Name"
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>{t("DATA_VALUE")}</Form.Label>
                                <Form.Control
                                    type="text"
                                    className=""
                                    name={`ImmutableMetaDataValue${idx + 1}`}
                                    required={false}
                                    placeholder="Data Value"
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Text id={`ImmutableMeta${idx}`} className="text-muted none">
                                {t("DATA_TYPE_ERROR")}
                            </Form.Text>
                            <Button variant="warning" type="button" size="sm" onClick={handleRemoveImmutableMetaProperties(idx)}
                                    className="small button-define">remove
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="secondary" size="sm" onClick={handleImmutableMetaProperties} className="small button-define">Add Immutable Meta
                    </Button>
                    {errorMessage !== "" ?
                        <p className="error-response">{errorMessage}</p>
                        : ""
                    }
                    <div className="submitButtonSection">
                        <Button variant="primary" type="submit">
                            {t("SUBMIT")}
                        </Button>
                    </div>
                </form>
            </Modal.Body>
            </Modal>
            { !(Object.keys(response).length === 0) ?
                <ModalCommon data={response} setExternal={handleClose}/>
                :""
            }
        </div>
    );
};

export default Define;
