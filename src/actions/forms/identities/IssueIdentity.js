import React, {useState} from "react";
import ClassificationsQueryJS from "persistencejs/transaction/classification/query";
import IdentitiesIssueJS from "persistencejs/transaction/identity/issue";
import {Form, Button, Modal} from "react-bootstrap";
import Helpers from "../../../utilities/Helper";
import metasQueryJS from "persistencejs/transaction/meta/query";

const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const identitiesIssue = new IdentitiesIssueJS(process.env.REACT_APP_ASSET_MANTLE_API)
const classificationsQuery = new ClassificationsQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)

const IssueIdentity = () => {
    const Helper = new Helpers();
    const [showNext, setShowNext] = useState(false);
    const [response, setResponse] = useState({});
    const [checkedD, setCheckedD] = useState({});
    const [classificationId, setClassificationId] = useState("");
    const [mutableList, setMutableList] = useState([]);
    const [immutableList, setImmutableList] = useState([]);
    const [inputValues, setInputValues] = useState([]);
    const [checkboxMutableNamesList, setCheckboxMutableNamesList] = useState([]);
    const [checkboxImmutableNamesList, setCheckboxImmutableNamesList] = useState([]);
    const handleClose = () => {
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
    const userTypeToken = localStorage.getItem('mnemonic');
    const userAddress = localStorage.getItem('address');
    const handleSubmit = (event) => {
        event.preventDefault();
        const ClassificationId = event.target.ClassificationId.value;
        setClassificationId(ClassificationId)
        const classificationResponse = classificationsQuery.queryClassificationWithID(ClassificationId)
        classificationResponse.then(function (item) {
            const data = JSON.parse(JSON.parse(JSON.stringify(item)));
            if (data.result.value.classifications.value.list !== null) {
                const immutablePropertyList = data.result.value.classifications.value.list[0].value.immutableTraits.value.properties.value.propertyList;
                const mutablePropertyList = data.result.value.classifications.value.list[0].value.mutableTraits.value.properties.value.propertyList;
                console.log(immutablePropertyList, "immutablePropertyList")
                Helper.FetchInputFieldMeta(immutablePropertyList, metasQuery, "IssueIdentity");
                setMutableList(mutablePropertyList)
                setImmutableList(immutablePropertyList)
            }
        })
        setShowNext(true)
    };
    const handleFormSubmit = (event) => {
        event.preventDefault();
        if (checkboxMutableNamesList.length === 0) {
            alert("select mutable meta")
        } else if (mutableList.length !== 0 && checkboxMutableNamesList.length !== 0 && mutableList.length === checkboxMutableNamesList.length) {
            alert("you can't select all as mutable meta")
        } else if (immutableList.length !== 0 && checkboxImmutableNamesList.length !== 0 && immutableList.length === checkboxImmutableNamesList.length) {
            alert("you can't select all as Immutable meta")
        } else if (checkboxImmutableNamesList.length === 0) {
            alert("select immutable meta")
        } else {
            const FromId = event.target.FromId.value;
            const toAddress = event.target.toAddress.value;
            let mutableValues = "";
            let immutableValues = "";
            let mutableMetaValues = "";
            let immutableMetaValues = "";
            if (mutableList !== null) {
                mutableList.map((mutable, index) => {
                    const mutableType = mutable.value.fact.value.type;
                    const mutableName = mutable.value.id.value.idString;
                    const mutableFieldValue = inputValues[`${mutableName}|${mutableType}${index}`]
                    console.log(mutableFieldValue, "mutableFieldValue")
                    const inputName = `${mutableName}|${mutableType}${index}`

                    const mutableMetaValuesResponse = Helper.setTraitValues(checkboxMutableNamesList, mutableValues, mutableMetaValues, inputName, mutableName, mutableType, mutableFieldValue)
                    if (mutableMetaValuesResponse[0] !== "") {
                        mutableValues = mutableMetaValuesResponse[0];
                    }
                    if (mutableMetaValuesResponse[1] !== "") {
                        mutableMetaValues = mutableMetaValuesResponse[1];
                    }

                })
            }
            if (immutableList !== null) {
                immutableList.map((immutable, index) => {
                    const immutableType = immutable.value.fact.value.type;
                    const immutableName = immutable.value.id.value.idString;
                    const immutableInputName = `${immutableName}|${immutableType}${index}`
                    const immutableFieldValue = document.getElementById(`IssueIdentity${immutableName}|${immutableType}${index}`).value;
                    const ImmutableMetaValuesResponse = Helper.setTraitValues(checkboxImmutableNamesList, immutableValues, immutableMetaValues, immutableInputName, immutableName, immutableType, immutableFieldValue)
                    if (ImmutableMetaValuesResponse[0] !== "") {
                        immutableValues = ImmutableMetaValuesResponse[0];
                    }
                    if (ImmutableMetaValuesResponse[1] !== "") {
                        immutableMetaValues = ImmutableMetaValuesResponse[1];
                    }

                })
            }
            const issueIdentityResult = identitiesIssue.issue(userAddress, "test", userTypeToken, toAddress, FromId, classificationId, mutableValues, immutableValues, mutableMetaValues, immutableMetaValues, 25, "stake", 200000, "block")
            issueIdentityResult.then(function (item) {
                const data = JSON.parse(JSON.stringify(item));
                setResponse(data)
                console.log(data, "result Issue Identity")
            })
        }
    }
    return (
        <div className="accountInfo">

            <Modal.Header closeButton>
                Issue Identity
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
                    Issue Identity
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
                            <Form.Label> To Address</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="toAddress"
                                required={true}
                                placeholder="toAddress"
                            />
                        </Form.Group>
                        {mutableList !== null ?
                            mutableList.map((mutable, index) => {
                                const mutableType = mutable.value.fact.value.type;
                                const mutableName = mutable.value.id.value.idString;
                                return (
                                    <div key={index}>
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
                                    </div>
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
                                                required={true}
                                                id={`IssueIdentity${immutableName}|${immutableType}${index}`}
                                                placeholder="Trait Value"
                                                disabled={false}
                                                onChange={handleChange}
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
                        {response.code ?
                            <p> {response.raw_log}</p>
                            :
                            <p> {response.txhash}</p>
                        }
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default IssueIdentity;
