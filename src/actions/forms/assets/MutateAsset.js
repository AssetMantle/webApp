import React, {useState, useEffect} from "react";
import {Form, Button, Modal} from "react-bootstrap";
import metasQueryJS from "persistencejs/transaction/meta/query";
import assetMutateJS from "persistencejs/transaction/assets/mutate";
import {useTranslation} from "react-i18next";
import Loader from "../../../components/loader"
import ModalCommon from "../../../components/modal"
import config from "../../../constants/config.json"
import FilterHelpers from "../../../utilities/Helpers/filter";
import GetMeta from "../../../utilities/Helpers/getMeta";
import GetID from "../../../utilities/Helpers/getID";
import GetProperty from "../../../utilities/Helpers/getProperty";

const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const assetMutate = new assetMutateJS(process.env.REACT_APP_ASSET_MANTLE_API)

const MutateAsset = (props) => {
    const FilterHelper = new FilterHelpers();
    const GetMetaHelper = new GetMeta();
    const PropertyHelper = new GetProperty();
    const GetIDHelper = new GetID();
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [loader, setLoader] = useState(false)
    const [keyList, setKeyList] = useState([]);
    const [response, setResponse] = useState({});
    const [checkboxMutableNamesList, setCheckboxMutableNamesList] = useState([]);
    const [fromID, setFromID] = useState("");

    useEffect(() => {
        let fromIDValue = localStorage.getItem('fromID');
        setFromID(fromIDValue);
        const mutateProperties = props.mutatePropertiesList
        const mutableKeys = Object.keys(mutateProperties);
        setKeyList(mutableKeys);
        mutableKeys.map((keyName, idx) => {
            if (mutateProperties[keyName] !== "" && mutateProperties[keyName] !== null) {
                const metaQueryResult = metasQuery.queryMetaWithID(mutateProperties[keyName]);
                metaQueryResult.then(function (item) {
                    const data = JSON.parse(item);
                    let metaValue = GetMetaHelper.FetchMetaValue(data, mutateProperties[keyName]);
                    if (document.getElementById(keyName + idx)) {
                        document.getElementById(keyName + idx).value = metaValue;
                    }
                });
            }
        })
    }, [])

    const handleClose = () => {
        setShow(false);
        props.setExternalComponent("");
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
    const handleSubmit = (event) => {
        setLoader(true)
        event.preventDefault();
        const asset = props.asset;
        const FromId = event.target.FromId.value;
        const assetId = GetIDHelper.GetAssetID(asset)
        const assetList = asset.value.mutables.value.properties.value.propertyList
        let assetDataTypeList = {};
        assetList.forEach(function (item) {
            assetDataTypeList[item.value.id.value.idString] = item.value.fact.value.type;
        })
        if (checkboxMutableNamesList.length === 0) {
            setErrorMessage(t("SELECT_MUTABLE_META"))
            setLoader(false)
        } else if (keyList.length !== 0 && checkboxMutableNamesList.length !== 0 && keyList.length === checkboxMutableNamesList.length) {
            setErrorMessage(t("SELECT_ALL_MUTABLE_ERROR"))
            setLoader(false)
        } else {
            let mutableValues = "";
            let mutableMetaValues = "";
            if (keyList !== null) {
                keyList.map((key, index) => {
                        let mutableFieldValue = document.getElementById(key + index).value
                        const mutableType = assetDataTypeList[key];
                        const inputName = (key + index);
                        if (key !== config.URI) {
                            const mutableMetaValuesResponse = FilterHelper.setTraitValues(checkboxMutableNamesList, mutableValues, mutableMetaValues, inputName, key, mutableType, mutableFieldValue)
                            if (mutableMetaValuesResponse[0] !== "") {
                                mutableValues = mutableMetaValuesResponse[0];
                            }
                            if (mutableMetaValuesResponse[1] !== "") {
                                mutableMetaValues = mutableMetaValuesResponse[1];
                            }
                        }
                        let uriFieldValue;
                        let uriMutable;
                        if (key === config.URI) {
                            uriFieldValue = PropertyHelper.getUrlEncode(mutableFieldValue);
                            uriMutable = `URI:S|${uriFieldValue}`
                        }
                        if (uriMutable) {
                            if (mutableMetaValues) {
                                mutableMetaValues = mutableMetaValues + ',' + uriMutable;
                            } else {
                                mutableMetaValues = uriMutable;
                            }
                        }
                    }
                )
            }
            const userTypeToken = localStorage.getItem('mnemonic');
            const userAddress = localStorage.getItem('address');
            const mutateResponse = assetMutate.mutate(userAddress, "test", userTypeToken, FromId, assetId, mutableValues, mutableMetaValues, config.feesAmount, config.feesToken, config.gas, config.mode);
            mutateResponse.then(function (item) {
                const data = JSON.parse(JSON.stringify(item));
                setResponse(data)
                setShow(false);
                setLoader(false)
            })
        }
    };

    return (
        <div>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    {t("MUTATE_ASSET")}
                </Modal.Header>
                <div>
                    {loader ?
                        <Loader/>
                        : ""
                    }
                </div>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>{t("FROM_ID")}*</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="FromId"
                                required={true}
                                defaultValue={fromID !== null ? fromID : ""}
                                placeholder="FromId"
                            />
                        </Form.Group>
                        {keyList.map((keyName, idx) => {
                            if (keyName === config.URI) {
                                return (
                                    <div key={idx}>
                                        <Form.Group>
                                            <Form.Label>{keyName}*</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className=""
                                                required={true}
                                                id={keyName + idx}
                                                name={keyName + idx}
                                            />
                                        </Form.Group>
                                    </div>
                                )
                            }
                            return (
                                <div key={idx}>
                                    <Form.Group>
                                        <Form.Label>{keyName}*</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className=""
                                            required={true}
                                            id={keyName + idx}
                                            name={keyName + idx}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Check custom type="checkbox" label="Meta"
                                                    name={keyName + idx}
                                                    id={`checkbox${keyName + idx}`}
                                                    onClick={handleCheckMutableChange}
                                        />
                                    </Form.Group>
                                </div>
                            )
                        })
                        }
                        {errorMessage !== "" ?
                            <span className="error-response">{errorMessage}</span>
                            : ""

                        }
                        <div className="submitButtonSection">
                            <Button variant="primary" type="submit">
                                {t("submit")}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            {!(Object.keys(response).length === 0) ?
                <ModalCommon data={response} setExternal={handleClose}/>
                : ""
            }
        </div>
    );
};

export default MutateAsset;