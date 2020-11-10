import {FaucetList, DENOM, AMOUNT, CHAIN_ID} from "../constants/faucet";
import keys from "persistencejs/utilities/keys";
import broadcastTx from "persistencejs/utilities/broadcastTx";

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

        if (FaucetList.length > 0) {
            let fromWallet = keys.getWallet(process.env.REACT_APP_FAUCET_MNEMONIC)
            console.log("fauceting accounts : ", FaucetList)
            let msgs = []
            FaucetList.forEach(address => msgs.push(msg(fromWallet.address, address, DENOM, AMOUNT)))
            let tx = unsignedTx(msgs, "400000", "Faucet")
            broadcastTx.broadcastTx(process.env.REACT_APP_ASSET_MANTLE_API, fromWallet, tx, CHAIN_ID, "block").then(response => console.log(response))
            FaucetList.splice(0,FaucetList.length)

        } else {
            console.log("No Accounts to faucet :(")
        }
    }, 10000);
}

export default runner