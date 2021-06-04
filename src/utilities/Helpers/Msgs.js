function SendMsg(fromAddress, toAddress, amount, denom) {
    return {
            type: "cosmos-sdk/MsgSend",
            value: {
                from_address: 'cosmos1aepmuldh8j05y57zh5tje3fuzk63mc2m49uzzg',
                to_address: 'cosmos1pkkayn066msg6kn33wnl5srhdt3tnu2vzasz9c',
                amount: [{ amount: String(5000), denom: 'stake' }],
            },
    };
}

function Fee(amount, gas = 250000) {
    return {amount: [{amount: String(amount), denom: "uxprt"}], gas: String(gas)};
}


export default {
    SendMsg,
    Fee
}