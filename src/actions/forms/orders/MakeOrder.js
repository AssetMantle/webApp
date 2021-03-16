import React, {useEffect, useState} from "react";
import {Form, Button, Modal} from "react-bootstrap";
import ClassificationsQueryJS from "persistencejs/transaction/classification/query";
import ordersMakeJS from "persistencejs/transaction/orders/make";
import metasQueryJS from "persistencejs/transaction/meta/query";
import {useTranslation} from "react-i18next";
import Loader from "../../../components/loader"
import ModalCommon from "../../../components/modal"
import config from "../../../constants/config.json"

import FilterHelpers from "../../../utilities/Helpers/filter";
import GetMeta from "../../../utilities/Helpers/getMeta";
import GetProperty from "../../../utilities/Helpers/getProperty";

const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const ordersMake = new ordersMakeJS(process.env.REACT_APP_ASSET_MANTLE_API)
const classificationsQuery = new ClassificationsQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
var bigdecimal = require("bigdecimal");
var bigDecimal = require('js-big-decimal');
const MakeOrder = (props) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loader, setLoader] = useState(false)
    const [showNext, setShowNext] = useState(true);
    const [classificationId, setClassificationId] = useState("");
    const [response, setResponse] = useState({});
    const [checkboxMutableNamesList, setCheckboxMutableNamesList] = useState([]);
    const [mutableList, setMutableList] = useState([]);
    const [immutableList, setImmutableList] = useState([]);
    const [inputValues, setInputValues] = useState([]);
    const [showUpload, setShowUpload] = useState(false);
    const [uploadId, setUploadId] = useState("");
    const [uploadFile, setUploadFile] = useState(null);
    const [checkedD, setCheckedD] = useState({});
    const [checkboxImmutableNamesList, setCheckboxImmutableNamesList] = useState([]);
    const PropertyHelper = new GetProperty();
    const FilterHelper = new FilterHelpers();
    const GetMetaHelper = new GetMeta();

    const handleCloseNext = () => {
        setShowNext(false);
        props.setExternalComponent("");
    };
    useEffect(() => {
        let orderClassificationID = localStorage.getItem('orderClassificationID');
        const ClassificationId = orderClassificationID;
        setClassificationId(ClassificationId)
        const classificationResponse = classificationsQuery.queryClassificationWithID(ClassificationId)
        classificationResponse.then(function (item) {
            const data = JSON.parse(JSON.parse(JSON.stringify(item)));
            if (data.result.value.classifications.value.list !== null) {
                const immutablePropertyList = data.result.value.classifications.value.list[0].value.immutableTraits.value.properties.value.propertyList;
                const mutablePropertyList = data.result.value.classifications.value.list[0].value.mutableTraits.value.properties.value.propertyList;
                GetMetaHelper.FetchInputFieldMeta(immutablePropertyList, metasQuery, "MakeOrder");
                GetMetaHelper.FetchMutableInputFieldMeta(mutablePropertyList, metasQuery, "MakeOrderMutable");
                setMutableList(mutablePropertyList);
                setImmutableList(immutablePropertyList)
            }
        })
    }, []);
    const handleClose = () => {
        setShow(false);
        props.setExternalComponent("");
    };
    const handleCloseUpload = () => {
        setShowUpload(false);
    };
    // const handleCheckMutableChange = evt => {
    //     const checkedValue = evt.target.checked;
    //     const name = evt.target.getAttribute("name")
    //     if (checkedValue) {
    //         const checkboxNames = evt.target.name;
    //         setCheckboxMutableNamesList((checkboxMutableNamesList) => [...checkboxMutableNamesList, checkboxNames]);
    //     } else {
    //         if (checkboxMutableNamesList.includes(name)) {
    //             setCheckboxMutableNamesList(checkboxMutableNamesList.filter(item => item !== name));
    //         }
    //     }
    // }
    //
    // const handleCheckImmutableChange = evt => {
    //     const checkedValue = evt.target.checked;
    //     setCheckedD({...checkedD, [evt.target.name]: evt.target.checked});
    //
    //     const name = evt.target.getAttribute("name")
    //     if (checkedValue) {
    //         const checkboxNames = evt.target.name;
    //         setCheckboxImmutableNamesList((checkboxImmutableNamesList) => [...checkboxImmutableNamesList, checkboxNames]);
    //     } else {
    //         if (checkboxImmutableNamesList.includes(name)) {
    //             setCheckboxImmutableNamesList(checkboxImmutableNamesList.filter(item => item !== name));
    //         }
    //     }
    //
    // }
    const handleChangeExchangeRate = (evt, idx) => {
        let inputValue = new bigdecimal.BigDecimal(evt.target.value);
        // let smallestNumber = new bigdecimal.BigDecimal(0.000000000000000001);
        let biggestNumber = new bigdecimal.BigDecimal(1000000000000000000);
        // console.log("d * x = " + inputValue.divide(smallestNumber));
        let newValue = inputValue.multiply(biggestNumber);
        var value = bigDecimal.round(newValue, 18);
        console.log("d * inewValue = " , value);
        document.getElementById("exchangeRateSplit").value = value;
        document.getElementById("exchangeRateSplit").innerHTML=value;
    };
    const handleChangeMutable = (evt, idx) => {
        const newValue = evt.target.value;
        // const checkError = PropertyHelper.mutableValidation(newValue);
        // PropertyHelper.showHideDataTypeError(checkError, `mutableMakeOrder${idx}`);
        setInputValues({...inputValues, [evt.target.name]: newValue});
    }

    const handleChangeImmutable = (evt, idx) => {
        const newValue = evt.target.value;
        // const checkError = PropertyHelper.mutableValidation(newValue);
        // PropertyHelper.showHideDataTypeError(checkError, `ImmutableMakeOrder${idx}`);
        setInputValues({...inputValues, [evt.target.name]: newValue});
    }
    const handleSubmit = (event) => {

        setShowNext(true)
        setShow(false);
    };
    const handleFormSubmit = (event) => {
        setLoader(false)
        event.preventDefault();
        const assetId = props.ownableId;
        const FromId = event.target.FromId.value;
        const TakerOwnableId = event.target.TakerOwnableId.value;
        const Makersplit = event.target.Makersplit.value;
        const ExpiresIn = event.target.expiresInD.value;
        // if (checkboxMutableNamesList.length === 0) {
        //     setErrorMessage(t("SELECT_MUTABLE_META"))
        //     setLoader(false)
        // } else if (mutableList.length !== 0 && checkboxMutableNamesList.length !== 0 && mutableList.length === checkboxMutableNamesList.length) {
        //     setErrorMessage(t("SELECT_ALL_MUTABLE_ERROR"))
        //     setLoader(false)
        // } else if (immutableList.length !== 0 && checkboxImmutableNamesList.length !== 0 && immutableList.length === checkboxImmutableNamesList.length) {
        //     setErrorMessage(t("SELECT_ALL_IMMUTABLE_ERROR"))
        //     setLoader(false)
        // } else if (checkboxImmutableNamesList.length === 0) {
        //     setErrorMessage("SELECT_IMMUTABLE_META")
        //     setLoader(false)
        // } else {
            let mutableValues = "";
            let immutableValues = "";
            let mutableMetaValues = "";
            let immutableMetaValues = "";
            if (mutableList !== null) {
                mutableList.map((mutable, index) => {
                    let mutableType = mutable.value.fact.value.type;
                    let mutableName = mutable.value.id.value.idString;
                    let mutableHash = mutable.value.fact.value.hash;
                    // id={`MakeOrderMutable${mutableName}|${mutableType}${index}`}
                    if ((mutableName !== 'expiry') && (mutableName !== "makerOwnableSplit")) {
                        let mutableFieldValue ='';
                        if(mutableName === 'exchangeRate'){
                             mutableFieldValue = document.getElementById('exchangeRateSplit').value;
                        }
                        else {
                             mutableFieldValue = document.getElementById(`MakeOrderMutable${mutableName}|${mutableType}${index}`).value;
                        }
                        // let mutableFieldValue = inputValues[`${mutableName}|${mutableType}${index}`]
                        if (mutableFieldValue === undefined) {
                            mutableFieldValue = "";
                        }
                        // if (mutableName !== config.URI) {
                        //     const inputName = `${mutableName}|${mutableType}${index}`
                        //     const mutableMetaValuesResponse = FilterHelper.setTraitValues(checkboxMutableNamesList, mutableValues, mutableMetaValues, inputName, mutableName, mutableType, mutableFieldValue)
                        //     if (mutableMetaValuesResponse[0] !== "") {
                        //         mutableValues = mutableMetaValuesResponse[0];
                        //     }
                        //     if (mutableMetaValuesResponse[1] !== "") {
                        //         mutableMetaValues = mutableMetaValuesResponse[1];
                        //     }
                        // }
                        if (mutableName !== config.URI) {
                            if(mutableName === 'takerID'){
                                mutableValues = FilterHelper.setTraitValuesWithoutCheckbox(mutableValues, mutableName, mutableType, mutableFieldValue)
                            }
                            else{
                                mutableMetaValues = FilterHelper.setTraitValuesWithoutCheckbox(mutableMetaValues, mutableName, mutableType, mutableFieldValue)
                            }
                        }
                        let uriFieldValue;
                        let uriMutable;
                        if (mutableName === config.URI) {
                            let urimutableFieldValue = document.getElementById(`MakeOrderMutable${mutableName}|${mutableType}${index}`).value;
                            if (mutableHash === "") {
                                uriFieldValue = PropertyHelper.getUrlEncode(urimutableFieldValue);
                                uriMutable = `URI:S|${uriFieldValue}`
                            } else {
                                uriMutable = `URI:S|${urimutableFieldValue}`
                            }
                        }
                        if (uriMutable) {
                            if (mutableMetaValues) {
                                mutableMetaValues = mutableMetaValues + ',' + uriMutable;
                            } else {
                                mutableMetaValues = uriMutable;
                            }
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
                    let immutableFieldValue = document.getElementById(`MakeOrder${immutableName}|${immutableType}${index}`).value;
                    if (immutableName !== config.URI) {
                        if (immutableName === "style" || immutableName === "type"){
                            immutableValues = FilterHelper.setTraitValuesWithoutCheckbox(immutableValues, immutableName, immutableType, immutableFieldValue)
                        }
                        else{
                            immutableMetaValues = FilterHelper.setTraitValuesWithoutCheckbox(immutableMetaValues, immutableName, immutableType, immutableFieldValue)
                        }
                    }
                    let uriImmutableFieldValue;
                    let uriImmutable;
                    if (immutableName === config.URI) {
                        if (immutableHash === "") {
                            uriImmutableFieldValue = PropertyHelper.getUrlEncode(immutableFieldValue);
                            uriImmutable = `URI:S|${uriImmutableFieldValue}`
                        } else {
                            uriImmutable = `URI:S|${immutableFieldValue}`
                        }
                    }
                    if (uriImmutable) {
                        if (immutableMetaValues) {
                            immutableMetaValues = immutableMetaValues + ',' + uriImmutable;
                        } else {
                            immutableMetaValues = uriImmutable;
                        }
                    }
                })
            }
            const userTypeToken = localStorage.getItem('mnemonic');
            const userAddress = localStorage.getItem('address');
            const makeOrderResult = ordersMake.make(userAddress, "test", userTypeToken, FromId, classificationId, assetId, TakerOwnableId, ExpiresIn, Makersplit, mutableValues, immutableValues, mutableMetaValues, immutableMetaValues, config.feesAmount, config.feesToken, config.gas, config.mode)
            makeOrderResult.then(function (item) {
                const data = JSON.parse(JSON.stringify(item));
                setResponse(data)
                setShowNext(false);
                setLoader(false)
            })
        // }
    }
    const handleUpload = (id) => {
        setUploadId(id);
        setShowUpload(true)
    }
    const handleFileInputChange = (e) => {
        setLoader(true)
        let file = uploadFile;
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
                    {t("MAKE_ORDER")}
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
                <Modal.Header closeButton>
                    {t("MAKE_ORDER")}
                </Modal.Header>
                <div>
                    {loader ?
                        <Loader/>
                        : ""
                    }
                </div>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group className="hidden">
                            <Form.Label>{t("FROM_ID")}*</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="FromId"
                                required={true}
                                placeholder={t("FROM_ID")}
                                value={localStorage.getItem('identityID')}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group className="hidden">
                            <Form.Label>{t("TAKER_OWNABLE_SPLIT")}*</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="TakerOwnableId"
                                value="stake"
                                required={true}
                                placeholder={t("TAKER_OWNABLE_SPLIT")}
                            />
                        </Form.Group>
                        <Form.Group className="hidden">
                            <Form.Label>{t("MAKER_SPLIT")}*</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                value="0.000000000000000001"
                                name="Makersplit"
                                required={true}
                                placeholder={t("MAKER_SPLIT")}
                            />
                        </Form.Group>
                        <Form.Group className="hidden">
                            <Form.Label>{t("EXPIRES_IN")}*</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                value="9999999999"
                                name="expiresInD"
                                required={true}
                                placeholder={t("EXPIRES_IN")}
                            />
                        </Form.Group>
                        {mutableList !== null ?
                            mutableList.map((mutable, index) => {
                                const mutableType = mutable.value.fact.value.type;
                                const mutableHash = mutable.value.fact.value.hash;
                                const mutableName = mutable.value.id.value.idString;
                                const id = `${mutableName}|${mutableType}${index}`;

                                if ((mutableName !== 'expiry') && (mutableName !== "makerOwnableSplit")) {
                                    if (mutableName === 'takerID') {
                                        return (
                                            <div key={index} className="hidden">
                                                <Form.Group>
                                                    <div className="upload-section">
                                                        <Form.Label>Mutable
                                                            Traits {mutableName}|{mutableType} </Form.Label>
                                                        {mutableType === 'S' && mutableHash === ""
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
                                                        id={`MakeOrderMutable${mutableName}|${mutableType}${index}`}
                                                        required={false}
                                                        placeholder="Trait Value"
                                                        onChange={(evt) => {
                                                            handleChangeMutable(evt, index + 1)
                                                        }}
                                                    />
                                                </Form.Group>
                                                <Form.Text id={`mutableMakeOrder${index + 1}`}
                                                           className="text-muted none">
                                                    {t("MUTABLE_VALIDATION_ERROR")}
                                                </Form.Text>
                                            </div>
                                        )
                                    } else if (mutableName === config.URI) {
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
                                                        id={`MakeOrderMutable${mutableName}|${mutableType}${index}`}
                                                        placeholder="Trait Value"
                                                        onChange={(evt) => {
                                                            handleChangeMutable(evt, index + 1, mutableName)
                                                        }}
                                                        disabled={false}
                                                    />
                                                </Form.Group>
                                                <Form.Text id={`mutableMakeOrder${index + 1}`}
                                                           className="text-muted none">

                                                </Form.Text>

                                            </div>
                                        )
                                    } else if (mutableName === 'exchangeRate') {
                                        return (
                                            <div key={index}>
                                                <Form.Group>
                                                    <div className="upload-section">
                                                        <Form.Label>Amount</Form.Label>
                                                    </div>
                                                    <Form.Control
                                                        type="number"
                                                        className=""
                                                        name={`${mutableName}|${mutableType}${index}`}
                                                        id={`MakeOrderMutable${mutableName}|${mutableType}${index}`}
                                                        required={true}
                                                        placeholder="Amount"
                                                        onChange={(evt) => {
                                                            handleChangeExchangeRate(evt, index + 1)
                                                        }}
                                                    />
                                                </Form.Group>
                                                <Form.Text id="exchangeRateSplit"
                                                           className="text-muted">

                                                </Form.Text>
                                            </div>
                                        )
                                    }
                                    else if (mutableName === 'SellerName') {
                                        return (
                                            <div key={index} >
                                                <Form.Group>
                                                    <div className="upload-section">
                                                        <Form.Label>Seller Name</Form.Label>
                                                    </div>
                                                    <Form.Control
                                                        type="text"
                                                        className=""
                                                        name={`${mutableName}|${mutableType}${index}`}
                                                        id={`MakeOrderMutable${mutableName}|${mutableType}${index}`}
                                                        required={true}
                                                        value={localStorage.getItem('ArtistName')}
                                                        placeholder="Trait Value"
                                                        onChange={(evt) => {
                                                            handleChangeMutable(evt, index + 1)
                                                        }}
                                                    />
                                                </Form.Group>
                                                <Form.Text id={`mutableMakeOrder${index + 1}`}
                                                           className="text-muted none">
                                                    {t("MUTABLE_VALIDATION_ERROR")}
                                                </Form.Text>
                                            </div>
                                        )
                                    }
                                    else {
                                        return (
                                            <div key={index}>
                                                <Form.Group>
                                                    <div className="upload-section">
                                                        <Form.Label>{mutableName} </Form.Label>
                                                    </div>
                                                    <Form.Control
                                                        type="text"
                                                        className=""
                                                        name={`${mutableName}|${mutableType}${index}`}
                                                        id={`MakeOrderMutable${mutableName}|${mutableType}${index}`}
                                                        required={false}
                                                        placeholder="Trait Value"
                                                        onChange={(evt) => {
                                                            handleChangeMutable(evt, index + 1)
                                                        }}
                                                    />
                                                </Form.Group>
                                                <Form.Text id={`mutableMakeOrder${index + 1}`}
                                                           className="text-muted none">
                                                    {t("MUTABLE_VALIDATION_ERROR")}
                                                </Form.Text>
                                            </div>
                                        )
                                    }
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
                                const id = `MakeOrder${immutableName}|${immutableType}${index}`;
                                console.log(immutableName, localStorage.getItem('identifierName'),"localStorage.getItem('ArtistName')")
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
                                                    id={`MakeOrder${immutableName}|${immutableType}${index}`}
                                                    required={true}
                                                    placeholder="Trait Value"
                                                    onChange={(evt) => {
                                                        handleChangeImmutable(evt, index + 1)
                                                    }}
                                                    disabled={false}
                                                />
                                            </Form.Group>
                                            <Form.Text id={`ImmutableMakeOrder${index + 1}`}
                                                       className="text-muted none">

                                            </Form.Text>
                                        </div>
                                    )
                                }
                                else if (immutableName === "style" || immutableName === "type") {
                                    return (
                                        <div key={index} className="hidden">
                                            <Form.Group >
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
                                                    id={`MakeOrder${immutableName}|${immutableType}${index}`}
                                                    required={true}
                                                    placeholder="Trait Value"
                                                    onChange={(evt) => {
                                                        handleChangeImmutable(evt, index + 1)
                                                    }}
                                                    disabled={false}
                                                />
                                            </Form.Group>
                                            <Form.Text id={`ImmutableMakeOrder${index + 1}`}
                                                       className="text-muted none">
                                                {t("MUTABLE_VALIDATION_ERROR")}
                                            </Form.Text>
                                        </div>
                                    )
                                }
                                else if (immutableName === "identifier") {
                                    return (
                                        <div key={index}>
                                            <Form.Group >
                                                <div className="upload-section">
                                                    <Form.Label>Title</Form.Label>
                                                </div>

                                                <Form.Control
                                                    type="text"
                                                    className=""
                                                    name={`${immutableName}|${immutableType}${index}`}
                                                    id={`MakeOrder${immutableName}|${immutableType}${index}`}
                                                    required={true}
                                                    value={localStorage.getItem('identifierName')}
                                                    placeholder="Title"
                                                    onChange={(evt) => {
                                                        handleChangeImmutable(evt, index + 1)
                                                    }}
                                                    disabled={false}
                                                />
                                            </Form.Group>
                                            <Form.Text id={`ImmutableMakeOrder${index + 1}`}
                                                       className="text-muted none">
                                                {t("MUTABLE_VALIDATION_ERROR")}
                                            </Form.Text>
                                        </div>
                                    )
                                }
                                else if (immutableName === "classifier") {
                                    return (
                                        <div key={index} className="hidden">
                                            <Form.Group >
                                                <div className="upload-section">
                                                    <Form.Label>Classifier</Form.Label>
                                                </div>

                                                <Form.Control
                                                    type="text"
                                                    className=""
                                                    name={`${immutableName}|${immutableType}${index}`}
                                                    id={`MakeOrder${immutableName}|${immutableType}${index}`}
                                                    required={true}
                                                    value={localStorage.getItem('descriptionName')}
                                                    placeholder="Classifier"
                                                    onChange={(evt) => {
                                                        handleChangeImmutable(evt, index + 1)
                                                    }}
                                                    disabled={false}
                                                />
                                            </Form.Group>
                                            <Form.Text id={`ImmutableMakeOrder${index + 1}`}
                                                       className="text-muted none">
                                                {t("MUTABLE_VALIDATION_ERROR")}
                                            </Form.Text>
                                        </div>
                                    )
                                }
                                else if (immutableName === "description") {
                                    return (
                                        <div key={index}>
                                            <Form.Group >
                                                <div className="upload-section">
                                                    <Form.Label>Description</Form.Label>
                                                </div>

                                                <Form.Control
                                                    type="text"
                                                    className=""
                                                    name={`${immutableName}|${immutableType}${index}`}
                                                    id={`MakeOrder${immutableName}|${immutableType}${index}`}
                                                    required={true}
                                                    value={localStorage.getItem('descriptionName')}
                                                    placeholder="Description"
                                                    onChange={(evt) => {
                                                        handleChangeImmutable(evt, index + 1)
                                                    }}
                                                    disabled={false}
                                                />
                                            </Form.Group>
                                            <Form.Text id={`ImmutableMakeOrder${index + 1}`}
                                                       className="text-muted none">
                                                {t("MUTABLE_VALIDATION_ERROR")}
                                            </Form.Text>
                                        </div>
                                    )
                                }
                                else {
                                    return (
                                        <div key={index}>
                                            <Form.Group >
                                                <div className="upload-section">
                                                    <Form.Label>{immutableName}</Form.Label>
                                                </div>

                                                <Form.Control
                                                    type="text"
                                                    className=""
                                                    name={`${immutableName}|${immutableType}${index}`}
                                                    id={`MakeOrder${immutableName}|${immutableType}${index}`}
                                                    required={true}
                                                    placeholder="Trait Value"
                                                    onChange={(evt) => {
                                                        handleChangeImmutable(evt, index + 1)
                                                    }}
                                                    disabled={false}
                                                />
                                            </Form.Group>
                                            <Form.Text id={`ImmutableMakeOrder${index + 1}`}
                                                       className="text-muted none">
                                                {t("MUTABLE_VALIDATION_ERROR")}
                                            </Form.Text>
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
            <Modal show={showUpload} onHide={handleCloseUpload} centered>
                <Modal.Body className="upload-modal">
                    <input type="file" name="file" onChange={handleFileInputChange}/>
                </Modal.Body>
            </Modal>
            {!(Object.keys(response).length === 0) ?
                <ModalCommon data={response} setExternal={handleClose}/>
                : ""
            }
        </div>
    );
};

export default MakeOrder;
