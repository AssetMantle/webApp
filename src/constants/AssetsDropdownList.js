import React, {useState, useEffect} from "react";
import axios from "axios";
import {Form} from "react-bootstrap";
import {assetOrderURL, buyAssetHashURL} from "../constants/url"

const AssetsDropdown = () => {
    const [buyAsset, setbuyAsset] = useState('');
    const [assetList, setAssetList] = useState([]);
    useEffect(() => {
        const url = assetOrderURL();
        const fetchList = async () => {
            const response = await axios.get(url);
            const listData = response.data.result.value.orders.value.list
            if (listData !== null) {
                listData.map(function (item) {
                    if (item.value.immutables.value.properties.value.propertyList[0].value.id.value.idString === "Name") {
                        const hash = item.value.immutables.value.properties.value.propertyList[0].value.fact.value.hash;
                        const hashurl = buyAssetHashURL(hash);
                        axios.get(hashurl).then(
                            (hashresponse) => {
                                const listname2 = hashresponse.data.result.value.metas.value.list[0].value.data.value.value;
                                setAssetList(assetList => [...assetList, listname2]);
                            }
                        )
                    }
                    return "";
                })
            }
        }
        fetchList();
    }, []);


    const handleSelectChange = evt => {
        setbuyAsset(evt.target.value);
    }

    return (
        <div>
            <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Select Asset</Form.Label>
                <Form.Control as="select" name="selectChange" value={buyAsset} onChange={handleSelectChange}>
                    {
                        assetList.map((asset, index) => {
                                return (
                                    <option key={index} value={asset}>{asset}</option>
                                );
                            }
                        )
                    }
                </Form.Control>
            </Form.Group>
        </div>
    );
}
export default AssetsDropdown
