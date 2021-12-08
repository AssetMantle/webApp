require("dotenv").config();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const constants = require("./constants");
const {Secp256k1HdWallet} = require("@cosmjs/amino");
const {SigningStargateClient, Coin} = require("@cosmjs/stargate");
const {stringToPath} = require("@cosmjs/crypto");
const restAPI=process.env.BLOCKCHAIN_REST_SERVER;
const msgSendTypeUrl = "/cosmos.bank.v1beta1.MsgSend";
const {MsgSend, fromPartial} = require("cosmjs-types/cosmos/bank/v1beta1/tx");

function trimWhiteSpaces(data){
    return data.split(' ').join('');
}

function msg(fromAddress, toAddress, denom, amount) {
    return {
        typeUrl: msgSendTypeUrl,
        value: MsgSend.fromPartial({
            fromAddress: trimWhiteSpaces(fromAddress),
            toAddress: trimWhiteSpaces(toAddress),
            amount: [{
                denom: denom,
                amount: String(amount),
            }],
        }),
        test: MsgSend
    };
}
async function Transaction(wallet, signerAddress, msgs, fee, memo = '') {
    const cosmJS = await SigningStargateClient.connectWithSigner(process.env.RPC, wallet);
    return await cosmJS.signAndBroadcast(signerAddress, msgs, fee, memo); //DeliverTxResponse, 0 iff success   
}

async function MnemonicWalletWithPassphrase(mnemonic) {
    const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {prefix: constants.prefix, bip39Password:'',hdPaths:[stringToPath("m/44'/118'/0'/0/0")]});
    const [firstAccount] = await wallet.getAccounts();
    return [wallet, firstAccount.address];
}

function runner() {
    setInterval(async function ()  {
        if (constants.FaucetList.length > 0) {
            let [wallet, addr] = await MnemonicWalletWithPassphrase(process.env.FAUCET_MNEMONIC);
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
        xmlHttp.open("GET", process.env.BLOCKCHAIN_REST_SERVER + "/cosmos/auth/v1beta1/accounts/" + userAddress, false); // false for synchronous request
        xmlHttp.send(null);
        const accountResponse = JSON.parse(xmlHttp.responseText);
        if (constants.FaucetList.length < constants.FAUCET_LIST_LIMIT && !constants.FaucetList.includes(userAddress) && accountResponse.code === 5) {
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