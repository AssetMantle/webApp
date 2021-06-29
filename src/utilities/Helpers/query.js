import {stringToPath} from "@cosmjs/crypto";
import {  Secp256k1HdWallet } from "@cosmjs/amino";
import config from "../../config";
import Msgs from './Msgs';

const crypto = require("crypto");
const passwordHashAlgorithm = "sha512";
const { SigningCosmosClient } = require("@cosmjs/launchpad");
const restAPI = process.env.REACT_APP_API;
const configCoinType = config.coinType;
async function defineQuery(address, mnemonic, data, actionName) {
    return await actionName.define(address, "test", mnemonic, data.fromID, data.mutablePropertyValue, data.immutablePropertyValue, data.mutableMetaPropertyValue, data.immutableMetaPropertyValue, config.feesAmount, config.feesToken, config.gas, config.mode);

}
async function mintAssetQuery(address, mnemonic, data, actionName) {
    return await actionName.mint(address, "test", mnemonic, data.toID, data.FromId, data.classificationId, data.mutableValues, data.immutableValues, data.mutableMetaValues, data.immutableMetaValues, config.feesAmount, config.feesToken, config.gas, config.mode);

}
async function wrapQuery(address, mnemonic, data, actionName) {
    return await actionName.wrap(address, "test", mnemonic, data.FromId, data.CoinAmountDenom, config.feesAmount, config.feesToken, config.gas, config.mode);

}
async function unWrapQuery(address, mnemonic, data, actionName) {
    return await actionName.unwrap(address, "test", mnemonic, data.FromId, data.OwnableId, data.Split, config.feesAmount, config.feesToken, config.gas, config.mode);

}
async function nubIdQuery(address, mnemonic, data, actionName) {
    return await actionName.nub(address, "test", mnemonic, data.nubId, config.feesAmount, config.feesToken, config.gas, config.mode);

}
async function issueIdentityQuery(address, mnemonic, data, actionName) {
    return await actionName.issue(address, "test", mnemonic, data.toAddress, data.FromId, data.classificationId, data.mutableValues, data.immutableValues, data.mutableMetaValues, data.immutableMetaValues, config.feesAmount, config.feesToken, config.gas, config.mode);

}

async function sendCoinQuery(address, mnemonic, data, actionName) {
    console.log(actionName);
    return await TransactionWithMnemonic( [Msgs.SendMsg(address, data.toAddress, data.amountData, data.denom)],Msgs.Fee(5000, 200000), "" , mnemonic);
}

function PrivateKeyReader(file, password) {
    return new Promise(function (resolve, reject) {
        const fileReader = new FileReader();
        fileReader.readAsText(file, "UTF-8");
        fileReader.onload = event => {
            const res = JSON.parse(event.target.result);
            const decryptedData = decryptStore(res, password);
            if (decryptedData.error != null) {
                reject(decryptedData.error);
            } else {
                // const wallet = keyUtils.getWallet(decryptedData.mnemonic)
                // console.log(decryptedData.mnemonic, wallet.address, event.target.result,'whole data')
                resolve(decryptedData.mnemonic);
                localStorage.setItem('encryptedMnemonic', event.target.result);
            }
        };
    });
}

function createStore(mnemonic, password) {
    try {
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);
        let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
        let encrypted = cipher.update(mnemonic);
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        let obj = {
            "hashpwd": crypto.createHash(passwordHashAlgorithm).update(password).digest("hex"),
            "iv": iv.toString("hex"),
            "salt": key.toString("hex"),
            "crypted": encrypted.toString("hex")
        };
        return {
            Response: obj
        };
    } catch (exception) {
        return {
            success: false,
            error: exception.message
        };
    }
}

function decryptStore(fileData, password) {
    let hashpwd = fileData.hashpwd;
    let iv = fileData.iv;
    let salt = fileData.salt;
    let crypted = fileData.crypted;

    if (hashpwd === crypto.createHash(passwordHashAlgorithm).update(password).digest("hex")) {
        let ivText = Buffer.from(iv, "hex");
        let encryptedText = Buffer.from(crypted, "hex");

        let decipher = crypto.createDecipheriv(
            "aes-256-cbc",
            Buffer.from(salt, "hex"),
            ivText
        );
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return {
            mnemonic: decrypted.toString(),
        };
    } else {
        return {
            error: "Incorrect password."
        };
    }
}

async function Transaction(wallet, signerAddress, msgs, fee, memo = "") {
    console.log(wallet, signerAddress, msgs, fee, memo, "Rer");
    const cosmJS = new SigningCosmosClient(restAPI, signerAddress, wallet);
    return await cosmJS.signAndBroadcast(msgs, fee, memo);
}

async function TransactionWithMnemonic(msgs, fee, memo, mnemonic) {
    const [wallet, address] = await MnemonicWalletWithPassphrase(mnemonic);
    return Transaction(wallet, address, msgs, fee, memo);
}

async function MnemonicWalletWithPassphrase(mnemonic) {
    const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic);

    // const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    //     prefix: prefix,
    //     bip39Password: password,
    //     hdPaths: [hdPath]
    // });

    const [firstAccount] = await wallet.getAccounts();
    return [wallet, firstAccount.address];
}

function makeHdPath(accountNumber = "0", addressIndex = "0", coinType = configCoinType) {
    return stringToPath("m/44'/" + coinType + "'/" + accountNumber + "'/0/" + addressIndex);
}


export default {
    defineQuery,
    wrapQuery,
    unWrapQuery,
    nubIdQuery,
    sendCoinQuery,
    issueIdentityQuery,
    mintAssetQuery,
    PrivateKeyReader,
    createStore,
    decryptStore,
    Transaction,
    TransactionWithMnemonic,
    makeHdPath
};
