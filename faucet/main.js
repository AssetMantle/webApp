import config from './config.json' assert {type: 'json'};
import * as tmSigLib from '@tendermint/sig';
import * as bip39 from './node_modules/bip39/src/index.js';
import * as bip32 from './node_modules/bip32/src/index.js';
import * as bech32Lib from './node_modules/bech32/dist/index.js';
import e from 'express';
import * as Cosmos from '@cosmostation/cosmosjs/src/index.js';
import * as fetchLib from './node_modules/node-fetch/lib/index.mjs';

import message from "@cosmostation/cosmosjs/src/messages/proto.js";

const bech32 = bech32Lib.bech32;
const tmSig = tmSigLib.default;
const fetch = fetchLib.default;
const app = e();

const denom = "umntl";
const prefix = "mantle";
const gas = 100000;
const faucetAmount = 1000000000;

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


function getWalletPath() {
    return "m/44'/118'/0'/0/0";
}

function getWallet(mnemonic, bip39Passphrase = "") {
    const seed = bip39.mnemonicToSeedSync(mnemonic, bip39Passphrase);
    const masterKey = bip32.fromSeed(seed);
    const walletPath = getWalletPath();
    return tmSig.createWalletFromMasterKey(masterKey, prefix, walletPath);
}

function getMantleAddress(address) {
    try {
        let words = bech32.decode(address).words;
        return bech32.encode("mantle", words);
    } catch (e) {
        console.log(e);
        return "";
    }
}

async function sendCoin(mnemonic, toAddress, sendAmount, feesAmount, gas, mode, memo = "") {
    try {
        const wallet = getWallet(mnemonic);
        
        const msgSend = new message.cosmos.bank.v1beta1.MsgSend({
            from_address: wallet.address,
            to_address: toAddress,
            amount: [{ denom: denom, amount: String(sendAmount) }]
        });
    
        const msgSendAny = new message.google.protobuf.Any({
            type_url: "/cosmos.bank.v1beta1.MsgSend",
            value: message.cosmos.bank.v1beta1.MsgSend.encode(msgSend).finish()
        });
    
        const tx = new message.cosmos.tx.v1beta1.TxBody({ messages: [msgSendAny], memo: "" });

        return await broadcastTx(wallet, sendAmount, tx);
    } catch (e) {
        console.log(e);
        let result = {};
        result.success = false;
        result.message = "";
        return result;
    }
}

async function broadcastTx(wallet, sendAmount, tx) {
    let result = {};
    result.success = false;
    result.message = "";
    try {
        let accountResult = await getAccount(wallet.address);
        let accountNum = accountResult.account.result.value.account_number;
        if (accountNum === undefined) {
            accountNum = String(0);
        }
        let seq = accountResult.account.result.value.sequence;
        if (seq === undefined) {
            seq = String(0);
        }

        const cosmos = new Cosmos.Cosmos(config.lcdURL, config.chainID);
        const pubKeyAny = cosmos.getPubKeyAny(Buffer.from(wallet.privateKey));

        const signerInfo = new message.cosmos.tx.v1beta1.SignerInfo({
            public_key: pubKeyAny,
            mode_info: { single: { mode: message.cosmos.tx.signing.v1beta1.SignMode.SIGN_MODE_DIRECT } },
            sequence: seq
        });
    
        const feeValue = new message.cosmos.tx.v1beta1.Fee({
            amount: [{ denom: denom, amount: String(sendAmount)}],
            gas_limit: 200000
        });
    
        const authInfo = new message.cosmos.tx.v1beta1.AuthInfo({ signer_infos: [signerInfo], fee: feeValue });
        
        const signedTxBytes = cosmos.sign(tx, authInfo, accountNum, wallet.privateKey);

        let jsonResponse = await cosmos.broadcast(signedTxBytes);
   
        let txHashResult = await getTxHash(jsonResponse);
        if (txHashResult.success) {
            result.success = true;
            result.message = txHashResult.txHash;
        }
        return result;
    } catch (e) {
        console.log(e);
    }
}

async function getAccount(address) {
    let result = {};
    result.success = false;
    result.account = {};
    try {
        let response = await fetch(config.lcdURL + "/auth/accounts/" + address);
        let json = await response.json();
        result.success = true;
        result.account = json;
        return result;
    } catch (e) {
        console.log(e);
        return result;
    }
}

async function getTxHash(response) {
    let result = {
        success: false,
        txHash: ""
    };
    try {
        if (response.code) {
            result.txHash = JSON.stringify(response.raw_log).message;
            return result;
        } else if (response.error) {
            result.txHash = JSON.stringify(response.raw_log).message;
            return result;
        } else {
            if (response.txhash) {
                result.success = true;
                result.txHash = response.txhash;
                return result;
            } else {
                console.log(JSON.stringify(response));
                result.txHash = "Tx failed due to unknown reasons";
                return result;
            }
        }
    } catch (e) {
        console.log(e);
        return result;
    }
}

app.get("/faucet/:address", async function (req, res) {
    try {
        console.log(req.params.address);
        const toAddress = getMantleAddress(req.params.address);
        let result = {};
        if (toAddress !== "") {
            let txResult = await sendCoin(config.mnemonics, toAddress, faucetAmount, 3000, gas, config.mode);
            result.success = txResult.success;
            result.message = txResult.message;
            console.log(result.message);
        } else {
            result.success = false;
            result.message = "invalid address";
        }
        res.json(result);
    } catch (e) {
        console.log(e);
        let result = {
            success: false,
            message: "unknown error"
        };
        res.json(result);
    }
});

let server = app.listen(config.port, config.host, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log("App listening at http://%s:%s", host, port);
});
