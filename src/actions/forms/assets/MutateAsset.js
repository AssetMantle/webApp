import React, {useState, useEffect} from "react";
import {Form, Button, Modal} from "react-bootstrap";
import metasQueryJS from "persistencejs/transaction/meta/query";
import Helpers from "../../../utilities/helper";
import assetMutateJS from "persistencejs/transaction/assets/mutate";
const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const assetMutate = new assetMutateJS(process.env.REACT_APP_ASSET_MANTLE_API)

const MutateAsset = (props) => {
    const Helper = new Helpers();
    const [keyList, setKeyList] = useState([]);
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
    },[])

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
            alert("select mutable meta")
        } else if (keyList.length !== 0 && checkboxMutableNamesList.length !== 0 && keyList.length === checkboxMutableNamesList.length) {
            alert("you can't select all as mutable meta")
        } else {
            var mutableValues = "";
            var mutableMetaValues = "";
            if (keyList !== null) {
                keyList.map((key, index) => {
                    const mutableFieldValue = document.getElementById(key + index).value
                    const mutableType = assetDataTypeList[key];
                    const inputName = (key+index);

                    const mutableMetaValuesResponse = Helper.setTraitValues(checkboxMutableNamesList, mutableValues, mutableMetaValues, inputName, key, mutableType, mutableFieldValue)
                    if(mutableMetaValuesResponse[0] !== "") {
                        mutableValues = mutableMetaValuesResponse[0];
                    }
                    if(mutableMetaValuesResponse[1] !== "") {
                        mutableMetaValues =  mutableMetaValuesResponse[1];
                    }
                    }
                )
            }
            const userTypeToken = localStorage.getItem('mnemonic');
            const userAddress = localStorage.getItem('address');
            const mutateResponse = assetMutate.mutate(userAddress, "test", userTypeToken,FromId, assetId, mutableValues, mutableMetaValues, 25, "stake", 200000, "block");
            console.log(mutateResponse, "mutateResponse")
        }
    };

    return (
        <div className="accountInfo">
            <Modal.Header closeButton>
                Mutate Asset
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
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
                    {keyList.map((keyName, idx) => {
                        if(mutableProperties[keyName] !== "" && mutableProperties[keyName] !== null) {
                            const metaQueryResult = metasQuery.queryMetaWithID(mutableProperties[keyName]);
                            metaQueryResult.then(function (item) {
                                const data = JSON.parse(item);
                                let metaValue = Helper.FetchMetaValue(data, mutableProperties[keyName]);
                                if(document.getElementById(keyName + idx)) {
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
                                <Form.Group controlId="formBasicCheckbox">
                                    <Form.Check type="checkbox" label="Meta"
                                                name={keyName + idx}
                                                onClick={handleCheckMutableChange}
                                    />
                                </Form.Group>
                            </div>
                            )
                    })
                    }
                    <div className="submitButtonSection">
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </div>
    );
};

export default MutateAsset;