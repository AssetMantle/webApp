import React, {useEffect, useState} from "react";
import ClassificationsQueryJS from "persistencejs/transaction/classification/query";
import IdentitiesIssueJS from "persistencejs/transaction/identity/issue";
import {Form, Button, Modal} from "react-bootstrap";
import metasQueryJS from "persistencejs/transaction/meta/query";
import {useTranslation} from "react-i18next";
import config from "../../../constants/config.json"
import Loader from "../../../components/loader"
import ModalCommon from "../../../components/modal"
import FilterHelpers from "../../../utilities/Helpers/filter";
import GetMeta from "../../../utilities/Helpers/getMeta";
import GetProperty from "../../../utilities/Helpers/getProperty";

const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const identitiesIssue = new IdentitiesIssueJS(process.env.REACT_APP_ASSET_MANTLE_API)
const classificationsQuery = new ClassificationsQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)

const IssueIdentity = (props) => {
    const PropertyHelper = new GetProperty();
    const FilterHelper = new FilterHelpers();
    const GetMetaHelper = new GetMeta();

    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [showNext, setShowNext] = useState(false);
    const [loader, setLoader] = useState(false)
    const [response, setResponse] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [checkedD, setCheckedD] = useState({});
    const [classificationId, setClassificationId] = useState("");
    const [mutableList, setMutableList] = useState([]);
    const [immutableList, setImmutableList] = useState([]);
    const [inputValues, setInputValues] = useState([]);
    const [showUpload, setShowUpload] = useState(false);
    const [uploadId, setUploadId] = useState("");
    const [uploadFile, setUploadFile] = useState(null);
    const [checkboxMutableNamesList, setCheckboxMutableNamesList] = useState([]);
    const [checkboxImmutableNamesList, setCheckboxImmutableNamesList] = useState([]);
    const [fromID, setFromID] = useState("");

    useEffect(()=>{
        let fromIDValue = localStorage.getItem('fromID');
        setFromID(fromIDValue);
    },[])

    const handleClose = () => {
        setShow(false);
        props.setExternalComponent("");
    };
    const handleCloseNext = () => {
        setShowNext(false);
        props.setExternalComponent("");
    };
    const handleCloseUpload = () => {
        setShowUpload(false);
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
    const handleChangeMutable = (evt, idx, mutableName) => {
        const newValue = evt.target.value;
        if(mutableName !== config.URI) {
            const checkError = PropertyHelper.mutableValidation(newValue);
            PropertyHelper.showHideDataTypeError(checkError, `mutableIssueIdentity${idx}`);
        }
        setInputValues({...inputValues, [evt.target.name]: newValue});
    }

    const handleChangeImmutable = (evt, idx) => {
        const newValue = evt.target.value;
        const checkError = PropertyHelper.mutableValidation(newValue);
        PropertyHelper.showHideDataTypeError(checkError, `ImmutableIssueIdentity${idx}`);
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
                GetMetaHelper.FetchInputFieldMeta(immutablePropertyList, metasQuery, "IssueIdentity");
                GetMetaHelper.FetchMutableInputFieldMeta(mutablePropertyList, metasQuery, "IssueIdentity");
                setMutableList(mutablePropertyList)
                setImmutableList(immutablePropertyList)
            }
        })
        setShowNext(true);
        setShow(false);
    };
    const handleFormSubmit = (event) => {
        setLoader(true);
        event.preventDefault();
        if (checkboxMutableNamesList.length === 0) {
            setErrorMessage(t("SELECT_MUTABLE_META"))
            setLoader(false)
        } else if (mutableList.length !== 0 && checkboxMutableNamesList.length !== 0 && mutableList.length === checkboxMutableNamesList.length) {
            setErrorMessage(t("SELECT_ALL_MUTABLE_ERROR"))
            setLoader(false)
        } else if (immutableList.length !== 0 && checkboxImmutableNamesList.length !== 0 && immutableList.length === checkboxImmutableNamesList.length) {
            setErrorMessage(t("SELECT_ALL_IMMUTABLE_ERROR"))
            setLoader(false)
        } else if (checkboxImmutableNamesList.length === 0) {
            setErrorMessage(t("SELECT_IMMUTABLE_META"))
            setLoader(false)
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
                    const mutableHash = mutable.value.fact.value.hash;
                    let mutableFieldValue = inputValues[`${mutableName}|${mutableType}${index}`]
                    if (mutableName !== config.URI) {
                    const inputName = `${mutableName}|${mutableType}${index}`
                        const mutableMetaValuesResponse = FilterHelper.setTraitValues(checkboxMutableNamesList, mutableValues, mutableMetaValues, inputName, mutableName, mutableType, mutableFieldValue)
                        if (mutableMetaValuesResponse[0] !== "") {
                            mutableValues = mutableMetaValuesResponse[0];
                        }
                        if (mutableMetaValuesResponse[1] !== "") {
                            mutableMetaValues = mutableMetaValuesResponse[1];
                        }
                    }
                    let uriFieldValue;
                    let uriMutable;
                    if (mutableName === config.URI) {
                        let urimutableFieldValue = document.getElementById(`IssueIdentity${mutableName}|${mutableType}${index}`).value;
                        if (mutableHash === "") {
                            uriFieldValue = PropertyHelper.getUrlEncode(urimutableFieldValue);
                            uriMutable = `URI:S|${uriFieldValue}`
                        }else {
                            uriMutable = `URI:S|${urimutableFieldValue}`
                        }
                    }
                    if(uriMutable){
                        if (mutableMetaValues) {
                            mutableMetaValues = mutableMetaValues + ',' + uriMutable;
                        } else {
                            mutableMetaValues = uriMutable;
                        }
                    }
                })
            }
            if (immutableList !== null) {
                immutableList.map((immutable, index) => {
                    const immutableType = immutable.value.fact.value.type;
                    const immutableName = immutable.value.id.value.idString;
                    const immutableHash = immutable.value.fact.value.hash;
                    const immutableInputName = `${immutableName}|${immutableType}${index}`
                    let immutableFieldValue = document.getElementById(`IssueIdentity${immutableName}|${immutableType}${index}`).value;
                    if (immutableName !== config.URI) {
                        const ImmutableMetaValuesResponse = FilterHelper.setTraitValues(checkboxImmutableNamesList, immutableValues, immutableMetaValues, immutableInputName, immutableName, immutableType, immutableFieldValue)
                        if (ImmutableMetaValuesResponse[0] !== "") {
                            immutableValues = ImmutableMetaValuesResponse[0];
                        }
                        if (ImmutableMetaValuesResponse[1] !== "") {
                            immutableMetaValues = ImmutableMetaValuesResponse[1];
                        }
                    }
                    let uriImmutableFieldValue;
                    let uriImmutable;
                    if (immutableName === config.URI) {
                        if (immutableHash === "") {
                            uriImmutableFieldValue = PropertyHelper.getUrlEncode(immutableFieldValue);
                            uriImmutable = `URI:S|${uriImmutableFieldValue}`
                        }
                        else {
                            uriImmutable = `URI:S|${immutableFieldValue}`
                        }
                    }
                    if(uriImmutable){
                        if (immutableMetaValues) {
                            immutableMetaValues = immutableMetaValues + ',' + uriImmutable;
                        } else {
                            immutableMetaValues = uriImmutable;
                        }
                    }

                })
            }
            const issueIdentityResult = identitiesIssue.issue(userAddress, "test", userTypeToken, toAddress, FromId, classificationId, mutableValues, immutableValues, mutableMetaValues, immutableMetaValues, config.feesAmount, config.feesToken, config.gas, config.mode)
            issueIdentityResult.then(function (item) {
                const data = JSON.parse(JSON.stringify(item));
                setResponse(data);
                setShowNext(false);
                setLoader(false);
            })
        }
    }
    const handleUpload = (id) =>{
        setUploadId(id);
        setShowUpload(true)
    }

    const handleFileInputChange = (e) => {
        setLoader(true)
        let file  = uploadFile;
        file = e.target.files[0];
        PropertyHelper.getBase64(file)
            .then(result => {
                file["base64"] = result;
                const fileData = result.split('base64,')[1]
                const fileBase64Hash = PropertyHelper.getBase64Hash(fileData);
                setInputValues({...inputValues, [uploadId]: fileBase64Hash});
                setLoader(false)
                document.getElementById(uploadId).value = fileBase64Hash;
                setShowUpload(false);
                setUploadFile(file);
            })
            .catch(err => {
                console.log(err);
            });
        setUploadFile(e.target.files[0]);
    };
    return (
        <div>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    {t("ISSUE_IDENTITY")}
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>{t("CLASSIFICATION_ID")}*</Form.Label>
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
                                {t("NEXT")}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal
                show={showNext}
                onHide={handleCloseNext}
                backdrop="static"
                keyboard={false}
                centered
            >
                <div>
                    {loader ?
                        <Loader/>
                        : ""
                    }
                </div>
                <Modal.Header closeButton>
                    {t("ISSUE_IDENTITY")}
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group>
                            <Form.Label>{t("FROM_ID")}*</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="FromId"
                                defaultValue={fromID !== null ? fromID : ""}
                                required={true}
                                placeholder={t("FROM_ID")}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{t("TO_ADDRESS")}*</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="toAddress"
                                required={true}
                                placeholder={t("TO_ADDRESS")}
                            />
                        </Form.Group>
                        {mutableList !== null ?
                            mutableList.map((mutable, index) => {
                                const mutableType = mutable.value.fact.value.type;
                                const mutableName = mutable.value.id.value.idString;
                                const mutableHash = mutable.value.fact.value.hash;
                                const id =`${mutableName}|${mutableType}${index}`;
                                if (mutableName === config.URI) {
                                    return (
                                        <div key={index}>
                                            <Form.Group>
                                                <Form.Label>Mutable
                                                    Traits {mutableName} |{mutableType}* </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className=""
                                                    name={`${mutableName}|${mutableType}${index}`}
                                                    required={true}
                                                    id={`IssueIdentity${mutableName}|${mutableType}${index}`}
                                                    placeholder="Trait Value"
                                                    onChange={(evt) => {
                                                        handleChangeMutable(evt, index + 1, mutableName)
                                                    }}
                                                    disabled={false}
                                                />
                                            </Form.Group>
                                            <Form.Text id={`ImmutableIssueIdentity${index + 1}`}
                                                       className="text-muted none">

                                            </Form.Text>

                                        </div>
                                    )
                                }
                                else {
                                    return (
                                        <div key={index}>
                                            <Form.Group>
                                                <div className="upload-section">
                                                    <Form.Label>Mutable Traits {mutableName}|{mutableType}* </Form.Label>
                                                    {mutableType === 'S' && mutableName !== config.URI
                                                        ?
                                                        <Button variant="secondary" size="sm"
                                                                onClick={() => handleUpload(id)}>upload</Button>
                                                        : ""
                                                    }
                                                </div>
                                                <Form.Control
                                                    type="text"
                                                    className=""
                                                    name={`${mutableName}|${mutableType}${index}`}
                                                    id={`${mutableName}|${mutableType}${index}`}
                                                    required={true}
                                                    placeholder="Trait Value"
                                                    onChange={(evt) => {
                                                        handleChangeMutable(evt, index + 1, mutableName)
                                                    }}
                                                />
                                            </Form.Group>
                                                <Form.Text id={`mutableIssueIdentity${index + 1}`}
                                                           className="text-muted none">
                                                    {t("MUTABLE_VALIDATION_ERROR")}
                                                </Form.Text>
                                            <Form.Group>
                                                <Form.Check custom type="checkbox" label="Meta"
                                                            name={`${mutableName}|${mutableType}${index}`}
                                                            id={`checkbox${mutableName}|${mutableType}${index}`}
                                                            onClick={handleCheckMutableChange}
                                                />
                                            </Form.Group>
                                        </div>
                                    )
                                }
                            })
                            :
                            ""
                        }

                        {immutableList !== null ?
                            immutableList.map((immutable, index) => {
                                const immutableType = immutable.value.fact.value.type;
                                const immutableHash = immutable.value.fact.value.hash;
                                const immutableName = immutable.value.id.value.idString;
                                const id = `IssueIdentity${immutableName}|${immutableType}${index}`
                                if (immutableName === config.URI) {

                                    return (
                                        <div key={index}>
                                            <Form.Group>
                                                <Form.Label>Immutable
                                                    Traits {immutableName} |{immutableType}* </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className=""
                                                    name={`${immutableName}|${immutableType}${index}`}
                                                    required={true}
                                                    id={`IssueIdentity${immutableName}|${immutableType}${index}`}
                                                    placeholder="Trait Value"
                                                    onChange={(evt) => {
                                                        handleChangeImmutable(evt, index + 1)
                                                    }}
                                                    disabled={false}
                                                />
                                            </Form.Group>
                                            <Form.Text id={`ImmutableIssueIdentity${index + 1}`}
                                                       className="text-muted none">

                                            </Form.Text>

                                        </div>
                                    )
                                }else {
                                    return (
                                        <div key={index}>
                                            <Form.Group>
                                                <div className="upload-section">
                                                    <Form.Label>Immutable
                                                        Traits {immutableName} |{immutableType}* </Form.Label>
                                                    {immutableType === 'S' && immutableHash === ""
                                                        ?
                                                        <Button variant="secondary" size="sm"
                                                                onClick={() => handleUpload(id)}>upload</Button>
                                                        : ""
                                                    }
                                                </div>

                                                <Form.Control
                                                    type="text"
                                                    className=""
                                                    name={`${immutableName}|${immutableType}${index}`}
                                                    required={true}
                                                    id={`IssueIdentity${immutableName}|${immutableType}${index}`}
                                                    placeholder="Trait Value"
                                                    onChange={(evt) => {
                                                        handleChangeImmutable(evt, index + 1)
                                                    }}
                                                    disabled={false}
                                                />
                                            </Form.Group>
                                            <Form.Text id={`ImmutableIssueIdentity${index + 1}`}
                                                       className="text-muted none">
                                                {t("MUTABLE_VALIDATION_ERROR")}
                                            </Form.Text>
                                            <Form.Group>
                                                <Form.Check custom type="checkbox" label="Meta"
                                                            name={`${immutableName}|${immutableType}${index}`}
                                                            id={`checkbox${immutableName}|${immutableType}${index}`}
                                                            onChange={handleCheckImmutableChange}/>
                                            </Form.Group>
                                        </div>
                                    )
                                }
                            })
                            :
                            ""
                        }
                        {errorMessage !== "" ?
                            <span className="error-response">{errorMessage}</span>
                            : ""
                        }
                        <div className="submitButtonSection">
                            <Button variant="primary" type="submit">
                                {t("SUBMIT")}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={showUpload} onHide={handleCloseUpload} centered >
                <Modal.Body className="upload-modal">
                    <input type="file" name="file" onChange={handleFileInputChange} />
                </Modal.Body>
            </Modal>
            {!(Object.keys(response).length === 0) ?
                <ModalCommon data={response} setExternal={handleClose}/>
                : ""
            }
        </div>
    );
};

export default IssueIdentity;
