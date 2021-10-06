import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import {querySplits} from "persistencejs/build/transaction/splits/query";
import {queryAssets} from "persistencejs/build/transaction/assets/query";
import {useTranslation} from "react-i18next";
import {Button} from "react-bootstrap";
import Loader from "../../../components/loader";
import config from "../../../constants/config.json";
import FilterHelpers from "../../../utilities/Helpers/filter";
import GetID from "../../../utilities/Helpers/getID";
import {MakeOrder} from "../../forms/orders";
import {SendSplit} from "../../forms/assets";
import GetProperties from "../../../utilities/GetProperties";
import helper from "../../../utilities/helper";

const assetsQuery = new queryAssets(process.env.REACT_APP_ASSET_MANTLE_API);
const splitsQuery = new querySplits(process.env.REACT_APP_ASSET_MANTLE_API);

const AssetList = React.memo(() => {
    const FilterHelper = new FilterHelpers();
    const GetIDHelper = new GetID();
    const {t} = useTranslation();
    let history = useHistory();
    const [assetList, setAssetList] = useState([]);
    const [loader, setLoader] = useState(true);
    const identityId = localStorage.getItem('identityId');
    const [externalComponent, setExternalComponent] = useState("");
    const [ownerId, setOwnerId] = useState("");
    const [ownableId, setOwnableId] = useState("");

    useEffect(() => {
        const fetchAssets = async () => {
            const splits = await splitsQuery.querySplitsWithID("all").catch(()=>{setLoader(false);});
            const splitData = JSON.parse(splits);
            const splitList = splitData.result.value.splits.value.list;
            if (splitList) {
                const filterSplitsByIdentities = FilterHelper.FilterSplitsByIdentity(identityId, splitList);
                if (filterSplitsByIdentities.length) {
                    const assetsListNew = [];
                    for (const split of filterSplitsByIdentities) {
                        let ownerId = split.value.id.value.ownerID.value.idString;
                        const ownableID = GetIDHelper.GetIdentityOwnableId(split);
                        const filterAssetList = await assetsQuery.queryAssetWithID(ownableID).catch(()=>{setLoader(false);});
                        const parsedAsset = JSON.parse(filterAssetList);
                        if (parsedAsset.result.value.assets.value.list !== null) {
                            const assetId = GetIDHelper.GetAssetID(parsedAsset.result.value.assets.value.list[0]);
                            if (ownableID === assetId) {
                                let immutableProperties = "";
                                let mutableProperties = "";
                                if (parsedAsset.result.value.assets.value.list[0].value.immutables.value.properties.value.propertyList !== null) {
                                    immutableProperties = await GetProperties.ParseProperties(parsedAsset.result.value.assets.value.list[0].value.immutables.value.properties.value.propertyList);
                                }
                                if (parsedAsset.result.value.assets.value.list[0].value.mutables.value.properties.value.propertyList !== null) {
                                    mutableProperties = await GetProperties.ParseProperties(parsedAsset.result.value.assets.value.list[0].value.mutables.value.properties.value.propertyList);
                                }
                                const totalData = {...immutableProperties, ...mutableProperties};
                                const objSorted = helper.SortObjectData(totalData);
                                assetsListNew.push({'totalData': objSorted, 'ownerID':ownerId, 'ownableID':ownableID, 'mutableProperties':mutableProperties});
                                setLoader(false);
                            } else {
                                setLoader(false);
                            }
                        } else {
                            setLoader(false);
                        }
                    }
                    setAssetList(assetsListNew);
                } else {
                    setLoader(false);
                }
            } else {
                setLoader(false);
            }
        };
        fetchAssets();
    }, []);

    const handleModalData = (formName, assetOwnerId, ownableId) => {
        setOwnerId(assetOwnerId);
        setExternalComponent(formName);
        setOwnableId(ownableId);
    };

    const handleAsset = (assetid, asset) => {
        if (assetid !== "stake") {
            history.push({
                pathname: '/asset/view',
                state: {
                    assetID: assetid,
                    currentPath: window.location.pathname,
                    assetList : asset
                }
            }
            );
        }
    };
    return (
        <div className="list-container">
            {loader ?
                <Loader/>
                : ""
            }

            <div className="row card-deck">
                {assetList.length ?
                    assetList.map((asset, index) => {
                        return (
                            <div className="col-xl-3 col-lg-4 col-md-6  col-sm-12" key={index}>
                                <div className="card asset-card">
                                    <div className="info-section">
                                        {
                                            Object.keys(asset['totalData']).map(key => {
                                                let imageExtension;
                                                if(key === config.URI){
                                                    imageExtension = asset['totalData'][key].substring(asset['totalData'][key].lastIndexOf('.') + 1);
                                                }

                                                return(
                                                    <>
                                                        {
                                                            key === config.URI ?
                                                                imageExtension === "gltf" ?
                                                                    <div className="image-container">
                                                                        <model-viewer
                                                                            id="mv-astronaut"
                                                                            src={asset['totalData'][key]}
                                                                            camera-controls
                                                                            ar
                                                                            auto-rotate
                                                                            alt="A 3D model of an astronaut"
                                                                        >
                                                                        </model-viewer>
                                                                    </div>
                                                                    :
                                                                    <div className="image-container">
                                                                        <div className="assetImage">
                                                                            <img src={asset['totalData'][key]} alt="image"/>
                                                                        </div>
                                                                    </div>
                                                                : ""
                                                        }
                                                        {
                                                            key === "identifier" ?
                                                                <div className="list-item"><p
                                                                    className="list-item-label">{key}: </p> <p
                                                                    className="list-item-value">{asset['totalData'][key]}</p>
                                                                </div>
                                                                : ""
                                                        }
                                                    </>
                                                );
                                            })
                                        }
                                        {asset['ownableID'] !== "stake" ?
                                            <>
                                                <div className="list-item">
                                                    <p className="list-item-label">{t("ASSET_ID")}:</p>
                                                    <div className="list-item-value id-section">
                                                        <p className="id-string" title={asset['ownableID']}> {asset['ownableID']}</p>
                                                    </div>
                                                </div>

                                            </>
                                            :
                                            <div className="list-item">
                                                <p className="list-item-label">{t("ASSET_ID")}:</p>
                                                <p className="list-item-value" title={asset['ownableID']}>{asset['ownableID']}</p>
                                            </div>

                                        }

                                        <div className="list-item">
                                            <p className="list-item-label">{t("OWNER_ID")}:</p>
                                            <div className="list-item-value id-section">
                                                <p className="id-string" title={asset['ownerID']}> {asset['ownerID']}</p>
                                            </div>
                                        </div>

                                        {asset['ownableID'] === "stake" ?
                                            <div className="button-group">
                                                <Button variant="primary" size="sm"
                                                    onClick={() => handleModalData("MakeOrder",  asset['ownerID'], asset['ownableID'])}>{t("MAKE")}</Button>
                                                <Button variant="primary" size="sm"
                                                    onClick={() => handleModalData("SendSplit",  asset['ownerID'], asset['ownableID'])}>{t("SEND_SPLITS")}</Button>
                                            </div>
                                            : ""
                                        }

                                        {asset['ownableID'] !== "stake" ?
                                            <Button variant="primary" className="viewButton" size="sm"
                                                onClick={() => handleAsset(asset['ownableID'], asset)}>View</Button>
                                            :""
                                        }
                                    </div>
                                </div>
                            </div>
                        );
                    })
                    : <p className="empty-list">{t("ASSETS_NOT_FOUND")}</p>}
            </div><div>
                {
                    externalComponent === 'MakeOrder' ?
                        <MakeOrder setExternalComponent={setExternalComponent} ownerId={ownerId}
                            ownableId={ownableId}/> :
                        null
                }
                {
                    externalComponent === 'SendSplit' ?
                        <SendSplit setExternalComponent={setExternalComponent} ownerId={ownerId}
                            ownableId={ownableId}/> :
                        null
                }
            </div>
        </div>
    );
});
AssetList.displayName = 'AssetList';
export default AssetList;

