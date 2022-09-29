import GetProperties from "../../utilities/GetProperties";
import FilterData from "../../utilities/FilterData";
import {queryIdentities} from "mantlejs/build/transaction/identity/query";
import {queryMaintainer} from "mantlejs/build/transaction/maintainers/query";
export const SET_MAINTAINERS = "SET_MAINTAINERS";
const identitiesQuery = new queryIdentities(process.env.REACT_APP_ASSET_MANTLE_API);
const maintainersQuery = new queryMaintainer(process.env.REACT_APP_ASSET_MANTLE_API);
export const fetchMaintainers = (identityID) => {
    return async (dispatch) => {
        try {
            const identities = await identitiesQuery.queryIdentityWithID(identityID);
            const data = JSON.parse(identities);
            const dataList = data.result.value.identities.value.list;
            if (dataList) {
                const maintainersData = await maintainersQuery.queryMaintainerWithID("all");
                const parsedMaintainersData = JSON.parse(maintainersData);
                const maintainersDataList = parsedMaintainersData.result.value.maintainers.value.list;
                if (maintainersDataList) {
                    const filterMaintainersByIdentity = FilterData.FilterMaintainersByIdentity(identityID, maintainersDataList);
                    if (filterMaintainersByIdentity.length) {
                        const maintainersListNew = [];
                        for (const identity of filterMaintainersByIdentity) {
                            let maintainedTraits = "";
                            if (identity.value.maintainedTraits.value.properties.value.propertyList !== null) {
                                maintainedTraits = await GetProperties.ParseProperties(identity.value.maintainedTraits.value.properties.value.propertyList);
                            }
                            let classificationID = identity.value.id.value.classificationID.value.idString;
                            let id = identity.value.id.value.identityID.value.idString;
                            maintainersListNew.push({
                                'addMaintainer': identity.value.addMaintainer,
                                'mutateMaintainer': identity.value.mutateMaintainer,
                                'removeMaintainer': identity.value.removeMaintainer,
                                'totalData': maintainedTraits[0],
                                'classificationID': classificationID,
                                'identityID': id,
                            });
                        }

                        dispatch({
                            type: SET_MAINTAINERS,
                            maintainers: maintainersListNew,
                            loading: false,
                            data: ''
                        });
                    } else {
                        throw new Error("Assets Not found");

                    }
                } else {
                    throw new Error("Assets Not found");
                }
            } else {
                throw new Error("Assets Not found");
            }
        } catch (err) {
            console.log(err.message);
            dispatch({
                type: SET_MAINTAINERS,
                maintainers: [],
                loading: false,
                data: err.message,
            });
        }

    };
};
