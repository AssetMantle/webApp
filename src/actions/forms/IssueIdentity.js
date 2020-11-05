import React, {useState, useEffect} from "react";
import classificationsQueryJS from "persistencejs/transaction/classification/query";
import identitiesIssueJS from "persistencejs/transaction/identity/issue";
import InputField from '../../components/inputField'
import {Form, Button, Modal} from "react-bootstrap";

const identitiesIssue = new identitiesIssueJS(process.env.REACT_APP_ASSET_MANTLE_API)
const classificationsQuery = new classificationsQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)

const IssueIdentity = (props) => {
    const [showNext, setShowNext] = useState(false);
    const [responseData, setResponseData] = useState("");
    const [classificationId, setClassificationId] = useState("");
    const [errorData, setErrorData] = useState("");
    const [mutableList, setMutatableList] = useState([]);
    const [immutableList, setImmutableList] = useState([]);
    const [assetItemsList, setAssetItemsList] = useState([]);
    const [inputValues, setInputValues] = useState([]);

    const handleClose = () => {
        setShowNext(false);
    };

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
            const data = JSON.parse(item);
            const immutablePropertyList = data.result.value.classifications.value.list[0].value.immutableTraits.value.properties.value.propertyList;
            const mutablePropertyList = data.result.value.classifications.value.list[0].value.mutableTraits.value.properties.value.propertyList;
            setMutatableList(mutablePropertyList)
            setImmutableList(immutablePropertyList)
        })
        setShowNext(true)
    };
    const handleFormSubmit = (event) => {
        event.preventDefault();

        const FromId = event.target.FromId.value;
        const toAddress = event.target.toAddress.value;
        var mutableValues = "";
        var immutableValues = "";
        var mutableMetaValues = "";
        var immutableMetaValues = "";
        if (mutableList !== null) {
            mutableList.map((mutable, index) => {
                const mutableType = mutable.value.fact.value.type;
                const mutableName = mutable.value.id.value.idString;
                const mutableFieldValue = inputValues[`${mutableName}|${mutableType}${index}`]
                if (index === 0) {
                    mutableValues = mutableValues + mutableName + ":" + mutableType + "|" + mutableFieldValue;
                } else {
                    if (index > 1) {
                        mutableMetaValues = mutableMetaValues + "," + mutableName + ":" + mutableType + "|" + mutableFieldValue
                    } else {
                        mutableMetaValues = mutableMetaValues + mutableName + ":"
                            + mutableType + "|" + mutableFieldValue
                    }
                }
            })
        }
        if (immutableList !== null) {
            immutableList.map((immutable, index) => {
                const immutableType = immutable.value.fact.value.type;
                const immutableName = immutable.value.id.value.idString;
                const immutableFieldValue = inputValues[`${immutableName}|${immutableType}${index}`]
                if (index === 0) {
                    immutableValues = immutableValues + immutableName + ":" + immutableType + "|" + immutableFieldValue;
                } else {
                    if (index > 1) {
                        immutableMetaValues = immutableMetaValues + "," + immutableName + ":" + immutableType + "|" + immutableFieldValue
                    } else {
                        immutableMetaValues = immutableMetaValues + immutableName + ":" + immutableType + "|" + immutableFieldValue
                    }
                }
            })
        }
        const issueIdentityResult = identitiesIssue.issue(userAddress, "test", userTypeToken, toAddress, FromId, classificationId, mutableValues, immutableValues, mutableMetaValues, immutableMetaValues, 25, "stake", 200000, "block")
        console.log(issueIdentityResult, "result Issue Identity")
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
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>Immutable Traits {immutableName} |{immutableType} </Form.Label>
                                        <Form.Control
                                            type="text"
                                            className=""
                                            name={`${immutableName}|${immutableType}${index}`}
                                            required={true}
                                            placeholder="Trait Value"
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
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

export default IssueIdentity;
