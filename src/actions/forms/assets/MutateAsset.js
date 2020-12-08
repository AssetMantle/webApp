import React, {useState, useEffect} from "react";
import {Form, Button, Modal} from "react-bootstrap";
import metasQueryJS from "persistencejs/transaction/meta/query";
import Helpers from "../../../utilities/Helper";
import assetMutateJS from "persistencejs/transaction/assets/mutate";
import {useTranslation} from "react-i18next";
import Loader from "../../../components/loader"
import ModalCommon from "../../../components/modal"
import config from "../../../constants/config.json"

const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const assetMutate = new assetMutateJS(process.env.REACT_APP_ASSET_MANTLE_API)

const MutateAsset = (props) => {
    const Helper = new Helpers();
    const {t} = useTranslation();
    const [show, setShow] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [loader, setLoader] = useState(false)
    const [keyList, setKeyList] = useState([]);
    const [response, setResponse] = useState({});
    const [mutableProperties, setMutableProperties] = useState([]);
    const [checkboxMutableNamesList, setCheckboxMutableNamesList] = useState([]);
    useEffect(() => {
        const fetchList = async () => {
            const mutateProperties = props.mutatePropertiesList
            const mutableKeys = Object.keys(mutateProperties);
            setMutableProperties(mutateProperties);
            setKeyList(mutableKeys);
        }
        fetchList();
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
        const assetId = Helper.GetAssetID(asset.result.value.assets.value.list[0])
        const assetList = asset.result.value.assets.value.list[0].value.mutables.value.properties.value.propertyList
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
                        const mutableFieldValue = document.getElementById(key + index).value
                        const mutableType = assetDataTypeList[key];
                        const inputName = (key + index);

                        const mutableMetaValuesResponse = Helper.setTraitValues(checkboxMutableNamesList, mutableValues, mutableMetaValues, inputName, key, mutableType, mutableFieldValue)
                        if (mutableMetaValuesResponse[0] !== "") {
                            mutableValues = mutableMetaValuesResponse[0];
                        }
                        if (mutableMetaValuesResponse[1] !== "") {
                            mutableMetaValues = mutableMetaValuesResponse[1];
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
        <div className="accountInfo">

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
                            <Form.Label>{t("FROM_ID")}</Form.Label>
                            <Form.Control
                                type="text"
                                className=""
                                name="FromId"
                                required={true}
                                placeholder="FromId"
                            />
                        </Form.Group>
                        {keyList.map((keyName, idx) => {
                            if (mutableProperties[keyName] !== "" && mutableProperties[keyName] !== null) {
                                const metaQueryResult = metasQuery.queryMetaWithID(mutableProperties[keyName]);
                                metaQueryResult.then(function (item) {
                                    const data = JSON.parse(item);
                                    let metaValue = Helper.FetchMetaValue(data, mutableProperties[keyName]);
                                    if (document.getElementById(keyName + idx)) {
                                        document.getElementById(keyName + idx).value = metaValue;
                                    }
                                });
                            }
                            return (
                                <div key={idx}>
                                    <Form.Group>
                                        <Form.Label>{keyName}</Form.Label>
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
                            :""

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
                <ModalCommon data={response}/>
                : ""
            }
        </div>
    );
};

export default MutateAsset;