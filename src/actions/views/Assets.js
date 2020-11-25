import React, {useState, useEffect} from "react";
import ReactDOM from 'react-dom';
import splitsQueryJS from "persistencejs/transaction/splits/query";
import assetsQueryJS from "persistencejs/transaction/assets/query";
import Helpers from "../../utilities/Helper";
import {Dropdown, Modal, Button} from "react-bootstrap";
import metasQueryJS from "persistencejs/transaction/meta/query";
import identitiesQueryJS from "persistencejs/transaction/identity/query";
import {MintAsset, MutateAsset, BurnAsset, Wrap, UnWrap} from "../forms/assets";
import AssetDefineJS from "persistencejs/transaction/assets/define";
import {Define} from "../forms";
import {MakeOrder} from "../forms/orders";
import loader from "../../assets/images/loader.svg"

const metasQuery = new metasQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const identitiesQuery = new identitiesQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const assetsQuery = new assetsQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)
const splitsQuery = new splitsQueryJS(process.env.REACT_APP_ASSET_MANTLE_API)

const assetDefine = new AssetDefineJS(process.env.REACT_APP_ASSET_MANTLE_API)
const Assets = () => {
    const Helper = new Helpers();
    const [showAsset, setShowAsset] = useState(false);
    const [externalComponent, setExternalComponent] = useState("");
    const [assetId, setAssetId] = useState("");
    const [assetList, setAssetList] = useState([]);
    const [splitList, setSplitList] = useState([]);
    const [mutateProperties, setMutateProperties] = useState({});
    const [asset, setAsset] = useState({});
    const userAddress = localStorage.getItem('address');
    const handleClose = () => {
        setShowAsset(false);
    };
    useEffect(() => {
        const fetchAssets = () => {
            const identities = identitiesQuery.queryIdentityWithID("all")
            identities.then(function (item) {
                const data = JSON.parse(item);
                const dataList = data.result.value.identities.value.list;
                if(dataList) {
                    const filterIdentities = Helper.FilterIdentitiesByProvisionedAddress(dataList, userAddress)
                    const splits = splitsQuery.querySplitsWithID("all")

                    splits.then(function (splitsItem) {
                        const splitData = JSON.parse(splitsItem);
                        const splitList = splitData.result.value.splits.value.list;
                        if (splitList) {
                            const filterSplitsByIdentities = Helper.FilterSplitsByIdentity(filterIdentities, splitList)
                            setSplitList(filterSplitsByIdentities)

                            filterSplitsByIdentities.map((split, index) => {
                                const ownableID = Helper.GetIdentityOwnableId(split)
                                const filterAssetList = assetsQuery.queryAssetWithID(ownableID);
                                filterAssetList.then(function (Asset) {
                                    const parsedAsset = JSON.parse(Asset);
                                    console.log(parsedAsset, "parsedAsset")
                                    if(parsedAsset.result.value.assets.value.list !== null) {
                                        const assetId = Helper.GetAssetID(parsedAsset.result.value.assets.value.list[0]);
                                        if (ownableID === assetId) {
                                            setAssetList(assetList => [...assetList, parsedAsset]);
                                            let immutableProperties = "";
                                            let mutableProperties = "";
                                            if (parsedAsset.result.value.assets.value.list[0].value.immutables.value.properties.value.propertyList !== null) {
                                                immutableProperties = Helper.ParseProperties(parsedAsset.result.value.assets.value.list[0].value.immutables.value.properties.value.propertyList);
                                            }
                                            if (parsedAsset.result.value.assets.value.list[0].value.mutables.value.properties.value.propertyList !== null) {
                                                mutableProperties = Helper.ParseProperties(parsedAsset.result.value.assets.value.list[0].value.mutables.value.properties.value.propertyList)
                                            }
                                            let immutableKeys = Object.keys(immutableProperties);
                                            let mutableKeys = Object.keys(mutableProperties);
                                            immutableKeys.map((keyName, index1) => {
                                                if (immutableProperties[keyName] !== "") {
                                                    const metaQueryResult = metasQuery.queryMetaWithID(immutableProperties[keyName]);
                                                    metaQueryResult.then(function (item) {
                                                        const data = JSON.parse(item);
                                                        let myElement = "";
                                                        let metaValue = Helper.FetchMetaValue(data, immutableProperties[keyName])
                                                        myElement = <span>{metaValue}</span>;
                                                        ReactDOM.render(myElement, document.getElementById(`immutable_asset` + index + `${index1}`));
                                                    });
                                                }
                                            })
                                            mutableKeys.map((keyName, index1) => {
                                                if (mutableProperties[keyName] !== "") {
                                                    const metaQueryResult = metasQuery.queryMetaWithID(mutableProperties[keyName]);
                                                    metaQueryResult.then(function (item) {
                                                        const data = JSON.parse(item);
                                                        let myElement = "";
                                                        let metaValue = Helper.FetchMetaValue(data, mutableProperties[keyName])
                                                        myElement = <span>{metaValue}</span>;
                                                        ReactDOM.render(myElement, document.getElementById(`mutable_asset` + index + `${index1}`));
                                                    })
                                                }
                                            })
                                        }
                                    }
                                })
                            })

                        } else {
                            console.log("no splits found")
                        }
                    })
                }
            })
        }
        fetchAssets();
    }, []);
    const handleModalData = (formName, mutableProperties1, asset1, assetId1) => {
        setMutateProperties(mutableProperties1)
        setAsset(asset1)
        setAssetId(assetId1)
        setShowAsset(true);
        setExternalComponent(formName)

    }
    return (
        <div className="container">
            <div className="accountInfo">
                <div className="row row-cols-1 row-cols-md-2 card-deck createAccountSection">
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Actions
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleModalData("DefineAsset")}>Define
                                Asset</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleModalData("MintAsset")}>Asset
                                Mint</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleModalData("Wrap")}>Wrap
                                Mint</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleModalData("UnWrap")}>UnWrap
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    {splitList.map((split, index) => {
                        let ownableID = Helper.GetIdentityOwnableId(split)
                        let ownableId = split.value.id.value.ownableID.value.idString;
                        let ownerId = split.value.id.value.ownerID.value.idString;
                        let stake = split.value.split;
                        return (
                            <div className="col-md-6" key={index}>
                                <div className="card">
                                    <p>OwnableId: {ownableId}</p>
                                    <p>OwnerId: {ownerId}</p>
                                    <p>Stake: {stake}</p>
                                    <div>
                                        <Button variant="secondary"
                                                onClick={() => handleModalData("MakeOrder", "", "", ownableID)}>Make</Button>
                                    </div>
                                    {
                                        assetList.map((asset, assetIndex) => {

                                            const assetId = Helper.GetAssetID(asset.result.value.assets.value.list[0]);
                                            if (ownableID === assetId) {
                                                let immutableProperties = "";
                                                let mutableProperties = "";
                                                if (asset.result.value.assets.value.list[0].value.immutables.value.properties.value.propertyList !== null) {
                                                    immutableProperties = Helper.ParseProperties(asset.result.value.assets.value.list[0].value.immutables.value.properties.value.propertyList);
                                                }
                                                if (asset.result.value.assets.value.list[0].value.mutables.value.properties.value.propertyList !== null) {
                                                    mutableProperties = Helper.ParseProperties(asset.result.value.assets.value.list[0].value.mutables.value.properties.value.propertyList)
                                                }
                                                let immutableKeys = Object.keys(immutableProperties);
                                                let mutableKeys = Object.keys(mutableProperties);
                                                return (
                                                    <div key={assetIndex}>
                                                        <div>
                                                            <Button variant="secondary"
                                                                    onClick={() => handleModalData("MutateAsset", mutableProperties, asset)}>Mutate
                                                                Asset</Button>
                                                            <Button variant="secondary"
                                                                    onClick={() => handleModalData("BurnAsset", "", asset)}>Burn
                                                                Asset</Button>

                                                        </div>
                                                        <p>Immutables</p>
                                                        {
                                                            immutableKeys.map((keyName, index1) => {
                                                                if (immutableProperties[keyName] !== "") {
                                                                    return (
                                                                        <a key={index + keyName}><b>{keyName} </b>: <span
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
                                                                    return (
                                                                        <a key={index + keyName}><b>{keyName} </b>: <span
                                                                            id={`mutable_asset` + index + `${index1}`}></span></a>)
                                                                } else {
                                                                    return (
                                                                        <a key={index + keyName}><b>{keyName} </b>: <span>{mutableProperties[keyName]}</span></a>)
                                                                }
                                                            })
                                                        }
                                                    </div>
                                                )
                                            }
                                        })
                                    }

                                </div>
                            </div>
                        )
                    })}
                </div>
                <Modal
                    show={showAsset}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    centered
                >
                    {externalComponent === 'DefineAsset' ?
                        <Define ActionName={assetDefine} FormName={'Define Asset'} type={'asset'}/> :
                        null
                    }
                    {
                        externalComponent === 'MintAsset' ?
                            <MintAsset/> :
                            null
                    }
                    {externalComponent === 'MutateAsset' ?
                        <MutateAsset mutatePropertiesList={mutateProperties} asset={asset}/> :
                        null
                    }
                    {
                        externalComponent === 'BurnAsset' ?
                            <BurnAsset asset={asset}/> :
                            null
                    }
                    {
                        externalComponent === 'MakeOrder' ?
                            <MakeOrder assetId={assetId}/> :
                            null
                    }
                    {
                        externalComponent === 'Wrap' ?
                            <Wrap FormName={'Wrap'}/> :
                            null
                    }
                    {
                        externalComponent === 'UnWrap' ?
                            <UnWrap FormName={'UnWrap'}/> :
                            null
                    }
                </Modal>
            </div>
        </div>
    );
};

export default Assets;
