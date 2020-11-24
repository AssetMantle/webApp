import React, {useState} from "react";
import {Form, Button, Modal} from "react-bootstrap";
import Helpers from "../../../utilities/Helper";
import ClassificationsQueryJS from "persistencejs/transaction/classification/query";
import ordersMakeJS from "persistencejs/transaction/orders/make";
import metasQueryJS from "persistencejs/transaction/meta/query";
const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const ordersMake = new ordersMakeJS(process.env.REACT_APP_ASSET_MANTLE_API)
const classificationsQuery = new ClassificationsQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const MakeOrder = (props) => {
    const [showNext, setShowNext] = useState(false);
    const [classificationId, setClassificationId] = useState("");
    const [checkboxMutableNamesList, setCheckboxMutableNamesList] = useState([]);
    const [mutableList, setMutableList] = useState([]);
    const [immutableList, setImmutableList] = useState([]);
    const [inputValues, setInputValues] = useState([]);
    const [checkedD, setCheckedD] = useState({});
    const [checkboxImmutableNamesList, setCheckboxImmutableNamesList] = useState([]);
    const Helper = new Helpers();
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        setShowNext(false);
    };

    const handleCheckMutableChange = evt => {
        const checkedValue = evt.target.checked;
        const name = evt.target.getAttribute("name")
        if (checkedValue) {
            const checkboxNames = evt.target.name;
            setCheckboxMutableNamesList((checkboxMutableNamesList) => [...checkboxMutableNamesList, checkboxNames]);
        } else {
            if (checkboxMutableNamesList.includes(name)) {
                setCheckboxMutableNamesList(checkboxMutableNamesList.filter(item => item !== name));
            }
        }
    }

    const handleCheckImmutableChange = evt => {
        const checkedValue = evt.target.checked;
        setCheckedD({...checkedD, [evt.target.name]: evt.target.checked});

        const name = evt.target.getAttribute("name")
        if (checkedValue) {
            const checkboxNames = evt.target.name;
            setCheckboxImmutableNamesList((checkboxImmutableNamesList) => [...checkboxImmutableNamesList, checkboxNames]);
        } else {
            if (checkboxImmutableNamesList.includes(name)) {
                setCheckboxImmutableNamesList(checkboxImmutableNamesList.filter(item => item !== name));
            }
        }

    }
    const handleChange = evt => {
        const newValue = evt.target.value;
        setInputValues({...inputValues, [evt.target.name]: newValue});
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const ClassificationId = event.target.ClassificationId.value;
        setClassificationId(ClassificationId)
            const classificationResponse = classificationsQuery.queryClassificationWithID(ClassificationId)
        classificationResponse.then(function (item) {
            const data = JSON.parse(JSON.parse(JSON.stringify(item)));
            if(data.result.value.classifications.value.list !== null) {
                const immutablePropertyList = data.result.value.classifications.value.list[0].value.immutableTraits.value.properties.value.propertyList;
                const mutablePropertyList = data.result.value.classifications.value.list[0].value.mutableTraits.value.properties.value.propertyList;
                Helper.FetchInputFieldMeta(immutablePropertyList, metasQuery, "MakeOrder");
                setMutableList(mutablePropertyList)
                setImmutableList(immutablePropertyList)
            }
        })
        setShowNext(true)
    };
    const handleFormSubmit = (event) => {
        event.preventDefault();
        const assetId = props.assetId;
        const FromId = event.target.FromId.value;
        const TakerOwnableId = event.target.TakerOwnableId.value;
        const Makersplit = event.target.Makersplit.value;
        const ExpiresIn = event.target.expiresInD.value;
        if (checkboxMutableNamesList.length === 0) {
            alert("select mutable meta")
        } else if (mutableList.length !== 0 && checkboxMutableNamesList.length !== 0 && mutableList.length === checkboxMutableNamesList.length) {
            alert("you can't select all as mutable meta")
        } else if (immutableList.length !== 0 && checkboxImmutableNamesList.length !== 0 && immutableList.length === checkboxImmutableNamesList.length) {
            alert("you can't select all as Immutable meta")
        } else if (checkboxImmutableNamesList.length === 0) {
            alert("select immutable meta")
        } else {
            let mutableValues = "";
            let immutableValues = "";
            let mutableMetaValues = "";
            let immutableMetaValues = "";
            if (mutableList !== null) {
                mutableList.map((mutable, index) => {
                    const mutableType = mutable.value.fact.value.type;
                    const mutableName = mutable.value.id.value.idString;
                    const mutableFieldValue = inputValues[`${mutableName}|${mutableType}${index}`]
                    const inputName = `${mutableName}|${mutableType}${index}`
                    const mutableMetaValuesResponse = Helper.setTraitValues(checkboxMutableNamesList, mutableValues, mutableMetaValues, inputName, mutableName, mutableType, mutableFieldValue)
                    if(mutableMetaValuesResponse[0] !== "") {
                        mutableValues = mutableMetaValuesResponse[0];
                    }
                    if(mutableMetaValuesResponse[1] !== "") {
                        mutableMetaValues =  mutableMetaValuesResponse[1];
                    }
                })
            }
            if (immutableList !== null) {
                immutableList.map((immutable, index) => {
                    const immutableType = immutable.value.fact.value.type;
                    const immutableName = immutable.value.id.value.idString;
                    const immutableFieldValue = inputValues[`${immutableName}|${immutableType}${index}`]
                    const immutableInputName = `${immutableName}|${immutableType}${index}`

                    const ImmutableMetaValuesResponse = Helper.setTraitValues(checkboxImmutableNamesList, immutableValues, immutableMetaValues, immutableInputName, immutableName, immutableType, immutableFieldValue)
                    if(ImmutableMetaValuesResponse[0] !== "") {
                        immutableValues = ImmutableMetaValuesResponse[0];
                    }
                    if(ImmutableMetaValuesResponse[1] !== "") {
                        immutableMetaValues =  ImmutableMetaValuesResponse[1];
                    }
                })
            }
            const userTypeToken = localStorage.getItem('mnemonic');
            const userAddress = localStorage.getItem('address');
            const makeOrderResult = ordersMake.make(userAddress, "test", userTypeToken, FromId, classificationId,assetId, TakerOwnableId,ExpiresIn, Makersplit,  mutableValues, immutableValues, mutableMetaValues, immutableMetaValues, 25, "stake", 200000, "block")
            console.log(makeOrderResult, "makeOrderResult")
        }
    }
    return (
        <div className="accountInfo">
            <Modal.Header closeButton>
                Make Order
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Classification Id </Form.Label>
                        <Form.Control
                            type="text"
                            className=""
                            name="ClassificationId"
                            required={true}
                            placeholder="ClassificationId"
                        />
                    </Form.Group>

                    <div className="submitButtonSection">
                        <Button variant="primary" type="submit">
                            Next
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
            <Modal
                show={showNext}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton>
                    Make
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>From Id </Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="FromId"
                                required={true}
                                placeholder="FromId"
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label> Taker OwnableId</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="TakerOwnableId"
                                required={true}
                                placeholder="TakerOwnableId"
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label> Maker Split</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="Makersplit"
                                required={true}
                                placeholder="split"
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Expires In</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="expiresInD"
                                required={true}
                                placeholder="expiresIn"
                            />
                        </Form.Group>
                        {mutableList !== null ?
                            mutableList.map((mutable, index) => {
                                const mutableType = mutable.value.fact.value.type;
                                const mutableName = mutable.value.id.value.idString;
                                return (
                                    <>
                                        <Form.Group controlId="formBasicEmail">
                                            <Form.Label>Mutable Traits {mutableName}|{mutableType} </Form.Label>
                                            <Form.Control
                                                type="text"
                                                className=""
                                                name={`${mutableName}|${mutableType}${index}`}
                                                required={true}
                                                placeholder="Trait Value"
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="formBasicCheckbox">
                                            <Form.Check type="checkbox" label="Meta"
                                                        name={`${mutableName}|${mutableType}${index}`}
                                                        onClick={handleCheckMutableChange}
                                            />
                                        </Form.Group>
                                    </>
                                )
                            })
                            :
                            ""
                        }
                        {immutableList !== null ?
                            immutableList.map((immutable, index) => {
                                const immutableType = immutable.value.fact.value.type;
                                const immutableName = immutable.value.id.value.idString;
                                return (
                                    <>
                                        <Form.Group>
                                            <Form.Label>Immutable Traits {immutableName} |{immutableType} </Form.Label>
                                            <Form.Control
                                                type="text"
                                                className=""
                                                name={`${immutableName}|${immutableType}${index}`}
                                                id={`MakeOrder${immutableName}|${immutableType}${index}`}
                                                required={true}
                                                placeholder="Trait Value"
                                                onChange={handleChange}
                                                disabled={false}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Check type="checkbox" label="Meta"
                                                        name={`${immutableName}|${immutableType}${index}`}
                                                        onChange={handleCheckImmutableChange}/>
                                        </Form.Group>
                                    </>
                                )
                            })
                            :
                            ""
                        }
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default MakeOrder;
