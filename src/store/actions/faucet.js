import {getFaucet} from "../../constants/url";
export const SET_FAUCET_DATA = "SET_FAUCET_DATA";

export const fetchFaucet = (address) => {
    return async (dispatch) => {
        try {
            const url = getFaucet(address);

            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data.result.value.coins, "PROFILE");
                    dispatch({
                        type: SET_FAUCET_DATA,
                        faucetData: data.result.value.coins,
                        data: ''
                    });
                }).catch((error) => {
                    console.log(error, "error section");
                });

            
            // fetch(url)
            //     .then(response => response.json())
            //     .then(result => {
            //         console.log(result.data.result.value, "PROFILE");
            //     })
            //     .catch(e => {
            //         console.log(e);
            //     });

        } catch (err) {
            console.log(err);
            dispatch({
                type: SET_FAUCET_DATA,
                assets: [],
                data: err.messsage,
            });
        }
    };
};
