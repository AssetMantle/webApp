import React, {useState, useEffect} from "react";
import Identities from "persistencejs/transaction/identity/define";
import InputField from '../../components/inputField'
import {Form, Button, Modal} from "react-bootstrap";
import Helpers from "../../utilities/helper"

const DefineIdentity = () => {
    const Helper = new Helpers();
    const [show, setShow] = useState(false);
    const [dataTypeError, setDataTypeError] = useState(false);
    const [responseData, setResponseData] = useState("");
    const [errorData, setErrorData] = useState("");
    const [assetItemsList, setAssetItemsList] = useState([]);
    const handleClose = () => {
        setShow(false);
        window.location.reload();
    };
    const [mutableProperties, setMutableProperties] = useState([]);
    const [mutableMetaProperties, setMutableMetaProperties] = useState([]);
    const [immutableProperties, setImmutableProperties] = useState([]);
    const [immutableMetaProperties, setImmutableMetaProperties] = useState([]);
    const [inputValues, setInputValues] = useState([]);


    const handleChange = evt => {
        const newValue = evt.target.value;
        setInputValues({...inputValues, [evt.target.name]: newValue});
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        const FromId = evt.target.FromId.value;
        const userTypeToken = localStorage.getItem('mnemonic');
        const userAddress = localStorage.getItem('address');

        var mutablePropertyValue = ""
        var mutableMetaPropertyValue = ""
        var immutablePropertyValue = ""
        var immutableMetaPropertyValue = ""
        if (mutableProperties.length !== 0) {
            mutableProperties.map((mutableProperty, idx) => {
                const checkError = Helper.DataTypeValidation(idx, inputValues, 'Mutable');
                Helper.showHideDataTypeError(checkError, `Mutable${idx}`);
            })
            mutablePropertyValue = Helper.MutablePropertyValues(mutableProperties, inputValues);
        }
        if (mutableMetaProperties.length !== 0) {
            mutableMetaProperties.map((mutableMetaProperty, idx) => {
                const checkError = Helper.DataTypeValidation(idx, inputValues, 'MutableMeta');
                Helper.showHideDataTypeError(checkError, `MutableMeta${idx}`);
            })
            mutableMetaPropertyValue = Helper.MutableMetaPropertyValues(mutableMetaProperties, inputValues);
            if (immutableProperties.length !== 0) {
                immutableProperties.map((immutableMetaProperty, idx) => {
                    const checkError = Helper.DataTypeValidation(idx, inputValues, 'Immutable');
                    Helper.showHideDataTypeError(checkError, `Immutable${idx}`);
                })
                immutablePropertyValue = Helper.ImmutablePropertyValues(immutableProperties, inputValues);
                if (immutableMetaProperties.length !== 0) {
                    immutableMetaProperties.map((immutableMetaProperty, idx) => {
                        const checkError = Helper.DataTypeValidation(idx, inputValues, 'ImmutableMeta');
                        Helper.showHideDataTypeError(checkError, `ImmutableMeta${idx}`);

                    })
                    immutableMetaPropertyValue = Helper.ImmutableMetaPropertyValues(immutableMetaProperties, inputValues);
                    const defineIdentiyResult = Identities.define(userAddress, "test", userTypeToken, FromId, mutablePropertyValue, immutablePropertyValue, mutableMetaPropertyValue, immutableMetaPropertyValue, 25, "stake", 200000, "block")
                    console.log(defineIdentiyResult, "result define Identity")
                    evt.target.reset();
                } else {
                    console.log("fill immutabale metas")
                }
            } else {
                console.log("fill immutabale")
            }
        } else {
            console.log("fill mutabale metas")
        }
        setShow(false);

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
        <div className="accountInfo">

            <Modal.Header closeButton>
                Define Identity
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>FromId</Form.Label>
                        <Form.Control
                            type="text"
                            className=""
                            name="FromId"
                            required={true}
                            placeholder="FromId"
                        />
                    </Form.Group>
                    {mutableProperties.map((shareholder, idx) => (
                        <div key={idx}>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>Data Type</Form.Label>
                                <Form.Control as="select" name={`MutableDataType${idx + 1}`} onChange={handleChange}
                                              required={true}>
                                    <option value="S|">String</option>
                                    <option value="D|">Decimal</option>
                                    <option value="H|">Height</option>
                                    <option value="I|">IDtype</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Data Name </Form.Label>
                                <Form.Control
                                    type="text"
                                    className=""
                                    name={`MutableDataName${idx + 1}`}
                                    required={true}
                                    placeholder="Data Name"
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Data Value</Form.Label>
                                <Form.Control
                                    type="text"
                                    className=""
                                    name={`MutableDataValue${idx + 1}`}
                                    required={true}
                                    placeholder="Data Value"
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Text id={`Mutable${idx}`} className="text-muted none">
                                Enter value based on datatype you choosen
                            </Form.Text>

                            <button type="button" onClick={handleRemoveMutableProperties(idx)} className="small">-
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleMutableProperties} className="small">Add Mutable</button>
                    {mutableMetaProperties.map((mutableMetaProperty, idx) => (
                        <div key={idx}>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>Data Type</Form.Label>
                                <Form.Control as="select" name={`MutableMetaDataType${idx + 1}`}
                                              onChange={handleChange}>
                                    <option value="S|">String</option>
                                    <option value="D|">Decimal</option>
                                    <option value="H|">Height</option>
                                    <option value="I|">IDtype</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Data Name </Form.Label>
                                <Form.Control
                                    type="text"
                                    className=""
                                    name={`MutableMetaDataName${idx + 1}`}
                                    required={true}
                                    placeholder="Data Name"
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Data Value</Form.Label>
                                <Form.Control
                                    type="text"
                                    className=""
                                    name={`MutableMetaDataValue${idx + 1}`}
                                    required={true}
                                    placeholder="Data Value"
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Text id={`MutableMeta${idx}`} className="text-muted none">
                                Enter value based on datatype you choosen
                            </Form.Text>
                            <button type="button" onClick={handleRemoveMutableMetaProperties(idx)} className="small">-
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleMutableMetaProperties} className="small">Add mutable Meta
                    </button>
                    {immutableProperties.map((immutableProperty, idx) => (
                        <div key={idx}>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>Data Type</Form.Label>
                                <Form.Control as="select" name={`ImmutableDataType${idx + 1}`} onChange={handleChange}>
                                    <option value="S|">String</option>
                                    <option value="D|">Decimal</option>
                                    <option value="H|">Height</option>
                                    <option value="I|">IDtype</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Data Name </Form.Label>
                                <Form.Control
                                    type="text"
                                    className=""
                                    name={`ImmutableDataName${idx + 1}`}
                                    required={true}
                                    placeholder="Data Name"
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Data Value</Form.Label>
                                <Form.Control
                                    type="text"
                                    className=""
                                    name={`ImmutableDataValue${idx + 1}`}
                                    required={true}
                                    placeholder="Data Value"
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Text id={`Immutable${idx}`} className="text-muted none">
                                Enter value based on datatype you choosen
                            </Form.Text>
                            <button type="button" onClick={handleRemoveImmutableProperties(idx)} className="small">-
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleImmutableProperties} className="small">Add Immutable</button>
                    {immutableMetaProperties.map((immutableMetaProperty, idx) => (
                        <div key={idx}>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>Data Type</Form.Label>
                                <Form.Control as="select" name={`ImmutableMetaDataType${idx + 1}`}
                                              onChange={handleChange}>
                                    <option value="S|">String</option>
                                    <option value="D|">Decimal</option>
                                    <option value="H|">Height</option>
                                    <option value="I|">IDtype</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Data Name </Form.Label>
                                <Form.Control
                                    type="text"
                                    className=""
                                    name={`ImmutableMetaDataName${idx + 1}`}
                                    required={true}
                                    placeholder="Data Name"
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Data Value</Form.Label>
                                <Form.Control
                                    type="text"
                                    className=""
                                    name={`ImmutableMetaDataValue${idx + 1}`}
                                    required={true}
                                    placeholder="Data Value"
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Text id={`ImmutableMeta${idx}`} className="text-muted none">
                                Enter value based on datatype you choosen
                            </Form.Text>
                            <button type="button" onClick={handleRemoveImmutableMetaProperties(idx)}
                                    className="small">-
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleImmutableMetaProperties} className="small">Add Immutable Meta
                    </button>
                    <div className="submitButtonSection">
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </div>
                </form>
            </Modal.Body>
        </div>
    );
};

export default DefineIdentity;
