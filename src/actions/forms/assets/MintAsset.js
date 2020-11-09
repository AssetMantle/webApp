import React, {useState, useEffect} from "react";
import classificationsQueryJS from "persistencejs/transaction/classification/query";
import assetMintJS from "persistencejs/transaction/assets/mint";
import {Form, Button, Modal} from "react-bootstrap";

const assetMint = new assetMintJS(process.env.REACT_APP_ASSET_MANTLE_API)
const classificationsQuery = new classificationsQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)

const MintAsset = (props) => {
    const [showNext, setShowNext] = useState(false);
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
                // setAssetItemsList(assetItemsList => assetItemsList.filter((item, sidx) => item.name !== name))
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
            const data = JSON.parse(item);
            const immutablePropertyList = data.result.value.classifications.value.list[0].value.immutableTraits.value.properties.value.propertyList;
            const mutablePropertyList = data.result.value.classifications.value.list[0].value.mutableTraits.value.properties.value.propertyList;
            setMutableList(mutablePropertyList)
            setImmutableList(immutablePropertyList)
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
            var mutableValues = "";
            var immutableValues = "";
            var mutableMetaValues = "";
            var immutableMetaValues = "";
            if (mutableList !== null) {
                mutableList.map((mutable, index) => {
                    const mutableType = mutable.value.fact.value.type;
                    const mutableName = mutable.value.id.value.idString;
                    const mutableFieldValue = inputValues[`${mutableName}|${mutableType}${index}`]
                    const inputName = `${mutableName}|${mutableType}${index}`
                    if (checkboxMutableNamesList.includes(inputName)) {
                        if (mutableMetaValues !== "") {
                            mutableMetaValues = mutableMetaValues + "," + mutableName + ":" + mutableType + "|" + mutableFieldValue
                        } else {
                            mutableMetaValues = mutableMetaValues + mutableName + ":"
                                + mutableType + "|" + mutableFieldValue
                        }
                    } else {
                        if (mutableValues !== "") {
                            mutableValues = mutableValues + "," + mutableName + ":" + mutableType + "|" + mutableFieldValue
                        } else {
                            mutableValues = mutableValues + mutableName + ":"
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
                    const immutableInputName = `${immutableName}|${immutableType}${index}`
                    if (checkboxImmutableNamesList.includes(immutableInputName)) {
                        if (immutableMetaValues !== "") {
                            immutableMetaValues = immutableMetaValues + "," + immutableName + ":" + immutableType + "|" + immutableFieldValue
                        } else {
                            immutableMetaValues = immutableMetaValues + immutableName + ":" + immutableType + "|" + immutableFieldValue
                        }
                    } else {
                        if (immutableValues !== "") {
                            immutableValues = immutableValues + "," + immutableName + ":" + immutableType + "|" + immutableFieldValue
                        } else {
                            immutableValues = immutableValues + immutableName + ":" + immutableType + "|" + immutableFieldValue
                        }
                    }
                })
            }
            const issueIdentityResult = assetMint.mint(userAddress, "test", userTypeToken, toAddress, FromId, classificationId, mutableValues, immutableValues, mutableMetaValues, immutableMetaValues, 25, "stake", 200000, "block")
            console.log(issueIdentityResult, "result Issue Identity")
        }
    }
    return (
        <div className="accountInfo">

            <Modal.Header closeButton>
                Mint Asset
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
                                        <Form.Group controlId="formBasicCheckbox">
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

export default MintAsset;
