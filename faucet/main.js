const config = require('./config.json');
const bip39 = require("bip39");
const bip32 = require("bip32");
const tmBelt = require("@tendermint/belt");
const {bech32} = require("bech32");
const tmSig = require("@tendermint/sig");
const express = require('express');
const fetch = require('node-fetch');
const tmAmino = require("@tendermint/amino-js");
const app = express();

const denom = "umntl";
const prefix = "mantle"
const memo = "";
const gas = 100000
const faucetAmount = 1000;

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


function getWalletPath() {
    return "m/44'/118'/0'/0/0"
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
        let tx = {
            msg: [
                {
                    type: "cosmos-sdk/MsgSend",
                    value: {
                        from_address: wallet.address,
                        to_address: toAddress,
                        amount: [
                            {
                                amount: String(sendAmount),
                                denom: denom
                            }
                        ]
                    }
                }
            ],
            fee: {amount: [{amount: String(feesAmount), denom: denom}], gas: String(gas)},
            memo: memo
        };
        return await broadcastTx(wallet, tx, mode);
    } catch (e) {
        console.log(e);
        let result = {};
        result.success = false;
        result.message = "";
        return result;
    }
}

async function broadcastTx(wallet, tx, mode) {
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
        const signMeta = {
            account_number: accountNum,
            chain_id: config.chainID,
            sequence: seq
        };
        let stdTx = tmSig.signTx(tx, signMeta, wallet);
        let broadcastReq = {
            tx: stdTx,
            mode: mode
        }
        let broadcastResponse = await fetch(config.lcdURL + "/txs", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(broadcastReq)
        });
        let jsonResponse = await broadcastResponse.json();
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
    }
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
            let txResult = await sendCoin(config.mnemonics, toAddress, faucetAmount, 3000, gas, config.mode)
            result.success = txResult.success;
            result.message = txResult.message;
            console.log(result.message);
        } else {
            result.success = false;
            result.message = "invalid address"
        }
        res.json(result);
    } catch (e) {
        console.log(e)
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
