import {querySplits} from "persistencejs/build/transaction/splits/query";

const splitsQuery = new querySplits(process.env.REACT_APP_ASSET_MANTLE_API);
export const SET_WRAPPED_COINS = "SET_WRAPPED_COINS";

export const fetchWrappedCoins = (identityID) => {
    return async (dispatch) => {
        try {
            const splits = await splitsQuery.querySplitsWithID('all');
            const data = JSON.parse(splits);
            const dataList = data.result.value.splits.value.list;
            if (dataList) {
                let wrappedCoins = 0;
                for (const split of dataList) {
                    let ownerId = split.value.id.value.ownerID.value.idString;
                    if(identityID === ownerId){
                        wrappedCoins = split.value.split;
                    }
                }
                dispatch({
                    type: SET_WRAPPED_COINS,
                    wrappedCoins: wrappedCoins,
                    data:''
                });
            }
            else {
                dispatch({
                    type: SET_WRAPPED_COINS,
                    wrappedCoins: 0,
                    data: "Data not found",
                });
            }

        } catch (err) {
            console.log(err);
            dispatch({
                type: SET_WRAPPED_COINS,
                wrappedCoins: 0,
                data: "Data not found",
            });
        }
    };
};
