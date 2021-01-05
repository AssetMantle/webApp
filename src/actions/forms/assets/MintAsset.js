import React, {useState, useEffect} from "react";
import ClassificationsQueryJS from "persistencejs/transaction/classification/query";
import AssetMintJS from "persistencejs/transaction/assets/mint";
import {Form, Button, Modal} from "react-bootstrap";
import Helpers from "../../../utilities/Helper";
import {useTranslation} from "react-i18next";
import axios from "axios";
import metasQueryJS from "persistencejs/transaction/meta/query";
import config from "../../../constants/config.json"
import Loader from "../../../components/loader";
import ModalCommon from "../../../components/modal";
import FileBase64 from 'react-file-base64';
import sha1 from 'js-sha1';
import {Base64} from 'js-base64';
import IdentitiesIssueJS from "persistencejs/transaction/identity/issue";
import {issueIdentityUrl} from '../../../constants/url'
const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const assetMint = new AssetMintJS(process.env.REACT_APP_ASSET_MANTLE_API)
const identitiesIssue = new IdentitiesIssueJS(process.env.REACT_APP_ASSET_MANTLE_API)
const classificationsQuery = new ClassificationsQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)

const MintAsset = (props) => {
    const Helper = new Helpers();
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [uploadId, setUploadId] = useState("");
    const [base64URL, setBase64URL] = useState("");
    const [uploadFile, setUploadFile] = useState(null);
    const [loader, setLoader] = useState(false)
    const [response, setResponse] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [showNext, setShowNext] = useState(false);
    const [checkedD, setCheckedD] = useState({});
    const [classificationId, setClassificationId] = useState("");
    const [mutableList, setMutableList] = useState([]);
    const [immutableList, setImmutableList] = useState([]);
    const [inputValues, setInputValues] = useState([]);
    const [checkboxMutableNamesList, setCheckboxMutableNamesList] = useState([]);
    const [checkboxImmutableNamesList, setCheckboxImmutableNamesList] = useState([]);

    const handleCloseNext = () => {
        setShowNext(false);
        props.setExternalComponent("");
    };
    const handleClose = () => {
        setShow(false);
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
    const handleChangeMutable = (evt, idx) => {
        const newValue = evt.target.value;
        const checkError = Helper.mutableValidation(newValue);
        Helper.showHideDataTypeError(checkError, `mutableMint${idx}`);
        setInputValues({...inputValues, [evt.target.name]: newValue});
    }
    const handleChangeImmutable = (evt, idx) => {
        const newValue = evt.target.value;
        const checkError = Helper.mutableValidation(newValue);
        console.log(checkError, "error")
        Helper.showHideDataTypeError(checkError, `ImmutableMint${idx}`);
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
                Helper.FetchInputFieldMeta(immutablePropertyList, metasQuery, "MintAsset");
                setMutableList(mutablePropertyList)
                setImmutableList(immutablePropertyList)
            }
        })

        setShowNext(true)
        setShow(false);
    };
    const handleFormSubmit = (event) => {
        console.log(inputValues, "ARAY")
        setLoader(true)
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
            const toID = event.target.toID.value;
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
                    const immutableFieldValue = document.getElementById(`MintAsset${immutableName}|${immutableType}${index}`).value;
                    const ImmutableMetaValuesResponse = Helper.setTraitValues(checkboxImmutableNamesList, immutableValues, immutableMetaValues, immutableInputName, immutableName, immutableType, immutableFieldValue)
                    if (ImmutableMetaValuesResponse[0] !== "") {
                        immutableValues = ImmutableMetaValuesResponse[0];
                    }
                    if (ImmutableMetaValuesResponse[1] !== "") {
                        immutableMetaValues = ImmutableMetaValuesResponse[1];
                    }
                })
            }
            const assetMintResult = assetMint.mint(userAddress, "test", userTypeToken, toID, FromId, classificationId, mutableValues, immutableValues, mutableMetaValues, immutableMetaValues, config.feesAmount, config.feesToken, config.gas, config.mode)
            assetMintResult.then(function (item) {
                const data = JSON.parse(JSON.stringify(item));
                setResponse(data)
                setShowNext(false)
                setLoader(false)
            })
        }
    }

    const handleUpload = (id) =>{
        setUploadId(id);
        setShowUpload(true)
    }

   const getBase64 = (file) => {
        return new Promise(resolve => {
            let fileInfo;
            let baseURL = "";
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                baseURL = reader.result;
                resolve(baseURL);
            };
        });
    };
    const handleFileInputChange = (e) => {
        let file  = uploadFile;
        file = e.target.files[0];
        getBase64(file)
            .then(result => {
                file["base64"] = result;
                const fileBase64 = result.split('base64,')[1]
                const filesha1 = sha1(fileBase64);
                const fileBase64Encode = Base64.encode(filesha1);
                console.log("base64", fileBase64Encode);
                setInputValues({...inputValues, [uploadId]: fileBase64Encode});
                setLoader(false)
                document.getElementById(uploadId).value = fileBase64Encode;
                setShowUpload(false);
                setUploadFile(file);
                setBase64URL(result);
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
                {t("MINT_ASSET")}
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>{t("CLASSIFICATION_ID")} </Form.Label>
                        <Form.Control
                            type="text"
                            className=""
                            name="ClassificationId"
                            required={true}
                            placeholder={t("CLASSIFICATION_ID")}
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
                        <Loader />
                        : ""
                    }
                </div>
                <Modal.Header closeButton>
                    {t("MINT_ASSET")}
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group>
                            <Form.Label>{t("FROM_ID")}</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="FromId"
                                required={true}
                                placeholder={t("FROM_ID")}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>{t("TO_ID")}</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="toID"
                                required={true}
                                placeholder={t("TO_ID")}
                            />
                        </Form.Group>
                        {mutableList !== null ?
                            mutableList.map((mutable, index) => {
                                const mutableType = mutable.value.fact.value.type;
                                const mutableName = mutable.value.id.value.idString;
                                const id = `${mutableName}|${mutableType}${index}`;
                                return (
                                    <div key={index}>
                                        <Form.Group>
                                            <div className="upload-section">
                                            <Form.Label>Mutable Traits {mutableName}|{mutableType} </Form.Label>
                                                {mutableType === 'S'
                                                    ?
                                                    <Button variant="secondary"  size="sm" onClick={()=>handleUpload(id)}>upload</Button>
                                                    : ""
                                                }
                                            </div>
                                            <Form.Control
                                                type="text"
                                                className=""
                                                name={`${mutableName}|${mutableType}${index}`}
                                                id={`${mutableName}|${mutableType}${index}`}
                                                required={true}
                                                placeholder={t("TRAIT_VALUE")}
                                                onChange={(evt) => {
                                                    handleChangeMutable(evt, index + 1)
                                                }}
                                            />
                                        </Form.Group>
                                        <Form.Text id={`mutableMint${index + 1}`} className="text-muted none">
                                            {t("MUTABLE_VALIDATION_ERROR")}
                                        </Form.Text>
                                        <Form.Group controlId="formBasicCheckbox">
                                            <Form.Check custom type="checkbox" label="Meta"
                                                        name={`${mutableName}|${mutableType}${index}`}
                                                        id={`checkbox${mutableName}|${mutableType}${index}`}
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
                                const id = `MintAsset${immutableName}|${immutableType}${index}`
                                return (
                                    <div key={index}>
                                        <Form.Group>
                                            <div className="upload-section">
                                                <Form.Label>Immutable Traits {immutableName} |{immutableType} </Form.Label>
                                                {immutableType === 'S'
                                                    ?
                                                    <Button variant="secondary"  size="sm" onClick={()=>handleUpload(id)}>upload</Button>
                                                    : ""
                                                }
                                            </div>
                                            <Form.Control
                                                type="text"
                                                className=""
                                                name={`${immutableName}|${immutableType}${index}`}
                                                id={`MintAsset${immutableName}|${immutableType}${index}`}
                                                required={true}
                                                placeholder={t("TRAIT_VALUE")}
                                                onChange={(evt) => {
                                                    handleChangeImmutable(evt, index + 1)
                                                }}
                                                disabled={false}
                                            />
                                        </Form.Group>
                                        <Form.Text id={`ImmutableMint${index + 1}`} className="text-muted none">
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
                            })
                            :
                            ""
                        }
                        {errorMessage !== "" ?
                            <span className="error-response">{errorMessage}</span>
                            :""

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

export default MintAsset;
