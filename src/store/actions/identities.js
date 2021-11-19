import GetProperties from "../../utilities/GetProperties";
import helper from "../../utilities/helper";
import {queryIdentities} from "persistencejs/build/transaction/identity/query";

const identitiesQuery = new queryIdentities(process.env.REACT_APP_ASSET_MANTLE_API);
export const SET_IDENTITIES = "SET_IDENTITIES";

export const fetchIdentities = (identityId) => {
    return async (dispatch) => {
        try {
            const identities = await identitiesQuery.queryIdentityWithID(identityId);
            const data = JSON.parse(identities);
            const dataList = data.result.value.identities.value.list;
            if (dataList) {
                let identitiesList = [];
                await Promise.all(dataList.map(async (identity)=>{
                    let immutableProperties = [];
                    let mutableProperties = [];
                    if (identity.value.immutables.value.properties.value.propertyList !== null) {
                        immutableProperties = await GetProperties.ParseProperties(identity.value.immutables.value.properties.value.propertyList);
                    }
                    if (identity.value.mutables.value.properties.value.propertyList !== null) {
                        mutableProperties = await GetProperties.ParseProperties(identity.value.mutables.value.properties.value.propertyList);
                    }

                    const totalData = {...immutableProperties[0], ...mutableProperties[0]};
                    const objSorted = helper.SortObjectData(totalData);
                    identitiesList.push({
                        'totalData': objSorted,
                        'immutableProperties': immutableProperties[0],
                        'mutableProperties': mutableProperties[0],
                        'provisionedAddressList': identity.value.provisionedAddressList,
                        'unprovisionedAddressList': identity.value.unprovisionedAddressList,
                    });
                }));
                dispatch({
                    type: SET_IDENTITIES,
                    identities: identitiesList,
                    loading: false,
                    data: ''
                });
            } else {
                dispatch({
                    type: SET_IDENTITIES,
                    identities: [],
                    loading: false,
                    data: "Data not found",
                });
            }

        } catch (err) {
            console.log(err);
            dispatch({
                type: SET_IDENTITIES,
                identities: [],
                loading: false,
                data: "Data not found",
            });
        }
    };
};
