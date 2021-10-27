function SendMsg(fromAddress, toAddress, amount, denom) {
    return {
        type: "cosmos-sdk/MsgSend",
        value: {
            from_address: fromAddress,
            to_address: toAddress,
            amount: [{ amount: String(amount), denom: denom }],
        },
    };
}

function Fee(amount, gas = 250000) {
    return {amount: [{amount: String(0), denom: "umantle"}], gas: String(gas)};
}


export default {
    SendMsg,
    Fee
};
