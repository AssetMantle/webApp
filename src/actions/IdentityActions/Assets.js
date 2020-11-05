import React, {useState, useEffect} from "react";
import ReactDOM from 'react-dom';
import splitsQueryJS from "persistencejs/transaction/splits/query";
import assetsQueryJS from "persistencejs/transaction/assets/query";
import Helpers from "../../utilities/helper";
import {Modal, Form, Button} from "react-bootstrap";
import metasQueryJS from "persistencejs/transaction/meta/query";
import identitiesQueryJS from "persistencejs/transaction/identity/query";

const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const identitiesQuery = new identitiesQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const assetsQuery = new assetsQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const splitsQuery = new splitsQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)


const Assets = () => {
    const Helper = new Helpers();
    const [assetList, setAssetList] = useState([]);
    const userAddress = localStorage.getItem('address');
    useEffect(() => {
        const fetchAssets = () => {
            const identities = identitiesQuery.queryIdentityWithID("all")
            identities.then(function (item) {
                const data = JSON.parse(item);
                const dataList = data.result.value.identities.value.list;
                const filterIdentities = Helper.FilterIdentitiesByProvisionedAddress(dataList, userAddress)
                const splits = splitsQuery.querySplitsWithID("all")

                splits.then(function (splitsItem) {
                    const splitData = JSON.parse(splitsItem);
                    const splitList = splitData.result.value.splits.value.list;
                    if (splitList) {
                        const filterSplitsByIdentities = Helper.FilterSplitsByIdentity(filterIdentities, splitList)
                        const ownableIDList = Helper.GetIdentityOwnableId(filterSplitsByIdentities)
                        ownableIDList.forEach((ownableID) => {
                            const filterAssetList = assetsQuery.queryAssetWithID(ownableID);
                            filterAssetList.then(function (Asset) {
                                const parsedAsset = JSON.parse(Asset);
                                setAssetList((assetList) => [
                                    ...assetList,
                                    parsedAsset,
                                ]);

                            })
                        })
                    } else {
                        console.log("no splits found")
                    }


                })
            })
        }
        fetchAssets();
    }, []);

    return (
        <div className="container">
            <div className="accountInfo">
                <div className="row row-cols-1 row-cols-md-2 card-deck createAccountSection">

                    {assetList.map((asset, index) => {
                        var immutableProperties = "";
                        var mutableProperties = "";
                        if (asset.result.value.assets.value.list[0].value.immutables.value.properties.value.propertyList !== null) {
                            immutableProperties = Helper.ParseProperties(asset.result.value.assets.value.list[0].value.immutables.value.properties.value.propertyList);
                        }
                        if (asset.result.value.assets.value.list[0].value.mutables.value.properties.value.propertyList !== null) {
                            mutableProperties = Helper.ParseProperties(asset.result.value.assets.value.list[0].value.mutables.value.properties.value.propertyList)
                        }
                        var immutableKeys = Object.keys(immutableProperties);
                        var mutableKeys = Object.keys(mutableProperties);
                        return (
                            <div className="col-md-6" key={index}>
                                <div className="card">
                                    <p>Immutables</p>
                                    {
                                        immutableKeys.map((keyName, index1) => {
                                            if (immutableProperties[keyName] !== "") {
                                                const metaQueryResult = metasQuery.queryMetaWithID(immutableProperties[keyName]);
                                                metaQueryResult.then(function (item) {
                                                    const data = JSON.parse(item);
                                                    let myelement = "";
                                                    let metaValue = Helper.FetchMetaValue(data, immutableProperties[keyName])
                                                    myelement = <span>{metaValue}</span>;
                                                    ReactDOM.render(myelement, document.getElementById(`immutable_asset` + index + `${index1}`));
                                                });
                                                return (<a key={index + keyName}><b>{keyName} </b>: <span
                                                    id={`immutable_asset` + index + `${index1}`}></span></a>)
                                            } else {
                                                return (
                                                    <a key={index + keyName}><b>{keyName} </b>: <span>{immutableProperties[keyName]}</span></a>)
                                            }
                                        })
                                    }
                                    <p>mutables</p>
                                    {
                                        mutableKeys.map((keyName, index1) => {
                                            if (mutableProperties[keyName] !== "") {
                                                const metaQueryResult = metasQuery.queryMetaWithID(mutableProperties[keyName]);
                                                metaQueryResult.then(function (item) {
                                                    const data = JSON.parse(item);
                                                    let myelement = "";
                                                    let metaValue = Helper.FetchMetaValue(data, mutableProperties[keyName])
                                                    myelement = <span>{metaValue}</span>;
                                                    ReactDOM.render(myelement, document.getElementById(`mutable_asset` + index + `${index1}`));
                                                })
                                                return (<a key={index + keyName}><b>{keyName} </b>: <span
                                                    id={`mutable_asset` + index + `${index1}`}></span></a>)
                                            } else {
                                                return (
                                                    <a key={index + keyName}><b>{keyName} </b>: <span>{mutableProperties[keyName]}</span></a>)
                                            }
                                        })
                                    }

                                </div>
                            </div>
                        )
                    })}
                </div>
                <Modal
                    className="accountInfoModel"
                    centered
                >
                    <Modal.Header>
                        <div className="icon failure-icon">
                            <i class="mdi mdi-close"></i>
                        </div>
                    </Modal.Header>
                    <Modal.Body>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary">
                            ok
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default Assets;
