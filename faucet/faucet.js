require("dotenv").config();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const constants = require("./constants");
const {Secp256k1HdWallet} = require("@cosmjs/amino");
const {SigningCosmosClient, GasPrice} = require("@cosmjs/launchpad");
const {stringToPath} = require("@cosmjs/crypto");
const restAPI=process.env.BLOCKCHAIN_REST_SERVER;



console.log(restAPI)
function unsignedTx(msgs, gas, memo) {
    return {
        "msg": msgs,
        "fee": {"amount": [], "gas": gas},
        "signatures": null,
        "memo": memo
    };

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
    };
}
async function Transaction(wallet, signerAddress, msgs, fee, memo = '') {
    const cosmJS = new SigningCosmosClient(restAPI, signerAddress, wallet, GasPrice.fromString(constants.gas_price), {}, "sync" );
    return await cosmJS.signAndBroadcast(msgs, fee, memo);
}

async function MnemonicWalletWithPassphrase(mnemonic) {
    const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {prefix: constants.prefix, bip39Password:'',hdPaths:[stringToPath("m/44'/750'/0'/0/0")]});
    const [firstAccount] = await wallet.getAccounts();
    console.log(firstAccount.address);
    return [wallet, firstAccount.address];
}

function runner() {
    setInterval(async function ()  {
        if (constants.FaucetList.length > 0) {
            let [wallet, addr] = await MnemonicWalletWithPassphrase(process.env.FAUCET_MNEMONIC);
            console.log("fauceting accounts : ", constants.FaucetList);
            let msgs = [];
            constants.FaucetList.forEach(address => msgs.push(msg(addr, address, constants.DENOM, constants.AMOUNT)));
            Transaction(wallet,addr,msgs,{"amount": [], "gas": "500000"},"have fun").then(response => console.log(response));
            constants.FaucetList.splice(0, constants.FaucetList.length);
        } else {
             console.log("No Accounts to faucet :");
         }
    }, 10000);
}

function handleFaucetRequest(userAddress) {
    try {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", process.env.BLOCKCHAIN_REST_SERVER + "/auth/accounts/" + userAddress, false); // false for synchronous request
        xmlHttp.send(null);
        const accountResponse = JSON.parse(xmlHttp.responseText);
        if (constants.FaucetList.length < constants.FAUCET_LIST_LIMIT && !constants.FaucetList.includes(userAddress) && accountResponse.result.value.address === "") {
            constants.FaucetList.push(userAddress);
            console.log(userAddress, "ADDED TO LIST: total = ", constants.FaucetList.length);
            return JSON.stringify({result: "Success, your address will be faucet"});
        } else {
            console.log(userAddress, "NOT ADDED: total = ", constants.FaucetList.length);
            return JSON.stringify({result: "Failure, your account cannot be faucet right now, please try after sometime"});
        }
    } catch (e) {
        return JSON.stringify({result:"Failure, Incorrect Address"});
    }


}

module.exports = {runner, handleFaucetRequest,MnemonicWalletWithPassphrase,Transaction};
