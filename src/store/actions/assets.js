import GetProperties from "../../utilities/GetProperties";
import helper from "../../utilities/helper";
import GetID from "../../utilities/GetID";
import {queryAssets} from "persistencejs/build/transaction/assets/query";
import {querySplits} from "persistencejs/build/transaction/splits/query";

const assetsQuery = new queryAssets(process.env.REACT_APP_ASSET_MANTLE_API);
const splitsQuery = new querySplits(process.env.REACT_APP_ASSET_MANTLE_API);
export const SET_ASSETS = "SET_ASSETS";

export const fetchAssets = (identityID) => {
    return async (dispatch) => {
        try {
            const splits = await splitsQuery.querySplitsWithID(identityID+'|');
            const splitData = JSON.parse(splits);
            const splitList = splitData.result.value.splits.value.list;
            if (splitList) {
                const assetsListNew = [];
                await Promise.all(splitList.map(async (split)=>{
                    let ownerId = split.value.id.value.ownerID.value.idString;
                    const ownableID = GetID.GetIdentityOwnableId(split);
                    const filterAssetList = await assetsQuery.queryAssetWithID(ownableID);
                    const parsedAsset = JSON.parse(filterAssetList);
                    if (parsedAsset.result.value.assets.value.list !== null) {
                        const assetId = GetID.GetAssetID(parsedAsset.result.value.assets.value.list[0]);
                        if (ownableID === assetId) {
                            let immutableProperties = "";
                            let mutableProperties = "";
                            if (parsedAsset.result.value.assets.value.list[0].value.immutables.value.properties.value.propertyList !== null) {
                                immutableProperties = await GetProperties.ParseProperties(parsedAsset.result.value.assets.value.list[0].value.immutables.value.properties.value.propertyList);
                            }
                            if (parsedAsset.result.value.assets.value.list[0].value.mutables.value.properties.value.propertyList !== null) {
                                mutableProperties = await GetProperties.ParseProperties(parsedAsset.result.value.assets.value.list[0].value.mutables.value.properties.value.propertyList);
                            }
                            const totalData = {...immutableProperties[0], ...mutableProperties[0]};
                            const objSorted = helper.SortObjectData(totalData);
                            assetsListNew.push({
                                'totalData': objSorted,
                                'ownerID': ownerId,
                                'ownableID': ownableID,
                                'mutableProperties': mutableProperties[0],
                                'immutableProperties': immutableProperties[0],
                                'mutablePropertyTypes': mutableProperties[1],
                            });
                        }
                    }
                }));

                dispatch({
                    type: SET_ASSETS,
                    assets: assetsListNew,
                    loading: false,
                    data: ''
                });
            } else {
                dispatch({
                    type: SET_ASSETS,
                    assets: [],
                    loading: false,
                    data: "Assets Not found",
                });
            }

        } catch (err) {
            console.log(err);
            dispatch({
                type: SET_ASSETS,
                assets: [],
                loading: false,
                data: err.messsage,
            });
        }
    };
};
