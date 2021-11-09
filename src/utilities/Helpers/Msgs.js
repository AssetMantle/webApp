import conig from "../../config";

function SendMsg(fromAddress, toAddress, amount, denom) {
    return {
        type: "cosmos-sdk/MsgSend",
        value: {
            from_address: fromAddress,
            to_address: toAddress,
            amount: [{amount: String(amount), denom: denom}],
        },
    };
}

// function SendMsg(fromAddress, toAddress, amount, denom) {
//     return {
//         typeUrl: "/cosmos.bank.v1beta1.MsgSend",
//         value: MsgSend.fromPartial({
//             fromAddress: fromAddress,
//             toAddress: toAddress,
//             amount: [{
//                 denom: denom,
//                 amount: String(amount),
//             }],
//         }),
//     };
// }


function Fee(amount, gas = 250000) {
    return {amount: [{amount: String(0), denom: conig.coinDenom}], gas: String(gas)};
}


export default {
    SendMsg,
    Fee
};
