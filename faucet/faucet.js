const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const keys = require("persistencejs/utilities/keys");
const broadcast = require("persistencejs/utilities/broadcastTx");
const constants = require("./constants")


function unsignedTx(msgs, gas, memo) {
    return {
        "msg": msgs,
        "fee": {"amount": [], "gas": gas},
        "signatures": null,
        "memo": memo
    }

}

function msg(fromAddress, toAddress, denom, amount) {
    return {
        "type": "cosmos-sdk/MsgSend",
        "value": {
            "from_address": fromAddress,
            "to_address": toAddress,
            "amount": [{
                "denom": denom, "amount": amount
            }]
        }
    }
}

function runner() {
    setInterval(function () {
        if (constants.FaucetList.length > 0) {
            let fromWallet = keys.getWallet(process.env.FAUCET_MNEMONIC)
            console.log("fauceting accounts : ", constants.FaucetList)
            let msgs = []
            constants.FaucetList.forEach(address => msgs.push(msg(fromWallet.address, address, constants.DENOM, constants.AMOUNT)))
            let tx = unsignedTx(msgs, "400000", "Faucet")
            console.log("Tx : ", tx)
            broadcast.broadcastTx(process.env.BLOCKCHAIN_REST_SERVER, fromWallet, tx, constants.CHAIN_ID, "block").then(response => console.log(response))
            constants.FaucetList.splice(0, constants.FaucetList.length)
        } else {
            console.log("No Accounts to faucet :(")
        }
    }, 10000);
}

function handleFaucetRequest(userAddress) {

    try {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", process.env.BLOCKCHAIN_REST_SERVER + "/auth/accounts/" + userAddress, false); // false for synchronous request
        xmlHttp.send(null);
        const accountResponse = JSON.parse(xmlHttp.responseText)

        if (constants.FaucetList.length < constants.FAUCET_LIST_LIMIT && !constants.FaucetList.includes(userAddress) && accountResponse.result.value.address == "") {
            constants.FaucetList.push(userAddress)
            console.log(userAddress, "ADDED TO LIST: total = ", constants.FaucetList.length)
            return JSON.stringify({result: "Success, your address will be faucet"})
        } else {
            console.log(userAddress, "NOT ADDED: total = ", constants.FaucetList.length)
            return JSON.stringify({result: "Failure, your account cannot be faucet right now, please try after sometime"})
        }
    } catch (e) {
        return JSON.stringify({result: "Failure, incorrect address"})
    }


}

module.exports = {runner, handleFaucetRequest}